import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat } from 'lodash'
import AceEditor from 'react-ace'
import 'brace/mode/html'
import 'brace/theme/chrome'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import LogsTab from 'shared/LogsTab/LogsTab'
import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'

class BoardDetails extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    rightMenuOptions: PropTypes.array.isRequired,
    flowOpen: PropTypes.bool,
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false,
          dirty: false,
          sourceDraft: props.node.source,
      }
  }
  getRightMenuOptions = () => {
    let saveOption = null
    if (this.state.dirty) {
      saveOption = <a key='save' href='' onClick={this.updateSourceCode} className='btn btn-default'><i className='fa fa-save'></i></a>
    }
    return concat([
      saveOption,
      <a key='edit' href='' onClick={this.toggleEditDialog} className='btn btn-default'><i className='fa fa-cog'></i></a>,
    ], this.props.rightMenuOptions)
  }
  renderRightMenuOptions() {
    return (
      <div className='btn-group item-options' style={{position: 'absolute', right: 0, top: 0}}>
          {this.getRightMenuOptions()}
      </div>
    )
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.node.nodeId !== this.props.node.nodeId) {
      this.setState({sourceDraft: nextProps.node.source})
    }
  }
  render() {
    const { params, node, flowOpen } = this.props
    let title = node ? node.title : ''
    let height = window.innerHeight
    if (flowOpen) {
      height -= 340
    } else {
      height -= 90
    }
    return (
      <div className='board-details'>
        <Tabs>
          <Panel title={title}>
            {this.renderRightMenuOptions()}
            <IBoardFrame 
              cloudName={params.cloudName} 
              boardId={params.nodeId} 
              height={height}
            ></IBoardFrame>
          </Panel>
          <Panel title='Code'>
            {this.renderRightMenuOptions()}
            <AceEditor
              key={params.nodeId}
              mode="html"
              theme="chrome"
              onChange={this.onChange}
              fontSize={12}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={this.state.sourceDraft}
              width={'100%'}
              height={height+'px'}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </Panel>
          <Panel title='History'>
            {this.renderRightMenuOptions()}
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
  onChange = (newCode) => {
    this.setState({ sourceDraft: newCode, dirty: true })
  }
  updateSourceCode = (e) => {
    e.preventDefault()
    this.props.onUpdate({
      'source': this.state.sourceDraft
    }, () => {
      this.setState({ dirty: false })
    })
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
  return {}
}

export default connect(mapStateToProps, {})(BoardDetails)
