import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import LogsTab from 'shared/LogsTab/LogsTab'
import BoardCode from './code/BoardCode'
import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'

import './BoardDetails.css'

class BoardDetails extends Component {
  static propTypes = {
    node: PropTypes.object,
    toggleNodeDetailsPain: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false
      }
  }
  render() {
    const { onUpdate, params, node } = this.props
    if (!node) { return <div></div> }
    return (
      <div className='board-details'>
        <Tabs getRightMenuOptions={this.props.getRightMenuOptions.bind(this)}>
          <Panel title={node.title}>
            <div>
              <IBoardFrame cloudName={params.cloudName} boardId={node.nodeId} width={window.innerWidth - 64} height={window.innerHeight-50}></IBoardFrame>
            </div>
          </Panel>
          <Panel title='Code'>
            <BoardCode key={params.nodeId} params={params} onUpdate={onUpdate}></BoardCode>
          </Panel>
          {/* <Panel title='Data'>
            <div>
              <p>list sources (from upstream) and set/display data from board:quierys map on lift 
                with query code and result on right when selected. Also a toggle for pulling data onload
                or not (disabled or maybe static/live). also show 'key' to use in board source to access loaded data.
                Also show in each query the query run time and result size.
              </p>
              <ul>
                {this.getSources()}
              </ul>
            </div>
          </Panel> */}
          <Panel title='History'>
            <LogsTab params={this.props.params}></LogsTab>
          </Panel>
        </Tabs>
        <EditModal title="Edit Dashboard" node={node} onUpdate={this.props.onUpdate} shown={this.state.shown} toggleEditDialog={this.toggleEditDialog.bind(this)}></EditModal>
        {this.props.children}
      </div>
    )
  }
  getSources() {
    const { node } = this.props
    let sources = []
    node.upstream.forEach((source) => {
      sources.push((<li key={source.nodeId}><a href='' onClick={this.onSourceClick}>{source.nodeType + ": " + source.nodeId}</a></li>))
    })
    return sources
  }
  onSourceClick = (e) => {
    e.preventDefault()
    console.log(e.target)
  }
  updateCode = (newCode) => {
    if (this.debounce) {
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(() => {
      this.props.onUpdate({
        'source': newCode
      })
    }, 1000);
  }
  toggleEditDialog(e) {
    if (e) {e.preventDefault()}
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(BoardDetails)
