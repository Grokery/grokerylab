import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NODETYPE } from 'common'
import ContentEditable from 'shared/ContentEditable/ContentEditable'
import Comments from 'shared/Comments/Comments'
import ChartInfo from './ChartInfo'
import SourceInfo from './SourceInfo'
import JobDetail from './JobDetail/JobDetail'
import './InfoTab.css'

class InfoTab extends Component {
  static propTypes = {
    lookups: PropTypes.object,
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired
  }
  getItemDetailSection() {
    const { node, params } = this.props
    if (node.nodeType === NODETYPE.CHART) {
        return (<ChartInfo key={params.nodeId} node={node} params={params} onUpdate={this.props.onUpdate}></ChartInfo>)
    } else if (node.nodeType === NODETYPE.DATASOURCE) {
        return (<SourceInfo key={params.nodeId} node={node} params={params} onUpdate={this.props.onUpdate}></SourceInfo>)
    } else if (node.nodeType === NODETYPE.JOB) {
        return (<JobDetail key={params.nodeId} node={node} params={params} onUpdate={this.props.onUpdate}></JobDetail>)
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
        <div className='row info-tab'>
            <div className='col-md-6'>
                <div className="row">
                    <div className="col-md-12">
                        <div className="node-title-section">
                            <ContentEditable type='h1' className="node-title" value={node.title} onChange={this.handleTitleChange.bind(this)}></ContentEditable>
                            <ContentEditable type='p' className="node-description" value={node.description} onChange={this.handleDescriptionChange.bind(this)}></ContentEditable>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="node-detail-section">
                            {this.getItemDetailSection()}
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                <div className='row'>
                    <div className="node-info-section">
                        <div className='col-md-6'><label>Type: </label> { node.subType || ""}</div>
                        <div className='col-md-6'><label>Owner: </label> {node.owner || "admin"}</div>
                        {/* <div className='col-md-6'><label>Hello: </label> world</div>
                        <div className='col-md-6'><label>This: </label> that</div> */}
                    </div>
                </div>
                <div className="row node-comments">
                    <div className='col-md-12'>
                        <Comments nodeId={params.nodeId}></Comments>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId],
    lookups: state.cloudDetails ? state.cloudDetails.lookups : {}
  }
}

export default connect(mapStateToProps, {})(InfoTab)