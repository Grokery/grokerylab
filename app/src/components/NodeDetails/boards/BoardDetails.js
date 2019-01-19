import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import LogsTab from 'shared/LogsTab/LogsTab'
import BoardCode from './BoardCode'
import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'

class BoardDetails extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    toggleNodeDetailsPain: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
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
        <Tabs getRightMenuOptions={this.getRightMenuOptions}>
          <Panel title={node.title}>
            <div>
              <IBoardFrame cloudName={params.cloudName} boardId={node.nodeId}></IBoardFrame>
            </div>
          </Panel>
          <Panel title='Code'>
            <BoardCode key={params.nodeId} params={params} onUpdate={onUpdate}></BoardCode>
          </Panel>
          <Panel title='History'>
            <LogsTab params={this.props.params}></LogsTab>
          </Panel>
        </Tabs>
        <EditModal 
          title="Edit Dashboard" 
          node={node} 
          onUpdate={this.props.onUpdate} 
          shown={this.state.shown} 
          toggleEditDialog={this.toggleEditDialog}
          form={(<form>hello</form>)}
        ></EditModal>
      </div>
    )
  }
  getRightMenuOptions = () => {
    const { toggleNodeDetailsPain, params } = this.props
    return (
      <div className='btn-group pull-right item-options'>
          <a href='' onClick={this.toggleEditDialog} className='btn btn-default'><i className='fa fa-cog'></i></a>
          <a href='' onClick={toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-arrows-v'></i></a>
          <a href={"#/clouds/"+ params.cloudName + "/flows?nodeId=" + params.nodeId} className='btn btn-default'><i className='fa fa-times'></i></a>
      </div>
    )
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
  toggleEditDialog = (e) => {
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
