import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateNode } from '../actions'
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
  render() {
    const { params } = this.props
    return (
      <div className='page-content white'>
        <D3DataFlow
          showControls={false}
          selectedNodeId={params.nodeId}
          height={flowPreviewHeight}
          zoomOnHighlight={false}
          singleClickNav={true}
          colored={true}
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
      pain.style.top = flowPreviewHeight+'px'
    } else {
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
        onUpdate={this.onUpdate.bind(this)} 
        toggleNodeDetailsPain={this.toggleNodeDetailsPain}
      ></JobDetails>)
    } else if (params.collection === 'datasources') {
      return (<SourceDetails 
        params={params} 
        onUpdate={this.onUpdate.bind(this)} 
        toggleNodeDetailsPain={this.toggleNodeDetailsPain}>
      </SourceDetails>)
    } else if (params.collection === 'charts') {
      return (<ChartDetails 
        params={params} 
        onUpdate={this.onUpdate.bind(this)} 
        toggleNodeDetailsPain={this.toggleNodeDetailsPain}
      ></ChartDetails>)
    } else if (params.collection === 'dashboards') {
      return (<BoardDetails 
        params={params} 
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
