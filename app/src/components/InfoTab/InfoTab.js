import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNode } from '../../actions'
import ContentEditable from '../ContentEditable/ContentEditable'
import Comments from '../Comments/Comments'
import ChartInfo from './ChartInfo'
import SourceInfo from './SourceInfo'
import JobInfo from './JobInfo'
import './InfoTab.css'

class InfoTab extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    fetchNode: PropTypes.func.isRequired
  }
  getItemDetailSection() {
    const { node, params } = this.props
    if (node.collection === "charts") {
        return (<ChartInfo node={node} params={params}></ChartInfo>)
    } else if (node.collection === "datasources") {
        return (<SourceInfo node={node} params={params}></SourceInfo>)
    } else if (node.collection === "jobs") {
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
                    <div className='col-md-6'><label>Type: </label> {node.type}</div>
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
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {
    fetchNode
})(InfoTab)