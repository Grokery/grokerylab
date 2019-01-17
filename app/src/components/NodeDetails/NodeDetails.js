import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateQueryParam, NODETYPE } from 'common'
import { updateNode, fetchNode } from 'store/actions'
import D3DataFlow from 'shared/D3DataFlow/D3DataFlow'
import JobDetails from './jobs/JobDetails'
import SourceDetails from './sources/SourceDetails'
import BoardDetails from './boards/BoardDetails'
import './NodeDetails.css'

const flowPreviewHeight = 300

class NodeDetails extends Component {
  static propTypes = {
    fetchNode: PropTypes.func.isRequired,
    updateNode: PropTypes.func.isRequired,
    node: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      flowOpen: props.location.query.flow === "open" ? true : false
    }
  }
  componentDidMount() {
    const { fetchNode, params } = this.props
    fetchNode(params.cloudName, params.nodeType, params.nodeId)
  }
  render() {
    const { params, location } = this.props
    const { flowOpen } = this.state
    let props = {
      params: params,
      getRightMenuOptions: this.getRightMenuOptions,
      onUpdate: this.onUpdate,
      toggleNodeDetailsPain: this.toggleNodeDetailsPain,
    }
    let topPos = flowOpen ? flowPreviewHeight : 50
    return (
      <div className='page-content white'>
        <D3DataFlow
          params={params}
          showControls={false}
          selectedNodeId={params.nodeId}
          height={flowPreviewHeight - 50}
          width={window.innerWidth - 64}
          zoomOnHighlight={false}
          singleClickNav={true}
          colored={false}
          nodeShape={2}
          query={location.query}
        />
        <div id='node-details-pain' className='node-details' style={{top:topPos}}>
            {function() {
                if (params.nodeType === NODETYPE.JOB.toLowerCase()) {
                  return (<JobDetails {...props} />)
                } else if (params.nodeType === NODETYPE.SOURCE.toLowerCase()) {
                  return (<SourceDetails {...props} />)
                } else if (params.nodeType === NODETYPE.BOARD.toLowerCase()) {
                  return (<BoardDetails {...props} />)
                }
            }()}
        </div>
      </div>
    )
  }
  getRightMenuOptions() {
    const { toggleNodeDetailsPain, params } = this.props
    return (
      <div className='btn-group pull-right item-options'>
          <a href='' onClick={this.toggleEditDialog.bind(this)} className='btn btn-default'><i className='fa fa-cog'></i></a>
          <a href='' onClick={toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-arrows-v'></i></a>
          <a href={"#/clouds/"+ params.cloudName + "/flows?nodeId=" + params.nodeId} className='btn btn-default'><i className='fa fa-times'></i></a>
      </div>
    )
  }
  toggleNodeDetailsPain = (e) => {
    e.preventDefault()
    const { flowOpen } = this.state
    updateQueryParam('flow', !flowOpen ? 'open' : 'closed')
    this.setState({flowOpen: !flowOpen})
  }
  onUpdate = (nodeData) => {
    const { updateNode, node, params } = this.props
    nodeData.nodeId = node.nodeId
    nodeData.nodeType = node.nodeType
    nodeData.subType = nodeData.subType ? nodeData.subType : node.subType
    updateNode(params.cloudName, nodeData)
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId] || {}
  }
}

export default connect(mapStateToProps, {
  fetchNode,
  updateNode,
})(NodeDetails)
