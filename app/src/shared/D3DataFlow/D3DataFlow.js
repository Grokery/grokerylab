import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { history } from 'index'
import { getSessionInfo } from 'authentication'
import { createNode, updateNode, deleteNode } from 'store/actions/nodes'
import { NODETYPE, getQueryParamByName, updateQueryParam } from 'common'
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
const nodeShapes = {
    1: 'Fat',
    2: 'Flat',
    'Fat': 1,
    'Flat': 2
}

class D3DataFlow extends Component {
  constructor(props) {
      super(props)
      this.state = {
        filterText: this.props.filterText ? this.props.filterText : '',
      }
  }
  static propTypes = {
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
    colored: PropTypes.bool,
    nodeShape: PropTypes.number,
    filterText: PropTypes.string,
  }
  render() {
    let { params, cloudAccess } = this.props
    let showControls = this.props.showControls ? '' : ' hidden'
    return (
      <div id='D3DataFlow'>
        <div className={'flow-header-content' + showControls}>

            <div className='cloud-title-and-links' style={{float:"left",backgroundColor:'#E1E3E5',paddingRight:'8px',paddingTop:'8px',paddingLeft:'8px'}}>
                <h2 style={{float:'left'}}>{cloudAccess.cloudInfo.title}</h2>
                <Link to={'/clouds/' + params.cloudName + "/boards"} style={{float:'right',paddingLeft:'10px',paddingTop:'8px'}}>
                    <i className='fa fa-tachometer cloud-edit-icon'/>
                </Link>
            </div>

            <div style={{float:"right",backgroundColor:'#E1E3E5',padding:0,paddingTop:'8px',paddingRight:'8px',paddingLeft:'8px'}}>
                <div id='create-nodes' className='paper'>
                    {/* <p>Drag to canvas to create:</p> */}
                    <img className='drag-create-img' alt='job' src='/img/job.png' onMouseDown={this.createNodeDrag.bind(this, this.createJob.bind(this))}/>
                    <img className='drag-create-img' alt='source' src='/img/source.png' onMouseDown={this.createNodeDrag.bind(this, this.createSource.bind(this))}/>
                    <img className='drag-create-img' alt='board' src='/img/board.png' onMouseDown={this.createNodeDrag.bind(this, this.createBoard.bind(this))}/>
                </div>
                <button className="create-btn" onClick={this.toggleCreateNodes}><i className='fa fa-plus'></i></button>
                <button id='delete-icon' onClick={this.onDelete.bind(this)}><i className='fa fa-trash'></i></button>
                <div className="node-filter">
                    <input id='filter-input' className='filter-input' onChange={this.filterNodes.bind(this)} value={this.state.filterText} autoFocus/>
                    <i className='fa fa-filter'></i>
                </div>
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
    var nodeShape = this.props.nodeShape ? this.props.nodeShape : 2
    this.d3state = {
        width: this.getWindowWidth(),
        height: this.getWindowHeight() - 7,
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
        lastKeyDown: -1,
        drawEdge: false,
        selectedText: null,
        dblClickSVGTimeout: false,
        dblClickNodeTimeout: false,
        dblClickPathTimeout: false,
        selectedClass: 'selected',
        shapeGClass: 'conceptG',
        nodeShape: nodeShape,
        shapeWidth: function() {
            if (nodeShape === nodeShapes.Fat) {
                return 160
            } else if (nodeShape === nodeShapes.Flat) {
                return 250
            }
        }(),
        shapeHeight: function() {
            if (nodeShape === nodeShapes.Fat) {
                return 120
            } else if (nodeShape === nodeShapes.Flat) {
                return 50
            }
        }(),
        xgridSize: 1,
        ygridSize: 1,
        mouseLocation: [0,0],
        dragNode: null
    }

    // ************************
    // Set up D3 graph
    // ************************
    this.svg = d3.select('#flow').append('svg')
        .attr('width', this.d3state.width)
        .attr('height', this.d3state.height)

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

    this.svgG = this.svg.append('g')
        .attr('id','graph')
        .classed('graph', true)

    // this.svgG.append('rect')
    //     .attr('x', '0')
    //     .attr('y', '0')
    //     .attr('fill','transparent')
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', 1)
    //     .attr('width' , 250)
    //     .attr('height', 50)

    // define temp line displayed when shift dragging between shapes
    this.dragLine = this.svgG.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M 0,0 C 0,0 0,0 0,0')
        .style('marker-end', 'url(#mark-end-arrow)')

    // svg nodes (shapes) and edges (paths)
    this.paths = this.svgG.append('g').selectAll('g')
    this.shapes = this.svgG.append('g').selectAll('g')

    // bind svg actions
    this.svg.on('mousedown', function(d) {
        this.svgMouseDown.call(this, d)
    }.bind(this))
    .on('mouseup', function(d) {
        this.svgMouseUp.call(this, d)
    }.bind(this))
    .on('mousemove', function () {
        if (this.d3state.dragNode) {
            this.d3state.mouseLocation = d3.mouse(d3.select('#graph').node())
            let pagexy = d3.mouse(d3.select('#flow').node())
            let dragNode = document.getElementById('dragnode')
            dragNode.style.left = pagexy[0] - 15 + 'px'
            dragNode.style.top = pagexy[1] - 15 + 'px'
        }
    }.bind(this))

    // define drag behavior
    this.drag = d3.behavior.drag()
        .origin(function(d) {
            return { x: d.x, y: d.y }
        })
        .on('dragstart', function() {
            if (!d3.event.sourceEvent.shiftKey) {
                d3.select('#flow').style('cursor', 'move')
            }
        })
        .on('drag', function(args) {
            this.d3state.dragging = true
            this.dragmove.call(this, args)
        }.bind(this))
        .on('dragend', function() {
            d3.select('#flow').style('cursor', 'auto')
        })

    // define zoom behavior
    this.zoomSvg = d3.behavior.zoom()
        .scaleExtent([.1, 2])
        .on('zoom', function() {
            if (d3.event.sourceEvent) {
                d3.event.sourceEvent.preventDefault()
            }
            if (d3.event.sourceEvent && d3.event.sourceEvent.shiftKey) {
                return false
            } else {
                this.zoom.call(this)
            }
            return true
        }.bind(this))
        .on('zoomstart', function() {
            if (!d3.event.sourceEvent.shiftKey) {
                d3.select('#flow').style('cursor', 'move')
            }
        })
        .on('zoomend', function() {
            d3.select('#flow').style('cursor', 'auto')
        })

    this.svg.call(this.zoomSvg).on('dblclick.zoom', null)

    // listen for resize
    window.onresize = function() {
        this.updateWindow(this.svg)
    }.bind(this)
    this.renderD3()
    this.centerAndFitFlow()
  }
  componentWillReceiveProps(nextProps) {
      let doCenterAndFit = false
      if (Object.keys(this.props.nodes).length === 0 ||
          this.props.query['center-and-fit'] === 'true' ||
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
            if (nodes[dnode.nodeId]) {
                edgeList.push({ source: node, target: nodes[dnode.nodeId] })
            }
        })
        nodeList.push(node)
        if (d3state.selectedNodes[node.nodeId]) {
            d3state.selectedNodes[node.nodeId] = node
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
        return String(d.source.nodeId) + '+' + String(d.target.nodeId)
    })

