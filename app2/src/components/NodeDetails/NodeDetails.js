import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { updateQueryParam, NODETYPE } from 'common'
import { headerNavHeight, sideNavWidth } from 'config'
import { updateNode, fetchNode } from 'store/actions/nodes'
import D3DataFlow from 'shared/D3DataFlow/D3DataFlow'
import JobDetails from './jobs/JobDetails'
import SourceDetails from './sources/SourceDetails'
import BoardDetails from './boards/BoardDetails'

const flowPreviewHeight = 300
const tabsNavHeight = 40

class NodeDetails extends Component {
  static propTypes = {
    fetchNode: PropTypes.func.isRequired,
    updateNode: PropTypes.func.isRequired,
    node: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {
      flowOpen: props.location.query.flow === "open" ? true : false,
      rightMenuOptions: [
        <a key='openClose' href='' onClick={this.toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-arrows-v'></i></a>,
        <a key='return' href={"#/clouds/"+ props.params.cloudName + "/flows?nodeId=" + props.params.nodeId} className='btn btn-default'><i className='fa fa-times'></i></a>
      ],
    }
  }
  componentDidMount() {
    const { fetchNode, params } = this.props
    fetchNode(params.cloudName, params.nodeType, params.nodeId)
  }
  render() {
    const { params, location, node } = this.props
    const { flowOpen, rightMenuOptions } = this.state
    if (!node) {return null}
    let detailsHeight = window.innerHeight
    if (flowOpen) {
      detailsHeight -= (flowPreviewHeight + tabsNavHeight)
    } else {
      detailsHeight -= (headerNavHeight + tabsNavHeight)
    }
    let props = {
      node: node,
      params: params,
      onUpdate: this.onUpdate,
      toggleNodeDetailsPain: this.toggleNodeDetailsPain,
      rightMenuOptions: rightMenuOptions,
      height: detailsHeight,
      reloadData: this.reloadData,
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
        <div style={{position:'relative'}}>
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
  reloadData = (e) => {
    e.preventDefault()
    const { fetchNode, params } = this.props
    fetchNode(params.cloudName, params.nodeType, params.nodeId)
  }
  toggleNodeDetailsPain = (e) => {
    e.preventDefault()
    const { flowOpen } = this.state
    updateQueryParam('flow', !flowOpen ? 'open' : 'closed')
    this.setState({flowOpen: !flowOpen})
  }
  onUpdate = (nodeData, cb) => {
    const { updateNode, node, params } = this.props
    nodeData.nodeId = node.nodeId
    nodeData.nodeType = node.nodeType
    nodeData.subType = nodeData.subType ? nodeData.subType : node.subType
    updateNode(params.cloudName, nodeData, cb)
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {
  fetchNode,
  updateNode,
})(NodeDetails)
