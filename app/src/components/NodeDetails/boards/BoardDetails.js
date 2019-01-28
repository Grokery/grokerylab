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
    height: PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false,
          dirty: false,
          sourceDraft: props.node.source,
      }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  render() {
    const { params, node, height } = this.props
    let title = node ? node.title : ''
    return (
      <div className='board-details'>
        <Tabs>
          <Panel title={title}>
            {this.renderRightMenuOptions()}
            <IBoardFrame 
              cloudName={params.cloudName} 
              boardId={params.nodeId} 
              height={height}
              width={'100%'}
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
  getRightMenuOptions = () => {
    return concat([
      <button key='save' disabled={!this.state.dirty} onClick={this.onUpdate} className='btn btn-default'><i className='fa fa-save'></i></button>,
      <button key='edit' onClick={this.toggleEditDialog} className='btn btn-default'><i className='fa fa-cog'></i></button>,
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
  onKeyDown = (e) => {
    if (e.metaKey && e.keyCode === 83) { // 83='s'
      this.onUpdate(e)
    }
  }
  onChange = (newCode) => {
    this.setState({ sourceDraft: newCode, dirty: true })
  }
  onUpdate = (e) => {
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
