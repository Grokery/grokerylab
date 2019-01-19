import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateQueryParam, NODETYPE } from 'common'
import { headerNavHeight, sideNavWidth } from 'config'
import { updateNode, fetchNode } from 'store/actions'
import D3DataFlow from 'shared/D3DataFlow/D3DataFlow'
import JobDetails from './jobs/JobDetails'
import SourceDetails from './sources/SourceDetails'
import BoardDetails from './boards/BoardDetails'

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
      onUpdate: this.onUpdate,
      toggleNodeDetailsPain: this.toggleNodeDetailsPain,
    }
    const flowDisplay = flowOpen ? 'initial' : 'none'
    return (
      <div className='sidebar-page-content' style={{height: window.innerHeight - headerNavHeight}}>
        <div style={{display:flowDisplay}}>
          <D3DataFlow
            params={params}
            showControls={false}
            selectedNodeId={params.nodeId}
            height={flowPreviewHeight - headerNavHeight} 
            width={window.innerWidth - sideNavWidth}
            zoomOnHighlight={false}
            singleClickNav={true}
            colored={false}
            nodeShape={2}
            query={location.query}
          />
        </div>
        <div>
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
