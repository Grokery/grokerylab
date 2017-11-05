import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNode } from '../../actions'
import { RESOURCES } from '../../globals.js'
import ContentEditable from '../ContentEditable/ContentEditable'
import Comments from '../Comments/Comments'
import ChartInfo from './ChartInfo'
import SourceInfo from './SourceInfo'
import JobInfo from './JobInfo'
import './InfoTab.css'

class InfoTab extends Component {
  static propTypes = {
    lookups: PropTypes.object,
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    fetchNode: PropTypes.func.isRequired
  }
  getItemDetailSection() {
    const { node, params } = this.props
    if (node.collection === RESOURCES.CHARTS) {
        return (<ChartInfo node={node} params={params}></ChartInfo>)
    } else if (node.collection === RESOURCES.DATASOURCES) {
        return (<SourceInfo node={node} params={params}></SourceInfo>)
    } else if (node.collection === RESOURCES.JOBS) {
        return (<JobInfo node={node} params={params}></JobInfo>)
    }  else {
        return (<div></div>)
    }
  }
  handleTitleChange(e) {
      this.props.onUpdate({'title': e.target.value})
  }
  handleDescriptionChange(e) {
      this.props.onUpdate({'description': e.target.value})
  }
  getSubtypeName(node) {
    const { lookups } = this.props
    console.log(lookups)
    switch (node.collection) {
        case RESOURCES.JOBS:
            return lookups.jobtypes[node.subtype] ? lookups.jobtypes[node.subtype].description : "Job Placeholder"
        case RESOURCES.DATASOURCES:
            return lookups.sourcetypes[node.subtype] ? lookups.sourcetypes[node.subtype].description : "Source Placeholder"
    }
    return ""
  }
  render() {
    const { node, params } = this.props
    if (!node) { return <div></div> }
    return (
        <div className='info-tab'>
            <div className='col-md-6'>
                <ContentEditable type='h1' className="node-title" value={node.title} onChange={this.handleTitleChange.bind(this)}></ContentEditable>
                <ContentEditable type='p' className="node-description" value={node.description} onChange={this.handleDescriptionChange.bind(this)}></ContentEditable>
                <div className="node-detail-section">
                    {this.getItemDetailSection()}
                </div>
            </div>
            <div className='col-md-6'>
                <div className='node-info'>
                    <div className='col-md-6'><label>SubType: </label> {this.getSubtypeName(node)}</div>
                    <div className='col-md-6'><label>Owner: </label> {node.owner}</div>
                    {/* Maybe make component to handle collection and type specific fields */}
                </div>
                <Comments nodeId={params.nodeId}></Comments>
            </div>
        </div>
    )
  }
  componentDidMount() {
    const { fetchNode, params } = this.props
    fetchNode(params.collection, params.nodeId)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId],
    lookups: state.lookups
  }
}

export default connect(mapStateToProps, {
    fetchNode
})(InfoTab)