import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { history } from '../../index.js'
import { setD3State, createNode, updateNode, deleteNode } from '../../actions'
import { getSessionInfo } from '../../authentication'
import d3 from 'd3'
import './D3DataFlow.css'

/*

Node:
    hover        -> soft highlight node and flow and peak info
    click        -> select node -> highlight node and flow (dont pan)
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
    setD3State: PropTypes.func.isRequired,
    createNode: PropTypes.func.isRequired,
    updateNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
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
                <span id='create-nodes' style={{display:'none'}}>
                    <img className="drag-create-img" role='presentation' src="img/job.png" onMouseDown={this.createNodeDrag.bind(this, this.createJob.bind(this))}/>
                    <img className="drag-create-img" role='presentation' src="img/source.png" onMouseDown={this.createNodeDrag.bind(this, this.createSource.bind(this))}/>
                </span>
                <a onClick={this.toggleCreateNodes}><i className="fa fa-plus" aria-hidden="true"></i></a>
                <a id='delete-icon' onClick={this.onDelete.bind(this)} style={{display:'none'}}><i className="fa fa-trash" aria-hidden="true"></i></a>
                
                {/*<a><i className="fa fa-filter" aria-hidden="true"></i></a>*/}
            
            </div>
          </div>
        <div id='flow'></div>
      </div>
    )
  }
  componentDidMount() {
    // ************************
    // Set up D3 state
    // ************************
    this.d3state = {
        width: this.getWindowWidth(),
        height: this.getWindowHeight(),
        scale: .5,
        maxX: -9999,
        maxY: -9999,
        minX: 9999,
        minY: 9999,
        highlightedMaxX: -9999,
        highlightedMaxY: -9999,
        highlightedMinX: 9999,
        highlightedMinY: 9999,
        selectedNodes: {},
        changedNodes: {},
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
        selectedClass: "selected",
        shapeGClass: "conceptG",
        shapeWidth: 160,
        shapeHeight: 120,
        xgridSize: 10,
        ygridSize: 10,
        mouseLocation: [0,0],
        dragNode: null
    }

    // ************************
    // Set up D3 graph
    // ************************
    this.svg = d3.select("#flow").append("svg")
        .attr("width", this.d3state.width)
        .attr("height", this.d3state.height)

    // define arrow for edges
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

    this.svgG = this.svg.append("g")
        .attr("id","graph")
        .classed("graph", true)

    // this.svgG.append("rect")
    //     .attr('x', '0')
    //     .attr('y', '0')
    //     .attr('fill','transparent')
    //     .attr('stroke', 'black')
    //     .attr('stroke-width',1)
    //     .attr('width' , 1000)
    //     .attr('height', 1000)

    // define temp line displayed when shift dragging between shapes
    this.dragLine = this.svgG.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M 0,0 C 0,0 0,0 0,0')
        .style('marker-end', 'url(#mark-end-arrow)')

    // svg nodes (shapes) and edges (paths)
    this.paths = this.svgG.append("g").selectAll("g")
    this.shapes = this.svgG.append("g").selectAll("g")

    // bind svg actions
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

    // define drag behavior
    this.drag = d3.behavior.drag()
        .origin(function(d) {
            return { x: d.x, y: d.y }
        })
        .on("dragstart", function() {
            if (!d3.event.sourceEvent.shiftKey) {
                d3.select('#flow').style("cursor", "move")
            }
        })
        .on("drag", function(args) {
            this.d3state.dragging = true
            this.dragmove.call(this, args)
        }.bind(this))
        .on("dragend", function() {
            d3.select('#flow').style("cursor", "auto")
        })

    // define zoom behavior
    this.zoomSvg = d3.behavior.zoom()
        .scaleExtent([.1, 2])
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
        })

    this.svg.call(this.zoomSvg).on("dblclick.zoom", null)

    // listen for resize
    window.onresize = function() {
        this.updateWindow(this.svg)
    }.bind(this) 
  }
  componentWillReceiveProps(nextProps) {
      let doCenterAndFit = false
      if (Object.keys(this.props.nodes).length === 0 || 
          this.props.query['center-and-fit'] === "true" ||
          this.props.singleClickNav === true) {
          doCenterAndFit = true
      }
      this.props = nextProps
      this.renderD3()
      if (doCenterAndFit) {
          this.centerAndFitFlow()
      }
  }
  renderD3() {
    let graph = this
    let d3state = this.d3state
    const { selectedNodeId, nodes, colored } = this.props
    if (Object.keys(nodes).length === 0) {
        return
    }
    if (selectedNodeId){
        d3state.selectedNodes[selectedNodeId]  = nodes[selectedNodeId]
    }
    d3state.width = this.getWindowWidth()
    d3state.height = this.getWindowHeight()
    
    
    // *****************
    // Build node and edge lists and set min and max x and y
    // ****************
    let nodeList = []
    let edgeList = []
    d3state.maxX = -9999
    d3state.maxY = -9999
    d3state.minY = 9999
    d3state.minX = 9999
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
                edgeList.push({ source: node, target: nodes[dnode.id] })
            }
        })
        nodeList.push(node)
        if (d3state.selectedNodes[node.id]) {
            d3state.selectedNodes[node.id] = node
        }
    })
    // Add padding to account for shape width & height
    d3state.maxX += d3state.shapeWidth*2
    d3state.maxY += d3state.shapeHeight*2
    d3state.minY -= d3state.shapeHeight
    d3state.minX -= d3state.shapeWidth


    // *****************
    // Render paths
    // ****************
    graph.paths = graph.paths.data(edgeList, function(d) {
        return String(d.source.id) + "+" + String(d.target.id)
    })

    // update existing
    graph.paths.style('marker-end', 'url(#mark-end-arrow)')
        .classed(d3state.selectedClass, function(d) { return d === d3state.selectedEdge })
        .attr("d", function(d) { return graph.buildPathStr(d) })
    
    // add new
    graph.paths.enter() 
        .append("path")
        .style('marker-end', 'url(#mark-end-arrow)')
        .classed("link", true)
        .attr('id', function(d) { return "n" + d.source.id + d.target.id })
        .attr("d", function(d) { return graph.buildPathStr(d) })
        .on("mousedown", function(d) { graph.pathMouseDown.call(graph, d) })
        .on("mouseup", function(d) { graph.pathMouseUp.call(graph, d) })
    
    // remove old
    graph.paths.exit().remove() 

    
    // *****************
    // Render shapes
    // ****************
    graph.shapes = graph.shapes.data(nodeList, function(d) { return d.id })
    
    // update existing
    this.shapes.attr("transform", function(d) {
        let tr = "translate(" + (Math.round(d.x / d3state.xgridSize) * d3state.xgridSize)
        tr += "," + (Math.round(d.y / d3state.ygridSize) * d3state.ygridSize) + ")"
        return tr
    })
    
    // add new
    let newGs = this.shapes.enter().append("g")
    
    // bind actions
    newGs.classed(d3state.shapeGClass, true)
    .attr('id', function(d) { return "n" + d.id })
    .attr('class', function(d) { 
        let colorclass = colored ? ' colored' : ''
        return d3state.shapeGClass + " " + d.collection + "-node" + colorclass
    })
    .attr("transform", function(d) {
        let tr = "translate(" + (Math.round(d.x / d3state.xgridSize) * d3state.xgridSize)
        tr += "," + (Math.round(d.y / d3state.ygridSize) * d3state.ygridSize) + ")"
        return tr
    })
    .on("mousedown", function(d) {
        graph.shapeMouseDown(d)
    })
    .on("mouseup", function(d) {
        graph.shapeMouseUp(d)
    })
    .on("mouseover", function(d) {
        d3.select(".tip-" + d.id).classed("hidden", false)
    })
    .on("mouseout", function(d) {
        d3.select(".tip-" + d.id).classed("hidden", true)
    })
    .call(this.drag)

    // draw  
    newGs.append("path")
        .attr('d', function(d) {
        if (d.collection==="jobs") {
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

    // add content
    newGs.each(function() {
        let gEl = d3.select(this)
        let el = gEl.append("text")
            .attr("class", "node-text")
            .attr("dy", graph.d3state.shapeHeight/2+8)
            .attr("dx", graph.d3state.shapeWidth/2)
        el.text(function (d) {
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
        })
    })

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

    // remove old
    this.shapes.exit().remove();

    // add selected styling
    this.selectNodes(d3state.selectedNodes)

    //this.props.setD3State(d3state)
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
          this.dragLine.attr('d', this.buildDragLineStr(d))
      } else {
        if (Object.keys(this.d3state.selectedNodes).length > 0 && this.d3state.selectedNodes[d.id]) {
        Object.keys(this.d3state.selectedNodes).forEach(function(id) {
            let node = this.d3state.selectedNodes[id]
            node.x += d3.event.dx
            node.y += d3.event.dy
            this.d3state.changedNodes[node.id] = node
          }.bind(this))
        } else {
            d.x += d3.event.dx
            d.y += d3.event.dy
            this.d3state.changedNodes[d.id] = d
        }
        this.renderD3()
      }
  }
  spliceLinksForNode(node) {
      var toSplice = this.d3state.edges.filter(function(l) {
          return (l.source === node || l.target === node)
      })
      toSplice.map(function(l) {
          this.d3state.edges.splice(this.d3state.edges.indexOf(l), 1)
      }.bind(this))
  }
  pathMouseDown(d) {
      d3.event.stopPropagation();
  }
  pathMouseUp(d) {
      d3.event.stopPropagation();
      if (this.d3state.selectedEdge === d) {
        this.clearAllSelection()
        this.d3state.selectedEdge = null
        this.hideDeleteIcon()
      } else {
        this.clearAllSelection()
        this.d3state.selectedEdge = d
        d3.select('#n' + d.source.id + d.target.id).classed(this.d3state.selectedClass, true)
        this.showDeleteIcon()
      }
  }
  toggleCreateNodes() {
      if (document.getElementById('create-nodes').style.display === 'inline') {        
          document.getElementById('create-nodes').style.display = 'none'
      } else {
          document.getElementById('create-nodes').style.display = 'inline'
      }
    
  }
  showDeleteIcon() {
    document.getElementById('delete-icon').style.display = 'inline'
  }
  hideDeleteIcon() {
    document.getElementById('delete-icon').style.display = 'none'
  }
  addNodeToSelected(d) {
    this.d3state.selectedNodes[d.id] = d
    if (Object.keys(this.d3state.selectedNodes).length > 1) {
        history.push("/clouds/"+ getSessionInfo()['selectedCloud'].id + "/flow")
    }
    this.selectNodes(this.d3state.selectedNodes)
  }
  removeNodeFromSelected(d) {
    delete this.d3state.selectedNodes[d.id]
    if (Object.keys(this.d3state.selectedNodes).length < 1) {
        history.push("/clouds/"+ getSessionInfo()['selectedCloud'].id + "/flow")
    }
    this.selectNodes(this.d3state.selectedNodes)
  }
  selectNodes(nodes) {
      this.clearAllHighlight()
      if (nodes && Object.keys(nodes).length > 0) {
        this.d3state.selectedNodes = nodes
        this.paths.classed('inactive', true)
        this.shapes.classed('inactive', true)
        Object.keys(nodes).forEach(function(id) {
            d3.select("#n" + id).classed(this.d3state.selectedClass, true)
            this.highlightFlow(nodes[id])
        }.bind(this))
        this.showDeleteIcon()
      }
  }
  clearAllHighlight() {
    this.d3state.highlightedMaxX = -9999
    this.d3state.highlightedMaxY = -9999
    this.d3state.highlightedMinX = 9999
    this.d3state.highlightedMinY = 9999
    this.paths.classed(this.d3state.selectedClass, false)
    this.shapes.classed(this.d3state.selectedClass, false)
    this.paths.classed('inactive', false)
    this.shapes.classed('inactive', false)
    this.hideDeleteIcon()
  }
  clearAllSelection() {
      this.clearAllHighlight()
      this.d3state.selectedNodes = {}
  }
  highlightFlow(d) {
      const { zoomOnHighlight } = this.props

      d3.select("#n" + d.id).classed('inactive', false)
      this.highlightUpstream(d)
      this.highlightDownstream(d)

      this.d3state.highlightedMaxX += this.d3state.shapeWidth*2
      this.d3state.highlightedMaxY += this.d3state.shapeHeight*2
      this.d3state.highlightedMinX -= this.d3state.shapeHeight
      this.d3state.highlightedMinY -= this.d3state.shapeWidth

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
          d3state.drawEdge = false
          this.dragLine.classed("hidden", true)
          if (d3state.mouseDownNode.id !== d.id) {
            d.upstream.push({"collection":d3state.mouseDownNode.collection,"id":d3state.mouseDownNode.id})
            d3state.mouseDownNode.downstream.push({"collection":d.collection,"id":d.id})
            d3state.changedNodes[d.id] = d
            d3state.changedNodes[d3state.mouseDownNode.id] = d3state.mouseDownNode
            this.onUpdateNodes(d3state.changedNodes)
          }
      } else if (d3state.dragging) {
          d3state.dragging = false
          this.onUpdateNodes(d3state.changedNodes)
      } else if (d3state.dblClickNodeTimeout) {
          history.push("/clouds/"+ sessionInfo['selectedCloud'].id + "/" + d.collection + "/" + d.id + "?flow=open")
      } else {
        if (this.props.singleClickNav) {
            this.clearAllSelection()
            history.push("/clouds/"+ sessionInfo['selectedCloud'].id + "/" + d.collection + "/" + d.id + "?flow=open")
        } else {
            if (this.d3state.selectedNodes[d.id]) {
                this.removeNodeFromSelected(d)
            } else {
                this.addNodeToSelected(d)
            }
        }
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
      var d3state = this.d3state
      let sessionInfo = getSessionInfo()

      if (!d3state.graphMouseDown) {
          if (d3state.drawEdge) {
              d3state.drawEdge = false
              this.dragLine.classed("hidden", true)
          }
      } else if (d3state.justScaleTransGraph) {
          d3state.justScaleTransGraph = false
      } else if (d3state.dblClickSVGTimeout) {
          this.clearAllSelection()
          history.push("/clouds/"+ sessionInfo['selectedCloud'].id + "/flow")
      } else {
          this.clearAllSelection()
          history.push("/clouds/"+ sessionInfo['selectedCloud'].id + "/flow")
          d3state.dblClickSVGTimeout = true
          setTimeout(function() {
              d3state.dblClickSVGTimeout = false
          }, 300)
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
      this.props.createNode(newNode.collection, newNode, null)
  }
  onSave() {
      this.onUpdateNodes(this.d3state.changedNodes)
  }
  onUpdateNodes(nodes) {
    Object.keys(nodes).forEach(function(key){
        let node = nodes[key]
        this.props.updateNode(node.collection, node, null)
    }.bind(this))
  }
  deleteEdge(edge) {
      let d3state = this.d3state
      let source = edge.source
      let target = edge.target
      source.downstream = source.downstream.filter(function(n) { return n.id !== target.id; })
      target.upstream = target.upstream.filter(function(n) { return n.id !== source.id })
      d3state.changedNodes[source.id] = source
      d3state.changedNodes[target.id] = target
      this.onUpdateNodes(d3state.changedNodes)
  }
  onDelete() {
      if (Object.keys(this.d3state.selectedNodes).length > 0) {
        if (confirm("Confirm delete node(s)?" ) === true) {
            Object.keys(this.d3state.selectedNodes).forEach(function(id) {
                let node = this.d3state.selectedNodes[id]
                this.props.deleteNode(node.collection, node, null)
            }.bind(this))
            this.clearAllSelection()
        }
      }
      if (this.d3state.selectedEdge) {
        if (confirm("Confirm delete edge?") === true) {
          this.deleteEdge(this.d3state.selectedEdge)
        }
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
    setD3State,
    createNode,
    updateNode,
    deleteNode
})(D3DataFlow)
