import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateQueryParam } from '../globals.js'
import { updateNode } from '../actions'
import { history } from '../index.js'
import D3DataFlow from '../components/D3DataFlow/D3DataFlow'
import JobDetails from '../components/NodeDetails/JobDetails'
import SourceDetails from '../components/NodeDetails/SourceDetails'
import ChartDetails from '../components/NodeDetails/ChartDetails'
import BoardDetails from '../components/NodeDetails/BoardDetails'

const flowPreviewHeight = 300

class NodeDetails extends Component {
  static propTypes = {
    updateNode: PropTypes.func.isRequired
  }
  close() {
    const { params } = this.props
    history.push("/clouds/"+ params.cloudId + "/flow/"+ params.nodeId +"?center-and-fit=true")
  }
  getRightMenuOptions(){
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
          colored={false}
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
      this.toggleNodeDetailsPain()
    }
  }
  toggleNodeDetailsPain(e) {
    if (e && typeof(e.preventDefault === 'function')) {
      e.preventDefault()
    }
    let pain = document.getElementById("node-details-pain")
    if (pain.style.top === '0px') {
      updateQueryParam('flow','open')
      pain.style.top = flowPreviewHeight+'px'
    } else {
      updateQueryParam('flow','closed')
      pain.style.top = '0px'
    }
    window.scrollTo(0,0)
  }
  onUpdate(nodeData) {
    const { updateNode, params } = this.props
    nodeData.id = params.nodeId
    updateNode(params.collection, nodeData)
  }
  getCollectionComponent() {
    const { params} = this.props
    if (params.collection === 'jobs') {
      return (<JobDetails 
        params={params} 
        close={this.close.bind(this)}
        getRightMenuOptions={this.getRightMenuOptions}
        onUpdate={this.onUpdate.bind(this)} 
        toggleNodeDetailsPain={this.toggleNodeDetailsPain}
      ></JobDetails>)
    } else if (params.collection === 'datasources') {
      return (<SourceDetails 
        params={params} 
        close={this.close.bind(this)}
        getRightMenuOptions={this.getRightMenuOptions}
        onUpdate={this.onUpdate.bind(this)} 
        toggleNodeDetailsPain={this.toggleNodeDetailsPain}>
      </SourceDetails>)
    } else if (params.collection === 'charts') {
      return (<ChartDetails 
        params={params} 
        close={this.close.bind(this)}
        getRightMenuOptions={this.getRightMenuOptions}
        onUpdate={this.onUpdate.bind(this)} 
        toggleNodeDetailsPain={this.toggleNodeDetailsPain}
      ></ChartDetails>)
    } else if (params.collection === 'dashboards') {
      return (<BoardDetails 
        params={params} 
        close={this.close.bind(this)}
        getRightMenuOptions={this.getRightMenuOptions}
        onUpdate={this.onUpdate.bind(this)} 
        toggleNodeDetailsPain={this.toggleNodeDetailsPain}
      ></BoardDetails>)
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {
  updateNode
})(NodeDetails)
