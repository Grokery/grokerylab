import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AUTH_ENABLED, APPSTATUS} from "../../globals.js"
import { history } from '../../index.js'
import { setAppStatus } from '../../actions'
import { getSessionInfo } from '../../authentication'
import d3 from 'd3'
import './D3DataFlow.css'

/*

Node:
    hover        -> highlight node and peak info
    click        -> deselect all -> select node -> highlight node and flow (dont pan)
    shftclick    -> add to selected -> highlight node and flow for each
    dblclick     -> descelct all -> navigate to node details and select and pan to flow
    drag         -> drag node and all selected if part of selection
Edge
    hover        -> highlight edge
    click        -> deslect all -> select edge -> highlight edge
Svg
    click        -> deslect all
    scroll       -> zoom 
    drag         -> translate (dont deselect)
    rightclick   -> options menu
    shftdrag     -> draw rectangle and select nodes and edges included under rectangle -> deselect all else

*/

class D3DataFlow extends Component {
  static propTypes = {
    setAppStatus: PropTypes.func.isRequired,
    nodes: PropTypes.object.isRequired,
    selectedNodeId: PropTypes.string,
    onSelectNode: PropTypes.func,
    showControls: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    zoomOnHighlight: PropTypes.bool,
    singleClickNav: PropTypes.bool,
    colored: PropTypes.bool
  }
  render() {
    return (
      <div className='D3DataFlow'>
          <div id="flow-header-content" className={this.props.showControls ? '' : 'hidden'}>
            <div>
                <img className="drag-create-img" role='presentation' src="img/job.png" onMouseDown={this.createNodeDrag.bind(this, this.createJob.bind(this))}/>
                <img className="drag-create-img" role='presentation' src="img/source.png" onMouseDown={this.createNodeDrag.bind(this, this.createSource.bind(this))}/>
                <a><i className="fa fa-plus" aria-hidden="true"></i></a>
                <a onClick={this.onDelete.bind(this)}><i className="fa fa-trash" aria-hidden="true"></i></a>
                <a><i className="fa fa-filter" aria-hidden="true"></i></a>
            </div>
          </div>
        <div id='flow'></div>
      </div>
    )
  }
  componentDidMount() {
      this.initalizeD3()
  }
  componentWillReceiveProps(nextProps){
      this.props = nextProps
      this.initalizeD3()
  }
  shouldComponentUpdate(nextProps, nextState){
      return false
  }
  getWindowWidth(){
    const { width } = this.props
    if (!width) {
        const docEl = document.documentElement
        const flowEl = document.getElementById('flow')
        return window.innerWidth || docEl.clientWidth || flowEl.clientWidth
    }
    return width
  }
  getWindowHeight(){
    const { height } = this.props
    if (!height) {
        const docEl = document.documentElement
        const flowEl = document.getElementById('flow')
        let foo = window.innerHeight || docEl.clientHeight || flowEl.clientHeight
        return foo -= (foo*.06)
    }
    return height
  }
  initalizeD3() {
    const { selectedNodeId, nodes } = this.props
    let width = this.getWindowWidth()
    let height = this.getWindowHeight()
    this.d3state = {
        width: width,
        height: height,
        maxX: -9999,
        maxY: -9999,
        minX: 9999,
        minY: 9999,
        scale: .5,
        highlightedMaxX: -9999,
        highlightedMaxY: -9999,
        highlightedMinX: 9999,
        highlightedMinY: 9999,
        selectedNodes: selectedNodeId ? [nodes[selectedNodeId]] : [],
        selectedEdge: null,
        mouseDownNode: null,
        mouseDownEdge: null,
        dragging: false,
        justScaleTransGraph: false,
        lastKeyDown: -1,
        drawEdge: false,
        selectedText: null,
        dblClickSVGTimeout: false,
        dblClickNodeTimeout: false,
        dblClickPathTimeout: false,
        changedNodes: {},
        selectedClass: "selected",
        shapeGClass: "conceptG",
        shapeWidth: 160,
        shapeHeight: 120,
        xgridSize: 10,
        ygridSize: 10,
        nodes: [],
        edges: [],
        mouseLocation: [0,0],
        dragNode: null
    }
    var d3state = this.d3state

    // Set up D3 graph
    d3.select("#flow").selectAll("*").remove()

    this.svg = d3.select("#flow").append("svg")
        .attr("width", width)
        .attr("height", height)

    // define arrow for graph edges
    var defs = this.svg.append('svg:defs')
    defs.append('svg:marker')
        .attr('id', 'mark-end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 7)
        .attr('markerWidth', 3.5)
        .attr('markerHeight', 3.5)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')

    this.svgG = this.svg.append("g").classed("graph", true).attr("id","graph")

    // this.svgG.append("rect")
    //     .attr('x', '0')
    //     .attr('y', '0')
    //     .attr('fill','transparent')
    //     .attr('stroke', 'black')
    //     .attr('width' , 1000)
    //     .attr('height', 1000)

    // displayed when dragging between shapes
    this.dragLine = this.svgG.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M 0,0 C 0,0 0,0 0,0')
        .style('marker-end', 'url(#mark-end-arrow)')

    // svg nodes (shapes) and edges (paths)
    this.paths = this.svgG.append("g").selectAll("g")
    this.shapes = this.svgG.append("g").selectAll("g")

    // mouseup and mousedown
    this.svg.on("mousedown", function(d) {
        this.svgMouseDown.call(this, d)
    }.bind(this))
    .on("mouseup", function(d) {
        this.svgMouseUp.call(this, d)
    }.bind(this))
    .on('mousemove', function () {
        if (this.d3state.dragNode) {
            this.d3state.mouseLocation = d3.mouse(d3.select('#graph').node()) 
            let pagexy = d3.mouse(d3.select('#flow').node()) 
            let dragNode = document.getElementById("dragnode")
            dragNode.style.left = pagexy[0] - 15 + "px"
            dragNode.style.top = pagexy[1] - 15 + "px"
        } 
    }.bind(this))

    // handle drag
    this.drag = d3.behavior.drag()
        .origin(function(d) {
            return { x: d.x, y: d.y }
        })
        .on("dragstart", function() {
            if (!d3.event.sourceEvent.shiftKey) d3.select('#flow').style("cursor", "move")
        })
        .on("drag", function(args) {
            d3state.dragging = true
            this.dragmove.call(this, args)
        }.bind(this))
        .on("dragend", function() {
            d3.select('#flow').style("cursor", "auto")
        })

    // handle zoom
    this.zoomSvg = d3.behavior.zoom()
        .scaleExtent([0.05, 3])
        .on("zoom", function() {
            if (d3.event.sourceEvent.shiftKey) {
                return false
            } else {
                this.zoom.call(this)
            }
            return true
        }.bind(this))
        .on("zoomstart", function() {
            if (!d3.event.sourceEvent.shiftKey) d3.select('#flow').style("cursor", "move")
        })
        .on("zoomend", function() {
            d3.select('#flow').style("cursor", "auto")
        });
    this.svg.call(this.zoomSvg).on("dblclick.zoom", null)

    // listen for resize
    window.onresize = function() {
        this.updateWindow(this.svg)
    }.bind(this)

    this.renderD3()   
    this.centerAndFitFlow()
  }
  renderD3() {
      const { nodes, colored } = this.props
      let graph = this;
      let d3state = graph.d3state;
      
      if (Object.keys(nodes).length === 0){
          return
        }

      // Build node and edge lists and set min and max x and y
      Object.keys(nodes).forEach(function(key) {
          let node = nodes[key]
          if(!node.x){node.x = 0}
          if(!node.x){node.y = 0}
          d3state.maxX = d3state.maxX < node.x ? node.x : d3state.maxX
          d3state.minX = d3state.minX > node.x ? node.x : d3state.minX
          d3state.maxY = d3state.maxY < node.y ? node.y : d3state.maxY
          d3state.minY = d3state.minY > node.y ? node.y : d3state.minY
          if (!node.upstream){node.upstream = []}
          if (!node.downstream){node.downstream = []}
          node.downstream.forEach(function(dnode){
              if (nodes[dnode.id]) {
                  d3state.edges.push({ source: node, target: nodes[dnode.id] })
              }
          })
          d3state.nodes.push(node)
      })

      // Add padding 
      d3state.maxX += d3state.shapeWidth*2
      d3state.maxY += d3state.shapeHeight*2
      d3state.minY -= d3state.shapeHeight
      d3state.minX -= d3state.shapeWidth

      // get paths
      graph.paths = graph.paths.data(d3state.edges, function(d) {
          return String(d.source.id) + "+" + String(d.target.id);
      });
      let paths = graph.paths;

      // update existing paths
      paths.style('marker-end', 'url(#mark-end-arrow)')
          .classed(d3state.selectedClass, function(d) { return d === d3state.selectedEdge })
          .attr("d", function(d) { return graph.buildPathStr(d) })

      // add new paths
      paths.enter()
          .append("path")
          .style('marker-end', 'url(#mark-end-arrow)')
          .classed("link", true)
          .attr('id', function(d) { return "n" + d.source.id + d.target.id })
          .attr("d", function(d) { return graph.buildPathStr(d) })
          .on("mousedown", function(d) { graph.pathMouseDown.call(graph, d3.select(this), d) })
          .on("mouseup", function(d) { graph.pathMouseUp.call(graph, d3.select(this), d) })

      // remove old paths
      paths.exit().remove();

      // get shapes
      this.shapes = this.shapes.data(d3state.nodes, function(d) { return d.id; });

      // update existing shapes
      this.shapes.attr("transform", function(d) {
          let tr = "translate(" + (Math.round(d.x / d3state.xgridSize) * d3state.xgridSize)
          tr += "," + (Math.round(d.y / d3state.ygridSize) * d3state.ygridSize) + ")"
          return tr
      });

      // add new shapes
      let newGs = this.shapes.enter()
          .append("g");
    
      let coloredClass = colored ? ' colored' : ''
      newGs.classed(d3state.shapeGClass, true)
          .attr('id', function(d) { return "n" + d.id })
          .attr('class', function(d) { 
              return d3state.shapeGClass + " " + d.collection + "-node" + coloredClass
          })
          .attr("transform", function(d) {
              let tr = "translate(" + (Math.round(d.x / d3state.xgridSize) * d3state.xgridSize)
              tr += "," + (Math.round(d.y / d3state.ygridSize) * d3state.ygridSize) + ")"
              return tr
        })
          .on("mousedown", function(d) {
              graph.shapeMouseDown(d);
          })
          .on("mouseup", function(d) {
              graph.shapeMouseUp(d);
          })
          .on("mouseover", function(d) {
              d3.select(".tip-" + d.id).classed("hidden", false);
          })
          .on("mouseout", function(d) {
              d3.select(".tip-" + d.id).classed("hidden", true);
          })
          .call(this.drag);

      newGs.append("path")
          .attr('d', function(d) {
              if (d.collection==="masterdatasources") {
                  return "M 160 108" +
                      "c 0 6.62 -35.82 12 -80 12" +
                      "s -80 -5.38 -80 -12" +
                      "v -96" +
                      "c 0 -6.63 35.82 -12 80 -12" +
                      "s 80 5.37 80 12" +
                      "z" +
                      "M 160 12" +
                      "c 0 6.62 -35.82 12 -80 12" +
                      "s -80 -5.38 -80 -12";
              } else if (d.collection==="jobs") {
                  return "M 28.5 4.4" +
                      "c 1.3 -2.44 4.6 -4.4 7.36 -4.4" +
                      "h 88" +
                      "c 2.76 0 6.05 1.96 7.35 4.4" +
                      "l 27.3 51.17" +
                      "c 1.3 2.45 1.3 6.4 0 8.84" +
                      "l -27.3 51.17" +
                      "c -1.3 2.45 -4.6 4.43-7.35 4.43" +
                      "h -88" +
                      "c -2.77 0 -6.06 -1.98 -7.36 -4.42" +
                      "l -27.3 -51.16" +
                      "c -1.3 -2.44 -1.3 -6.4 0 -8.83" +
                      "z";
              } else if (d.collection==="datasources") {
                  return "M 16 120" +
                      "c -8.83 0 -16 -26.87 -16 -60 0 -33.14 7.17 -60 16 -60" +
                      "h 128" +
                      "c 8.84 0 16 26.86 16 60 0 33.13 -7.16 60 -16 60" +
                      "z";
              } else if (d.collection==="charts") {
                  return "M 16 120" +
                      "c -8.83 0 -16 -26.87 -16 -60 0 -33.14 7.17 -60 16 -60" +
                      "h 108" +
                      "c 2.76 0 6.05 1.96 7.35 4.4" +
                      "l 27.3 51.17" +
                      "c 1.3 2.45 1.3 6.4 0 8.84" +
                      "l -27.3 51.17" +
                      "c -1.3 2.45 -4.6 4.43-7.35 4.43" +
                      "z";
              } else if (d.collection==="dashboards") {
                  return "M 0 5" +
                      "c 0 -2.77 2.23 -5 5 -5" +
                      "h 150" +
                      "c 2.76 0 5 2.23 5 5" +
                      "v 110" +
                      "c 0 2.76 -2.24 5 -5 5" +
                      "h -150" +
                      "c -2.77 0 -5 -2.24 -5 -5" +
                      "z";
              } else {
                  return "M 0 5" +
                      "c 0 -2.77 2.23 -5 5 -5" +
                      "h 150" +
                      "c 2.76 0 5 2.23 5 5" +
                      "v 110" +
                      "c 0 2.76 -2.24 5 -5 5" +
                      "h -150" +
                      "c -2.77 0 -5 -2.24 -5 -5" +
                      "z";
              }
          })

    //   newGs.append('circle')    
    //       .attr('cx', '0')
    //       .attr('cy', '0')
    //       .attr('r','5')
    //       .attr('fill','black')
    //   newGs.append("rect")
    //       .attr('x', '0')
    //       .attr('y', '0')
    //       .attr('fill','transparent')
    //       .attr('width' , graph.d3state.shapeWidth)
    //       .attr('height', graph.d3state.shapeHeight)

        newGs.each(function(){
            let gEl = d3.select(this);
            let el = gEl.append("text")
                .attr("class", "node-text")
                .attr("dy", graph.d3state.shapeHeight/2+8)
                .attr("dx", graph.d3state.shapeWidth/2)
            el.text(function (d){
                if (d.collection === "jobs") {
                    return d.type_abrev ? d.type_abrev : 'Job'
                } else if (d.collection === "datasources") {
                    return d.type_abrev ? d.type_abrev : 'Source'
                } else if (d.collection === "charts") {
                    return d.type_abrev ? d.type_abrev : 'Chart'
                } else if (d.collection === "dashboards") {
                    return d.type_abrev ? d.type_abrev : 'Board'
                } else {
                    return ""
                }
            });
        });

        // newGs.each(function(){
        //     d3.select(this).append("text")
        //         .attr("class", function (d) {
        //                 return "hidden tooltiptext tip-" + d.id
        //         })
        //         .text(function (d) {
        //                 return d.title
        //         })
        // })

    //   newGs.each(function() {
    //       let gEl = d3.select(this)
    //       let el = gEl.append("text")
    //           .attr("class", "node-icon")
    //           .attr("dy", graph.d3state.shapeHeight / 2 + 21)
    //           .attr("dx", graph.d3state.shapeWidth / 2)
    //           .attr('font-family', 'FontAwesome')
    //       el.text(function(d) {
    //           if (d.collection==="jobs") {
    //               return "\uf121"
    //           } else if (d.collection==="datasources") {
    //               return "\uf1c0"
    //           } else if (d.collection==="charts") {
    //               return "\uf201"
    //           } else if (d.collection==="dashboards") {
    //               return "\uf009"
    //           } else {
    //               return ""
    //           }
    //       })
    //   })

    //   newGs.each(function(){
    //       let gEl = d3.select(this);
    //       let el = gEl.append("text")
    //           .attr("dy", graph.d3state.shapeHeight / 2 + 12)
    //           .attr("dx", graph.d3state.shapeWidth / 2)
    //       el.text(function (d){
    //           let maxlen = 17;
    //           if (d.title.length <= maxlen) {
    //               return d.title;
    //           } else {
    //               return d.title.substring(0, maxlen) + '...';
    //           }
    //       });
    //   });

      // remove old shapes
      this.shapes.exit().remove();

    this.selectNodes(d3state.selectedNodes)
  }
  updateWindow(svg) {
      var docEl = document.documentElement;
      var flowEl = document.getElementById('flow');
      var x = window.innerWidth || docEl.clientWidth || flowEl.clientWidth;
      var y = window.innerHeight || docEl.clientHeight || flowEl.clientHeight;
      svg.attr("width", x).attr("height", y);
  }
  centerAndFitFlow() {
    let d3state = this.d3state
    let {highlightedMaxX, highlightedMinX, highlightedMaxY, highlightedMinY} = this.d3state

    let maxX = highlightedMaxX !== -9999 ? highlightedMaxX : d3state.maxX 
    let minX = highlightedMinX !== 9999 ? highlightedMinX : d3state.minX 
    let maxY = highlightedMaxY !== -9999 ? highlightedMaxY : d3state.maxY
    let minY = highlightedMinY !== 9999 ? highlightedMinY : d3state.minY
    let xScale = Math.min(d3state.width / (maxX - minX), .5)
    let yScale = Math.min(d3state.height / (maxY - minY), .5)
    let scale = Math.min(xScale, yScale)
    let x = minX + (maxX - minX) / 2
    let y = minY + (maxY - minY) / 2

    // // graph 0,0
    // this.svgG.append("circle")
    //         .attr("cx", 0)
    //         .attr("cy", 0)
    //         .attr("fill", "red")
    //         .attr("r", 20) 

    // // flow center relative to graph 0,0
    // this.svgG.append("circle")
    //         .attr("cx", x)
    //         .attr("cy", y)
    //         .attr("fill", "green")
    //         .attr("r", 20) 

    this.translateAndZoomTo(x, y, scale)
  }
  translateAndZoomTo(x, y, scale) {
      this.zoom([this.d3state.width / 2 - x * scale, this.d3state.height / 2 - y * scale], scale);
  }
  zoom(tr, sc) {
      this.d3state.justScaleTransGraph = true;
      tr = tr ? tr : d3.event.translate;
      sc = sc ? sc : d3.event.scale;
      this.zoomSvg.translate(tr);
      this.zoomSvg.scale(sc);
      d3.select(".graph").attr("transform", "translate(" + tr + ") scale(" + sc + ")");
  }
  buildDragLineStr(d) {
      var mousexy = d3.mouse(this.svgG.node());
      var mouse = { x: mousexy[0], y: mousexy[1] };
      var xy2 = mouse.x + "," + mouse.y;
      var cxy2 = (mouse.x - 100) + "," + mouse.y;

      var xgrid = this.d3state.xgridSize;
      var ygrid = this.d3state.ygridSize;
      var shapeW = this.d3state.shapeWidth;
      var shapeH = this.d3state.shapeHeight;
      var shape = { x: (Math.round(d.x / xgrid) * xgrid + shapeW), y: (Math.round(d.y / ygrid) * ygrid + shapeH / 2) };
      var xy1 = shape.x + "," + shape.y;
      var cxy1 = (shape.x + 100) + "," + shape.y;

      return 'M' + xy1 + 'C' + cxy1 + " " + cxy2 + " " + xy2;
  }
  dragmove(d) {
      if (this.d3state.drawEdge) {
          this.dragLine.attr('d', this.buildDragLineStr(d));
      } else {
          d.x += d3.event.dx;
          d.y += d3.event.dy;
          this.d3state.changedNodes[d.id] = d;
          this.renderD3();
      }
  }
  spliceLinksForNode(node) {
      // remove edges associated with a node
      var toSplice = this.d3state.edges.filter(function(l) {
          return (l.source === node || l.target === node);
      });
      toSplice.map(function(l) {
          this.d3state.edges.splice(this.d3state.edges.indexOf(l), 1);
      }.bind(this));
  }
  selectEdge(d3Path, edgeData) {
      d3Path.classed(this.d3state.selectedClass, true);
      if (this.d3state.selectedEdge) {
          this.removeSelectFromEdge();
      }
      this.d3state.selectedEdge = edgeData;
      //$('#delete-button').removeClass('hidden');
  }
  removeSelectFromEdge() {
      if (!this.d3state.selectedEdge) { return }
      this.paths.filter(function(cd) {
          return cd === this.d3state.selectedEdge;
      }.bind(this)).classed(this.d3state.selectedClass, false);
      this.d3state.selectedEdge = null;
      //$('#delete-button').addClass('hidden');
  }
  pathMouseDown(d3path, d) {
      d3.event.stopPropagation();
      this.d3state.mouseDownEdge = d;
      var prevEdge = this.d3state.selectedEdge;
      if (!prevEdge || prevEdge !== d) {
          this.selectEdge(d3path, d);
      } else {
          this.removeSelectFromEdge();
      }
  }
  pathMouseUp() {
      d3.event.stopPropagation();

      var state = this.d3state;

      state.drawEdge = false;

      setTimeout(function() {
          state.dblClickPathTimeout = false;
      }, 300);

      if (state.dblClickPathTimeout) {

      } else {
          state.dblClickPathTimeout = true;
      }
  }
  addNodeToSelected(d) {
      this.d3state.selectedNodes.push(d)
      this.selectNodes(this.d3state.selectedNodes)
  }
  removeNodeFromSelected(d) {
      let index = this.d3state.selectedNodes.indexOf(d)
      if (index > -1) {
        this.d3state.selectedNodes.splice(index, 1);
      }
      this.selectNodes(this.d3state.selectedNodes)
  }
  selectNodes(nodes) {
      this.clearAllHighlight()
      if (!nodes || nodes.length > 0) {
        this.d3state.selectedNodes = nodes
        this.paths.classed('inactive', true)
        this.shapes.classed('inactive', true)
        nodes.forEach(function(node) {
            d3.select("#n" + node.id).classed(this.d3state.selectedClass, true)
            this.highlightFlow(node)
        }.bind(this))
      }
  }
  clearAllHighlight() {
    this.paths.classed(this.d3state.selectedClass, false)
    this.shapes.classed(this.d3state.selectedClass, false)
    this.paths.classed('inactive', false)
    this.shapes.classed('inactive', false)
  }
  highlightFlow(d) {
      const { zoomOnHighlight } = this.props

      let d3state = this.d3state
      d3state.highlightedMaxX = -9999
      d3state.highlightedMaxY = -9999
      d3state.highlightedMinX = 9999
      d3state.highlightedMinY = 9999

      d3.select("#n" + d.id).classed('inactive', false)
      this.highlightUpstream(d);
      this.highlightDownstream(d);

      d3state.highlightedMaxX += d3state.shapeWidth*2
      d3state.highlightedMaxY += d3state.shapeHeight*2
      d3state.highlightedMinX -= d3state.shapeHeight
      d3state.highlightedMinY -= d3state.shapeWidth
      if (zoomOnHighlight) {
          this.centerAndFitFlow()
      }
  }
  highlightUpstream(d) {
      const { nodes } = this.props

      if (!d) { return }
      let d3state = this.d3state
      d3state.highlightedMaxX = d3state.highlightedMaxX < d.x ? d.x : d3state.highlightedMaxX
      d3state.highlightedMinX = d3state.highlightedMinX > d.x ? d.x : d3state.highlightedMinX
      d3state.highlightedMaxY = d3state.highlightedMaxY < d.y ? d.y : d3state.highlightedMaxY
      d3state.highlightedMinY = d3state.highlightedMinY > d.y ? d.y : d3state.highlightedMinY

      if (!d.upstream) { return }
      d.upstream.forEach(function(node){
          d3.select('#n' + node.id).classed('inactive', false);
          d3.select('#n' + node.id + d.id).classed('inactive', false);
          this.highlightUpstream(nodes[node.id]);
      }.bind(this))
  }
  highlightDownstream(d) {
      const { nodes } = this.props

      if (!d) { return }
      let d3state = this.d3state
      d3state.highlightedMaxX = d3state.highlightedMaxX < d.x ? d.x : d3state.highlightedMaxX
      d3state.highlightedMinX = d3state.highlightedMinX > d.x ? d.x : d3state.highlightedMinX
      d3state.highlightedMaxY = d3state.highlightedMaxY < d.y ? d.y : d3state.highlightedMaxY
      d3state.highlightedMinY = d3state.highlightedMinY > d.y ? d.y : d3state.highlightedMinY

      if (!d.upstream) { return }
      d.downstream.forEach(function(node) {
          d3.select('#n' + node.id).classed('inactive', false);
          d3.select('#n' + d.id + node.id).classed('inactive', false);
          this.highlightDownstream(nodes[node.id]);
      }.bind(this))
  }
  shapeMouseDown(d) {
      d3.event.stopPropagation();
      this.d3state.mouseDownNode = d;

      if (d3.event.shiftKey) {
          this.d3state.drawEdge = true;
          this.dragLine.classed('hidden', false).attr('d', this.buildDragLineStr(d));
      }
  }
  shapeMouseUp(d) {
      let d3state = this.d3state;
      let sessionInfo = getSessionInfo()

      if (d3state.drawEdge) {
          d3state.drawEdge = false;
          this.dragLine.classed("hidden", true);
          if (d3state.mouseDownNode !== d) {
              // create new edge for mousedown edge and add to graph
              var newEdge = { source: d3state.mouseDownNode, target: d };
              var filtRes = this.paths.filter(function(d) {
                  if (d.source === newEdge.target && d.target === newEdge.source) {
                      this.d3state.edges.splice(this.d3state.edges.indexOf(d), 1);
                  }
                  return d.source === newEdge.source && d.target === newEdge.target;
              }.bind(this));
              if (!filtRes[0].length) {
                  this.d3state.edges.push(newEdge);
                  // update nodes with new edgeinfo
                  newEdge.source.downstream.push({ id: newEdge.target.id, collection: newEdge.target.collection });
                  newEdge.target.upstream.push({ id: newEdge.source.id, collection: newEdge.source.collection });
                  d3state.changedNodes[newEdge.source.id] = newEdge.source;
                  d3state.changedNodes[newEdge.target.id] = newEdge.target;
                  this.onUpdateNodes(d3state.changedNodes);
                  this.renderD3();
              }
          }
      } else if (d3state.dragging) {
          d3state.dragging = false;
          this.onUpdateNodes(d3state.changedNodes);
      } else if (d3state.dblClickNodeTimeout) {
          history.push("/clouds/"+ sessionInfo['selectedCloud'].id + "/" + d.collection + "/" + d.id + "?flow=open")
      } else {
          if (this.d3state.selectedNodes.indexOf(d) > -1) {
              this.removeNodeFromSelected(d)
          } else if (d3.event.shiftKey) {
            //   this.addNodeToSelected(d)
          } else {
            //   this.selectNodes([d])
              this.addNodeToSelected(d)
          }

        //       if (this.props.singleClickNav) {
        //           history.push("/clouds/"+ sessionInfo['selectedCloud'].id + "/" + d.collection + "/" + d.id)

          // set for potential dblclick
          d3state.dblClickNodeTimeout = true;
          setTimeout(function() {
              d3state.dblClickNodeTimeout = false;
          }, 300);
      }

      d3state.mouseDownNode = null;
  }
  svgMouseDown() {
      this.d3state.graphMouseDown = true;
  }
  svgMouseUp() {
      var d3state = this.d3state;

      if (!d3state.graphMouseDown) {
          if (d3state.drawEdge) {
              d3state.drawEdge = false;
              this.dragLine.classed("hidden", true);
          }
      } else if (d3state.justScaleTransGraph) {
          d3state.justScaleTransGraph = false;
      } else if (d3state.dblClickSVGTimeout) {
          // todo
      } else {
          d3state.dblClickSVGTimeout = true;
          setTimeout(function() {
              d3state.dblClickSVGTimeout = false;
          }, 300);
      }

      d3state.graphMouseDown = false;
  }
  createNodeDrag(cb, e) {
    let dragNode = e.target.cloneNode(true)
    dragNode.id = "dragnode"
    dragNode.style.height = "35px"
    dragNode.style.position = "absolute"
    document.getElementById("flow").appendChild(dragNode)
    this.d3state.dragNode = true
    window.onmouseup = function(e) {
        dragNode.parentNode.removeChild(dragNode)
        this.d3state.dragNode = false
        window.onmouseup = null
        cb(this.d3state.mouseLocation)
      }.bind(this)
  }
  createJob(xy) {
      this.createNode({
        collection: "jobs",
        title: "New Job",
        description: "Default description",
        upstream: [],
        downstream: [],
        x: xy[0],
        y: xy[1]
      })
  }
  createSource(xy) {
      this.createNode({
        collection: "datasources",
        title: "New Source",
        description: "Default description",
        upstream: [],
        downstream: [],
        x: xy[0],
        y: xy[1]
      })
  }
  createChart(xy) {
      this.createNode({
        collection: "charts",
        title: "New Chart",
        description: "Default description",
        upstream: [],
        downstream: [],
        x: xy[0],
        y: xy[1]
      })
  }
  createBoard(xy) {
      this.createNode({
        collection: "dashboards",
        title: "New Board",
        description: "Default description",
        upstream: [],
        downstream: [],
        x: xy[0],
        y: xy[1]
      })
  }
  createNode(newNode, tempNode) {
      newNode.x -= this.d3state.shapeWidth/2
      newNode.y -= this.d3state.shapeHeight/2
      this.removeNodeFromSelected()
      var onSuccess = function(result) {
          var node = {
              collection: result.collection,
              id: result.id,
              title: result.title,
              description: result.description,
              upstream: result.upstream,
              downstream: result.downstream,
              x: result.x,
              y: result.y
          }
          this.d3state.nodes.push(node);
          this.renderD3();
      }.bind(this);
      this.onCreateNode(newNode, onSuccess);
  }
  onCreateNode(newNode, cb){
    const { setAppStatus } = this.props
    setAppStatus(APPSTATUS.BUSY)
    const sessionInfo = getSessionInfo()
    const fullUrl = sessionInfo['selectedCloud']['url'] + "/resources/" + newNode.collection
    const token = sessionInfo['token']

    var myHeaders = new Headers({
        "Content-Type":"application/json"
    })
    if (AUTH_ENABLED && token) {
        myHeaders.append("Authorization", token)
    }
    var params = { 
        method: 'POST',
        mode: 'cors',
        headers: myHeaders,
        body: JSON.stringify(newNode)
    }
    return fetch(fullUrl, params)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    setAppStatus(APPSTATUS.ERROR)
                    return Promise.reject(json)
                }
                cb(json.Item)
                setAppStatus(APPSTATUS.OK)
            })
        )
  }
  onUpdateNodes(nodes, cb) {
    Object.keys(nodes).forEach(function(key){
        let node = nodes[key]
        this.onUpdateNode(node, cb)
    }.bind(this))
  }
  onUpdateNode(node, cb){
    const { setAppStatus } = this.props
    setAppStatus(APPSTATUS.BUSY)
    const sessionInfo = getSessionInfo()
    const fullUrl = sessionInfo['selectedCloud']['url'] + "/resources/" + node.collection + "/" + node.id
    const token = sessionInfo['token']

    var myHeaders = new Headers({
        "Content-Type":"application/json"
    })
    if (AUTH_ENABLED && token) {
        myHeaders.append("Authorization", token)
    }
    var params = { 
        method: 'PUT',
        mode: 'cors',
        headers: myHeaders,
        body: JSON.stringify(node)
    }
    return fetch(fullUrl, params)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    setAppStatus(APPSTATUS.ERROR)
                    return Promise.reject(json)
                }
                // cb(json)
                setAppStatus(APPSTATUS.OK)
            })
        )
  }
  deleteNode(node) {
    const { setAppStatus } = this.props
    setAppStatus(APPSTATUS.BUSY)
    const sessionInfo = getSessionInfo()
    const fullUrl = sessionInfo['selectedCloud']['url'] + "/resources/" + node.collection + "/" + node.id
    const token = sessionInfo['token']

    var myHeaders = new Headers({
        "Content-Type":"application/json"
    })
    if (AUTH_ENABLED && token) {
        myHeaders.append("Authorization", token)
    }
    var params = { 
        method: 'DELETE',
        mode: 'cors',
        headers: myHeaders
    }
    return fetch(fullUrl, params)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    setAppStatus(APPSTATUS.ERROR)
                    return Promise.reject(json)
                }
                this.d3state.nodes.splice(this.d3state.nodes.indexOf(node), 1);
                this.spliceLinksForNode(node);
                this.renderD3();
                setAppStatus(APPSTATUS.OK)
            })
        )
  }
  deleteEdge(edge) {
      var d3state = this.d3state;
      var source = edge.source;
      var target = edge.target;
      d3state.edges.splice(d3state.edges.indexOf(edge), 1);
      source.downstream = source.downstream.filter(function(n) { return n.id !== target.id; });
      target.upstream = target.upstream.filter(function(n) { return n.id !== source.id });
      d3state.changedNodes[source.id] = source;
      d3state.changedNodes[target.id] = target;
      this.onUpdateNodes(d3state.changedNodes);
      this.renderD3();
  }
  onDelete() {
      if (this.d3state.selectedNodes) {
        if (confirm("Confirm delete nodes?")===true) {
            this.d3state.selectedNodes.forEach(function(node) {
                this.deleteNode(node);
            }.bind(this))
            this.d3state.selectedNodes = []
            this.selectNodes(this.d3state.selectedNodes)
        }
      }
      if (this.d3state.selectedEdge) {
          // if (confirm("Confirm delete connection?")===true) {
          this.deleteEdge(this.d3state.selectedEdge);
          this.removeNodeFromSelected();
          // }
      }
  }
  buildPathStr(ed) {
      var xgrid = this.d3state.xgridSize;
      var ygrid = this.d3state.ygridSize;
      var nodeW = this.d3state.shapeWidth;
      var nodeH = this.d3state.shapeHeight;

      var target = { x: (Math.round(ed.target.x / xgrid) * xgrid), y: (Math.round(ed.target.y / ygrid) * ygrid + nodeH / 2) };
      var xy2 = target.x + "," + target.y;
      var cxy2 = (target.x - 100) + "," + target.y;

      var source = { x: (Math.round(ed.source.x / xgrid) * xgrid + nodeW), y: (Math.round(ed.source.y / ygrid) * ygrid + nodeH / 2) };
      var xy1 = source.x + "," + source.y;
      var cxy1 = (source.x + 100) + "," + source.y;

      return 'M' + xy1 + 'C' + cxy1 + " " + cxy2 + " " + xy2;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    nodes: state.nodes
  }
}

export default connect(mapStateToProps, {
    setAppStatus
})(D3DataFlow)