    // update existing
    graph.paths.style('marker-end', 'url(#mark-end-arrow)')
        .classed(d3state.selectedClass, function(d) { return d === d3state.selectedEdge })
        .attr('d', function(d) { return graph.buildPathStr(d) })

    // add new
    graph.paths.enter()
        .append('path')
        .style('marker-end', 'url(#mark-end-arrow)')
        .classed('link', true)
        .attr('id', function(d) { return 'n' + d.source.nodeId + d.target.nodeId })
        .attr('d', function(d) { return graph.buildPathStr(d) })
        .on('mousedown', function(d) { graph.pathMouseDown.call(graph, d) })
        .on('mouseup', function(d) { graph.pathMouseUp.call(graph, d) })

    // remove old
    graph.paths.exit().remove()


    // *****************
    // Render shapes
    // ****************
    graph.shapes = graph.shapes.data(nodeList, function(d) { return d.nodeId })

    // update existing
    this.shapes.attr('transform', function(d) {
        let tr = 'translate(' + (Math.round(d.x / d3state.xgridSize) * d3state.xgridSize)
        tr += ',' + (Math.round(d.y / d3state.ygridSize) * d3state.ygridSize) + ')'
        return tr
    })

    // add new
    let newGs = this.shapes.enter().append('g')

    // bind actions
    newGs.classed(d3state.shapeGClass, true)
    .attr('id', function(d) { return 'n' + d.nodeId })
    .attr('class', function(d) {
        let colorclass = colored ? ' colored' : ''
        return d3state.shapeGClass + ' ' + d.nodeType.toLowerCase() + '-node' + colorclass
    })
    .attr('transform', function(d) {
        let tr = 'translate(' + (Math.round(d.x / d3state.xgridSize) * d3state.xgridSize)
        tr += ',' + (Math.round(d.y / d3state.ygridSize) * d3state.ygridSize) + ')'
        return tr
    })
    .on('mousedown', function(d) {
        graph.shapeMouseDown(d)
    })
    .on('mouseup', function(d) {
        graph.shapeMouseUp(d)
    })
    .on('mouseover', function(d) {
        d3.select('.tip-' + d.nodeId).classed('hidden', false)
    })
    .on('mouseout', function(d) {
        d3.select('.tip-' + d.nodeId).classed('hidden', true)
    })
    .call(this.drag)

