import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

import ContentEditable from 'shared/ContentEditable/ContentEditable'
import Comments from 'shared/Comments/Comments'

import './InfoTab.css'

class InfoTab extends Component {
  static propTypes = {
    lookups: PropTypes.object,
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired
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
            <div className='row'>
                <div className='col col-sm-6 '>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="node-title-section">
                                <ContentEditable type='h1' className="node-title" value={node.title} onChange={this.handleTitleChange.bind(this)}></ContentEditable>
                                <ContentEditable type='p' className="node-description" value={node.description} onChange={this.handleDescriptionChange.bind(this)}></ContentEditable>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col col-sm-6 '>
                    <div className='row'>
                        <div className="node-info-section">
                            <div className='col-sm-6'><label>Type: </label> { node.subType }</div>
                            <div className='col-sm-6'><label>Created: </label> { moment(node.created).format('DD MMM YYYY HH:mm') }</div>
                            <div className='col-sm-6'><label>Owner: </label> { node.owner || 'admin' }</div>
                            <div className='col-sm-6'><label>Updated: </label> { moment(node.updated).format('DD MMM YYYY HH:mm') }</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6 section1'>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="node-detail-section">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="row node-comments">
                        <div className='col-sm-12'>
                            <Comments params={params} nodeId={params.nodeId}></Comments>
                        </div>
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