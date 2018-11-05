import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateQueryParam, NODETYPE } from 'common'
import { updateNode } from 'store/actions'
import { history } from 'index'
import D3DataFlow from 'shared/D3DataFlow/D3DataFlow'
import JobDetails from './jobs/JobDetails'
import SourceDetails from './sources/SourceDetails'
import ChartDetails from './charts/ChartDetails'
import BoardDetails from './boards/BoardDetails'
import './NodeDetails.css'

const flowPreviewHeight = 300

class NodeDetails extends Component {
  static propTypes = {
    updateNode: PropTypes.func.isRequired,
    node: PropTypes.object
  }
  render() {
    const { params, location } = this.props
    let props = {
      params: params,
      close: this.close.bind(this),
      getRightMenuOptions: this.getRightMenuOptions,
      onUpdate: this.onUpdate.bind(this),
      toggleNodeDetailsPain: this.toggleNodeDetailsPain.bind(this),
    }
    return (
      <div className='page-content white'>
        <D3DataFlow
          showControls={false}
          selectedNodeId={params.nodeId}
          height={flowPreviewHeight}
          zoomOnHighlight={false}
          singleClickNav={true}
          colored={false}
          nodeShape={2}
          query={location.query}
        />
        <div id='node-details-pain' className='node-details' style={{'top':'0px'}}>
            {function() {
                if (params.nodeType === NODETYPE.JOB.toLowerCase()) {
                  return (<JobDetails {...props} />)
                } else if (params.nodeType === NODETYPE.DATASOURCE.toLowerCase()) {
                  return (<SourceDetails {...props} />)
                } else if (params.nodeType === NODETYPE.CHART.toLowerCase()) {
                  return (<ChartDetails {...props} />)
                } else if (params.nodeType === NODETYPE.DASHBOARD.toLowerCase()) {
                  return (<BoardDetails {...props} />)
                }
            }()}
        </div>
        {this.props.children}
      </div>
    )
  }
  getRightMenuOptions() {
    const { toggleNodeDetailsPain, close } = this.props
    return (
      <div className='btn-group pull-right item-options'>
          <a href='' onClick={this.toggleEditDialog.bind(this)} className='btn btn-default'><i className='fa fa-cog'></i></a>
          <a href='' onClick={toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-arrows-v'></i></a>
          <a onClick={close} className='btn btn-default'><i className='fa fa-times'></i></a>
      </div>
    )
  }
  componentDidMount() {
    const { location } = this.props
    if (location.query.flow === "open") {
      this.openNodeDetailsPain.bind(this)()
    } else {
      this.closeNodeDetailsPain.bind(this)()
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { location } = nextProps
    return location.pathname !== this.props.location.pathname
  }
  toggleNodeDetailsPain(e) {
    if (e && typeof(e.preventDefault === 'function')) {
      e.preventDefault()
    }
    let pain = document.getElementById("node-details-pain")
    if (pain.style.top === '0px') {
      this.openNodeDetailsPain()
    } else {
      this.closeNodeDetailsPain()
    }
    window.scrollTo(0,0)
  }
  openNodeDetailsPain() {
    updateQueryParam('flow','open')
    document.getElementById("node-details-pain").style.top = flowPreviewHeight+'px'
    window.scrollTo(0,0)
  }
  closeNodeDetailsPain() {
    updateQueryParam('flow','closed')
    document.getElementById("node-details-pain").style.top = '0px'
    window.scrollTo(0,0)
  }
  close() {
    const { params } = this.props
    history.push("/clouds/"+ params.cloudName + "/flows/"+ params.nodeId +"?center-and-fit=true")
  }
  onUpdate(nodeData) {
    const { updateNode, node } = this.props
    nodeData.nodeId = node.nodeId
    nodeData.nodeType = node.nodeType
    nodeData.subType = nodeData.subType ? nodeData.subType : node.subType
    console.log("updateing node details: ")
    console.log(nodeData)
    updateNode(nodeData)
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {
  updateNode
})(NodeDetails)