    // draw
    var self = this
    newGs.append('path')
        .attr('d', self.getNodeShape())

    // add content

    // set node icons
    //   newGs.each(function() {
    //       let gEl = d3.select(this)
    //       let el = gEl.append('text')
    //           .attr('class', 'node-icon')
    //           .attr('dy', graph.d3state.shapeHeight / 2 + 21)
    //           .attr('dx', graph.d3state.shapeWidth / 2)
    //           .attr('font-family', 'FontAwesome')
    //       el.text(function(d) {
    //           if (d.nodeType===NODETYPE.JOB) {
    //               return '\uf121'
    //           } else if (d.nodeType===NODETYPE.SOURCE) {
    //               return '\uf1c0'
    //           } else if (d.nodeType===NODETYPE.BOARD) {
    //               return '\uf009'
    //           } else {
    //               return ''
    //           }
    //       })
    //   })

    // set node tool tips
    // newGs.each(function(){
    //     d3.select(this).append('text')
    //         .attr('class', function (d) {
    //                 return 'hidden tooltiptext tip-' + d.nodeId
    //         })
    //         .text(function (d) {
    //                 return d.title
    //         })
    // })

    newGs.each(function() {
        let gEl = d3.select(this)
        let el = gEl.append('text')
            .attr('dy', graph.d3state.shapeHeight / 2 + 8)
            .attr('dx', graph.d3state.shapeWidth / 2)
        el.text(self.getNodeContent())
    })

    // remove old
    this.shapes.exit().remove();

