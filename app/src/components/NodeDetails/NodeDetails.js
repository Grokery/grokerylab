import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import queryString from 'query-string'

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
    queryParams: PropTypes.object,
    urlParams: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {
      flowOpen: props.queryParams && props.queryParams.flow === "open" ? true : false,
      rightMenuOptions: [
        <button key='openClose' href='' onClick={this.toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-arrows-v'></i></button>,
        <Link key='return' to={"/clouds/"+ props.urlParams.cloudName + "/flows?nodeId=" + props.urlParams.nodeId} className='btn btn-default'><i className='fa fa-times'></i></Link>
      ],
    }
  }
  componentDidMount() {
    const { fetchNode, urlParams } = this.props
    fetchNode(urlParams.cloudName, urlParams.nodeType, urlParams.nodeId)
  }
  render() {
    const { urlParams, node } = this.props
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
      params: urlParams,
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
            params={urlParams}
            showControls={false}
            selectedNodeId={urlParams.nodeId}
            height={flowPreviewHeight - headerNavHeight} 
            width={window.innerWidth - sideNavWidth}
            zoomOnHighlight={false}
            singleClickNav={true}
            colored={false}
            nodeShape={2}
            query={{}}
          />
        </div>
        <div style={{position:'relative'}}>
            {function() {
                if (urlParams.nodeType === NODETYPE.JOB.toLowerCase()) {
                  return (<JobDetails {...props} />)
                } else if (urlParams.nodeType === NODETYPE.SOURCE.toLowerCase()) {
                  return (<SourceDetails {...props} />)
                } else if (urlParams.nodeType === NODETYPE.BOARD.toLowerCase()) {
                  return (<BoardDetails {...props} />)
                }
            }()}
        </div>
      </div>
    )
  }
  reloadData = (e) => {
    e.preventDefault()
    const { fetchNode, urlParams } = this.props
    fetchNode(urlParams.cloudName, urlParams.nodeType, urlParams.nodeId)
  }
  toggleNodeDetailsPain = (e) => {
    e.preventDefault()
    const { flowOpen } = this.state
    updateQueryParam('flow', !flowOpen ? 'open' : 'closed')
    this.setState({flowOpen: !flowOpen})
  }
  onUpdate = (nodeData, cb) => {
    const { updateNode, node, urlParams } = this.props
    nodeData.nodeId = node.nodeId
    nodeData.nodeType = node.nodeType
    nodeData.subType = nodeData.subType ? nodeData.subType : node.subType
    updateNode(urlParams.cloudName, nodeData, cb)
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    urlParams: ownProps.match.params,
    queryParams: queryString.parse(ownProps.location.search),
    node: state.nodes[ownProps.match.params.nodeId],
  }
}

export default withRouter(connect(mapStateToProps, {
  fetchNode,
  updateNode,
})(NodeDetails))
