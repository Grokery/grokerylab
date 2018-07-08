import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateQueryParam, NODETYPE } from 'common'
import { updateNode } from 'store/actions'
import { history } from 'index'
import D3DataFlow from 'shared/D3DataFlow/D3DataFlow'
import JobDetails from './JobDetails'
import SourceDetails from './SourceDetails'
import ChartDetails from './ChartDetails'
import BoardDetails from './BoardDetails'
import './NodeDetails.css'

const flowPreviewHeight = 300

class NodeDetails extends Component {
  static propTypes = {
    updateNode: PropTypes.func.isRequired,
    node: PropTypes.object
  }
  close() {
    const { params } = this.props
    history.push("/clouds/"+ params.cloudName + "/flows/"+ params.nodeId +"?center-and-fit=true")
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
  render() {
    const { params, location } = this.props
    return (
      <div className='page-content white'>
        <D3DataFlow
          showControls={false}
          selectedNodeId={params.nodeId}
          height={flowPreviewHeight}
          zoomOnHighlight={false}
          singleClickNav={true}
          colored={true}
          nodeShape={2}
          query={location.query}
        ></D3DataFlow>
        <div id='node-details-pain' className='node-details' style={{'top':'0px'}}>
            {this.getCollectionComponent()}
        </div>
        {this.props.children}
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
    return location.pathname != this.props.location.pathname
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
  onUpdate(nodeData) {
    const { updateNode, node } = this.props
    nodeData.nodeId = node.nodeId
    nodeData.nodeType = node.nodeType
    nodeData.subType = nodeData.subType ? nodeData.subType : node.subType
    updateNode(nodeData)
  }
  getCollectionComponent() {
    // THOUGHT: could use the factory pattern here
    const { params } = this.props
    if (params.nodeType === NODETYPE.JOB.toLowerCase()) {
      return (<JobDetails
        params={params}
        close={this.close.bind(this)}
        getRightMenuOptions={this.getRightMenuOptions}
        onUpdate={this.onUpdate.bind(this)}
        toggleNodeDetailsPain={this.toggleNodeDetailsPain.bind(this)}
      ></JobDetails>)
    } else if (params.nodeType === NODETYPE.DATASOURCE.toLowerCase()) {
      return (<SourceDetails
        params={params}
        close={this.close.bind(this)}
        getRightMenuOptions={this.getRightMenuOptions}
        onUpdate={this.onUpdate.bind(this)}
        toggleNodeDetailsPain={this.toggleNodeDetailsPain.bind(this)}>
      </SourceDetails>)
    } else if (params.nodeType === NODETYPE.CHART.toLowerCase()) {
      return (<ChartDetails
        params={params}
        close={this.close.bind(this)}
        getRightMenuOptions={this.getRightMenuOptions}
        onUpdate={this.onUpdate.bind(this)}
        toggleNodeDetailsPain={this.toggleNodeDetailsPain.bind(this)}
      ></ChartDetails>)
    } else if (params.nodeType === NODETYPE.DASHBOARD.toLowerCase()) {
      return (<BoardDetails
        params={params}
        close={this.close.bind(this)}
        getRightMenuOptions={this.getRightMenuOptions}
        onUpdate={this.onUpdate.bind(this)}
        toggleNodeDetailsPain={this.toggleNodeDetailsPain.bind(this)}
      ></BoardDetails>)
    }
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