    // add selected styling
    this.selectNodes(d3state.selectedNodes)
  }
  getNodeShape() {
    let d3state = this.d3state
    if (d3state.nodeShape === nodeShapes.Fat) {
        return function(d) {
            if (d.nodeType===NODETYPE.JOB) {
                return 'M 28.5 4.4' +
                    'c 1.3 -2.44 4.6 -4.4 7.36 -4.4' +
                    'h 88' +
                    'c 2.76 0 6.05 1.96 7.35 4.4' +
                    'l 27.3 51.17' +
                    'c 1.3 2.45 1.3 6.4 0 8.84' +
                    'l -27.3 51.17' +
                    'c -1.3 2.45 -4.6 4.43-7.35 4.43' +
                    'h -88' +
                    'c -2.77 0 -6.06 -1.98 -7.36 -4.42' +
                    'l -27.3 -51.16' +
                    'c -1.3 -2.44 -1.3 -6.4 0 -8.83' +
                    'z';
            } else if (d.nodeType===NODETYPE.SOURCE) {
                return 'M 16 120' +
                    'c -8.83 0 -16 -26.87 -16 -60 0 -33.14 7.17 -60 16 -60' +
                    'h 128' +
                    'c 8.84 0 16 26.86 16 60 0 33.13 -7.16 60 -16 60' +
                    'z';
            } else if (d.nodeType===NODETYPE.BOARD) {
                return 'M 0 5' +
                    'c 0 -2.77 2.23 -5 5 -5' +
                    'h 150' +
                    'c 2.76 0 5 2.23 5 5' +
                    'v 110' +
                    'c 0 2.76 -2.24 5 -5 5' +
                    'h -150' +
                    'c -2.77 0 -5 -2.24 -5 -5' +
                    'z';
            } else {
                return 'M 0 5' +
                    'c 0 -2.77 2.23 -5 5 -5' +
                    'h 150' +
                    'c 2.76 0 5 2.23 5 5' +
                    'v 110' +
                    'c 0 2.76 -2.24 5 -5 5' +
                    'h -150' +
                    'c -2.77 0 -5 -2.24 -5 -5' +
                    'z';
            }
        }
    } else if (d3state.nodeShape === nodeShapes.Flat) {
        return function(d) {
            if (d.nodeType===NODETYPE.JOB) {
                return 'M 10 5' +
                    'c 1.3 -2.44 4.6 -4.4 7.36 -4.4' +
                    'h 220' +
                    'c 2.76 0 6.05 1.96 7.35 4.4' +
                    'l 10 16.2' +
                    'c 1.3 2.45 1.3 6.4 0 8.84' +
                    'l -10 16.2' +
                    'c -1.3 2.45 -4.6 4.43-7.35 4.43' +
                    'h -220' +
                    'c -2.77 0 -6.06 -1.98 -7.36 -4.42' +
                    'l -10 -16.2' +
                    'c -1.3 -2.44 -1.3 -6.4 0 -8.83' +
                    'l 10 -16.2';
            } else if (d.nodeType===NODETYPE.SOURCE) {
                return 'M 8 50' +
                    'c -8 0 -8 -25 -8 -25' +
                    'c 0 -25 8 -25 8 -25' +
                    'h 234' +
                    'c 8 0 8 25 8 25' +
                    'c 0 25 -8 25 -8 25' +
                    'h -234';
            } else if (d.nodeType===NODETYPE.BOARD) {
                return 'M 0 4' +
                    'c 0 -2 2 -4 4 -4' +
                    'h 242' +
                    'c 2 0 4 2 4 4' +
                    'v 42' +
                    'c 0 2 -2  4 -4 4' +
                    'h -242' +
                    'c -2 0 -4 -2 -4 -4' +
                    'v -42';
            } else {
                return 'M 0 4' +
                    'c 0 -2 2 -4 4 -4' +
                    'h 242' +
                    'c 2 0 4 2 4 4' +
                    'v 42' +
                    'c 0 2 -2  4 -4 4' +
                    'h -242' +
                    'c -2 0 -4 -2 -4 -4' +
                    'v -42';
            }
        }
    }
  }
  getNodeContent() {
    let d3state = this.d3state
    if (d3state.nodeShape === nodeShapes.Fat) {
        return function (d) {
            if (d.nodeType === NODETYPE.JOB) {
                return d.type_abrev ? d.type_abrev : 'Job'
            } else if (d.nodeType === NODETYPE.SOURCE) {
                return d.type_abrev ? d.type_abrev : 'Source'
            } else if (d.nodeType === NODETYPE.BOARD) {
                return d.type_abrev ? d.type_abrev : 'Board'
            } else {
                return ''
            }
        }
    } else if (d3state.nodeShape === nodeShapes.Flat) {
        return function (d) {
            let maxlen = 22;
            if (d.title.length <= maxlen) {
                return d.title;
            } else {
                return d.title.substring(0, maxlen) + '...';
            }
        }
    }
  }
  getWindowWidth() {
    const { width } = this.props
    if (!width) {
        const docEl = document.documentElement
        const flowEl = document.getElementById('flow')
        return window.innerWidth || docEl.clientWidth || flowEl.clientWidth
    }
    return width
  }
  getWindowHeight() {
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
      svg.attr('width', x).attr('height', y);
  }
  centerAndFitFlow() {
    let headerPadding = 70 // allows space for the filter input and create/delete buttons
    let d3state = this.d3state
    let {highlightedMaxX, highlightedMinX, highlightedMaxY, highlightedMinY} = this.d3state
    let maxX = highlightedMaxX !== -9999 ? highlightedMaxX : d3state.maxX
    let minX = highlightedMinX !== 9999 ? highlightedMinX : d3state.minX
    let maxY = highlightedMaxY !== -9999 ? highlightedMaxY : d3state.maxY
    let minY = highlightedMinY !== 9999 ? highlightedMinY : d3state.minY
    minY -= headerPadding
    let xScale = Math.min(d3state.width / (maxX - minX), .5)
    let yScale = Math.min(d3state.height / (maxY - minY), .5)
    let scale = Math.min(xScale, yScale)
    let x = minX + (maxX - minX) / 2
    let y = minY + (maxY - minY) / 2

    // // graph 0,0
    // this.svgG.append('circle')
    //         .attr('cx', 0)
    //         .attr('cy', 0)
    //         .attr('fill', 'red')
    //         .attr('r', 20)

    // // flow center relative to graph 0,0
    // this.svgG.append('circle')
    //         .attr('cx', x)
    //         .attr('cy', y)
    //         .attr('fill', 'green')
    //         .attr('r', 20)

    this.translateAndZoomTo(x, y, scale)
  }
  translateAndZoomTo(x, y, scale) {
      this.zoom([this.d3state.width / 2 - x * scale, this.d3state.height / 2 - y * scale], scale);
  }
  zoom(tr, sc) {
      tr = tr ? tr : d3.event.translate;
      sc = sc ? sc : d3.event.scale;
      this.zoomSvg.translate(tr);
      this.zoomSvg.scale(sc);
      d3.select('.graph').attr('transform', 'translate(' + tr + ') scale(' + sc + ')');
  }
  buildDragLineStr(d) {
      var mousexy = d3.mouse(this.svgG.node());
      var mouse = { x: mousexy[0], y: mousexy[1] };
      var xy2 = mouse.x + ',' + mouse.y;
      var cxy2 = (mouse.x - 100) + ',' + mouse.y;

      var xgrid = this.d3state.xgridSize;
      var ygrid = this.d3state.ygridSize;
      var shapeW = this.d3state.shapeWidth;
      var shapeH = this.d3state.shapeHeight;
      var shape = { x: (Math.round(d.x / xgrid) * xgrid + shapeW), y: (Math.round(d.y / ygrid) * ygrid + shapeH / 2) };
      var xy1 = shape.x + ',' + shape.y;
      var cxy1 = (shape.x + 100) + ',' + shape.y;

      return 'M' + xy1 + 'C' + cxy1 + ' ' + cxy2 + ' ' + xy2;
  }
  dragmove(d) {
      if (this.d3state.drawEdge) {
          this.dragLine.attr('d', this.buildDragLineStr(d))
      } else {
        if (Object.keys(this.d3state.selectedNodes).length > 0 && this.d3state.selectedNodes[d.nodeId]) {
        Object.keys(this.d3state.selectedNodes).forEach(function(nodeId) {
            let node = this.d3state.selectedNodes[nodeId]
            node.x += d3.event.dx
            node.y += d3.event.dy
            this.d3state.changedNodes[node.nodeId] = node
          }.bind(this))
        } else {
            d.x += d3.event.dx
            d.y += d3.event.dy
            this.d3state.changedNodes[d.nodeId] = d
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
        d3.select('#n' + d.source.nodeId + d.target.nodeId).classed(this.d3state.selectedClass, true)
        this.showDeleteIcon()
      }
  }
  toggleCreateNodes(e) {
      if (e && e.preventDefault) {e.preventDefault()}
      if (document.getElementById('create-nodes').style.display === 'inline') {
          document.getElementById('create-nodes').style.display = 'none'
      } else {
          document.getElementById('create-nodes').style.display = 'inline'
      }
  }
  filterNodes() {
    let { nodes } = this.props
    let filterText = document.getElementById('filter-input').value.toLowerCase()
    updateQueryParam('filterText', filterText)
    this.setState({filterText})
    Object.keys(nodes).forEach(function(key) {
        let node = nodes[key]
        if (node.title.toLowerCase().includes(filterText) &&
            filterText !== '' &&
            filterText.length > 1) {
            this.addNodeToSelected(node, filterText)
        } else {
            this.removeNodeFromSelected(node, filterText)
        }
    }.bind(this))
  }
  showDeleteIcon() {
    let icon = document.getElementById('delete-icon')
      if (icon) {
          icon.style.display = 'inline'
      }
  }
  hideDeleteIcon() {
      let icon = document.getElementById('delete-icon')
      if (icon) {
          icon.style.display = 'none'
      }
  }
  addNodeToSelected(d, filterText) {
    const { params } = this.props
    this.d3state.selectedNodes[d.nodeId] = d
    if (Object.keys(this.d3state.selectedNodes).length > 1) {
        history.push('/clouds/'+ params.cloudName + '/flows' + (filterText ? '?filterText=' + filterText : ''))
    }
    this.selectNodes(this.d3state.selectedNodes)
  }
  removeNodeFromSelected(d, filterText) {
    const { params } = this.props
    delete this.d3state.selectedNodes[d.nodeId]
    if (Object.keys(this.d3state.selectedNodes).length < 1) {
        history.push('/clouds/'+ params.cloudName + '/flows' + (filterText ? '?filterText=' + filterText : ''))
    }
    this.selectNodes(this.d3state.selectedNodes)
  }
  selectNodes(nodes) {
      this.clearAllHighlight()
      if (nodes && Object.keys(nodes).length > 0) {
        this.d3state.selectedNodes = nodes
        this.paths.classed('inactive', true)
        this.shapes.classed('inactive', true)
        Object.keys(nodes).forEach(function(nodeId) {
            d3.select('#n' + nodeId).classed(this.d3state.selectedClass, true)
            this.highlightFlow(nodes[nodeId])
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
      if (!d) {
        return
      }
      const { zoomOnHighlight } = this.props

      d3.select('#n' + d.nodeId).classed('inactive', false)
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
          d3.select('#n' + node.nodeId).classed('inactive', false);
          d3.select('#n' + node.nodeId + d.nodeId).classed('inactive', false);
          this.highlightUpstream(nodes[node.nodeId]);
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
          d3.select('#n' + node.nodeId).classed('inactive', false);
          d3.select('#n' + d.nodeId + node.nodeId).classed('inactive', false);
          this.highlightDownstream(nodes[node.nodeId]);
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
      const { params } = this.props
      let d3state = this.d3state;

      if (d3state.drawEdge) {
          d3state.drawEdge = false
          this.dragLine.classed('hidden', true)
          if (d3state.mouseDownNode.nodeId !== d.nodeId) {
            d.upstream.push({'nodeType':d3state.mouseDownNode.nodeType,'nodeId':d3state.mouseDownNode.nodeId})
            d3state.mouseDownNode.downstream.push({'nodeType':d.nodeType,'nodeId':d.nodeId})
            d3state.changedNodes[d.nodeId] = d
            d3state.changedNodes[d3state.mouseDownNode.nodeId] = d3state.mouseDownNode
            this.onUpdateNodes(d3state.changedNodes)
          }
      } else if (d3state.dragging) {
          d3state.dragging = false
            this.onUpdateNodes(d3state.changedNodes)
      } else if (d3state.dblClickNodeTimeout) {
          history.push('/clouds/'+ params.cloudName + '/flows/' + d.nodeType.toLowerCase() + '/' + d.nodeId + '?flow=open')
      } else {
        if (this.props.singleClickNav) {
            let tabIndex = getQueryParamByName('activeTab')
            this.clearAllSelection()
            history.push('/clouds/'+ params.cloudName + '/flows/' + d.nodeType.toLowerCase() + '/' + d.nodeId + '?flow=open&activeTab=' + tabIndex)
        } else {
            if (this.d3state.selectedNodes[d.nodeId]) {
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
      const { params } = this.props
      var d3state = this.d3state
      if (!d3state.graphMouseDown) {
          if (d3state.drawEdge) {
              d3state.drawEdge = false
              this.dragLine.classed('hidden', true)
          }
      } else if (d3state.dblClickSVGTimeout) {
          this.clearAllSelection()
          history.push('/clouds/'+ params.cloudName + '/flows')
      } else {
          d3state.dblClickSVGTimeout = true
          setTimeout(function() {
              d3state.dblClickSVGTimeout = false
          }, 300)
      }
      d3state.graphMouseDown = false;
  }
  createNodeDrag(cb, e) {
    let dragNode = e.target.cloneNode(true)
    dragNode.id = 'dragnode'
    dragNode.style.height = '35px'
    dragNode.style.position = 'absolute'
    document.getElementById('flow').appendChild(dragNode)
    this.d3state.dragNode = true
    window.onmouseup = function(e) {
        dragNode.parentNode.removeChild(dragNode)
        this.d3state.dragNode = false
        window.onmouseup = null
        cb(this.d3state.mouseLocation)
        this.toggleCreateNodes(e)
      }.bind(this)
  }
  createJob(xy) {
    this.createNode({
        nodeType: NODETYPE.JOB,
        subType: 'GENERIC',
        title: 'New Job',
        description: 'Default description',
        upstream: [],
        downstream: [],
        x: xy[0],
        y: xy[1]
    })
  }
  createSource(xy) {
    this.createNode({
        nodeType: NODETYPE.SOURCE,
        subType: 'GENERIC',
        title: 'New Source',
        description: 'Default description',
        upstream: [],
        downstream: [],
        x: xy[0],
        y: xy[1]
    })
  }
  createBoard(xy) {
    this.createNode({
        nodeType: NODETYPE.BOARD,
        subType: 'GENERIC',
        title: 'New Board',
        description: 'Default description',
        upstream: [],
        downstream: [],
        x: xy[0],
        y: xy[1]
    })
  }
  createNode(newNode) {
    const { params } = this.props
    newNode.x -= this.d3state.shapeWidth/2
    newNode.y -= this.d3state.shapeHeight/2
    this.props.createNode(params.cloudName, newNode)
  }
  onSave() {
    this.onUpdateNodes(this.d3state.changedNodes)
  }
  onUpdateNodes(nodes) {
    const { params } = this.props
    Object.keys(nodes).forEach(function(key){
        let node = nodes[key]
        this.props.updateNode(params.cloudName, node, () => {this.d3state.changedNodes = {}})
    }.bind(this))
  }
  deleteEdge(edge) {
      let d3state = this.d3state
      let source = edge.source
      let target = edge.target
      source.downstream = source.downstream.filter(function(n) { return n.nodeId !== target.nodeId; })
      target.upstream = target.upstream.filter(function(n) { return n.nodeId !== source.nodeId })
      d3state.changedNodes[source.nodeId] = source
      d3state.changedNodes[target.nodeId] = target
      this.onUpdateNodes(d3state.changedNodes)
  }
  onDelete(e) {
    const { params, deleteNode } = this.props
    if (e && e.preventDefault) {e.preventDefault()}
      if (Object.keys(this.d3state.selectedNodes).length > 0) {
        confirmAlert({
            title: 'Confirm delete:',
            message: 'Permanently delete selected nodes/edges?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    Object.keys(this.d3state.selectedNodes).forEach((nodeId) => {
                        let node = this.d3state.selectedNodes[nodeId]
                        deleteNode(params.cloudName, node, null)
                    })
                    this.clearAllSelection()
                }
              },
              {
                label: 'No',
              }
            ]
          })
      }
      if (this.d3state.selectedEdge) {
        confirmAlert({
            title: 'Confirm delete:',
            message: 'Permanently delete selected nodes/edges?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    this.deleteEdge(this.d3state.selectedEdge)
                }
              },
              {
                label: 'No',
              }
            ]
          })
      }
  }
  buildPathStr(ed) {
      var xgrid = this.d3state.xgridSize;
      var ygrid = this.d3state.ygridSize;
      var nodeW = this.d3state.shapeWidth;
      var nodeH = this.d3state.shapeHeight;

      var target = { x: (Math.round(ed.target.x / xgrid) * xgrid), y: (Math.round(ed.target.y / ygrid) * ygrid + nodeH / 2) };
      var xy2 = target.x + ',' + target.y;
      var cxy2 = (target.x - 100) + ',' + target.y;

      var source = { x: (Math.round(ed.source.x / xgrid) * xgrid + nodeW), y: (Math.round(ed.source.y / ygrid) * ygrid + nodeH / 2) };
      var xy1 = source.x + ',' + source.y;
      var cxy1 = (source.x + 100) + ',' + source.y;

      return 'M' + xy1 + 'C' + cxy1 + ' ' + cxy2 + ' ' + xy2;
  }
}

const mapStateToProps = (state, ownProps) => {
    const { clouds } = getSessionInfo()
  return {
    cloudAccess: clouds[ownProps.params.cloudName],
    nodes: state.nodes,
  }
}

export default connect(mapStateToProps, {
    createNode,
    updateNode,
    deleteNode,
})(D3DataFlow)
