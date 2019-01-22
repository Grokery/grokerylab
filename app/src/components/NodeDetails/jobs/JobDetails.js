import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat, assign } from 'lodash'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import InfoTab from 'shared/InfoTab/InfoTab'
import LogsTab from 'shared/LogsTab/LogsTab'

import JobInfo from './JobInfo'
import JobForm from './JobForm'
import BrowserJs from './codeTabs/BrowserJs'
import AWSLambda from './codeTabs/AWSLambda'

class JobDetails extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    rightMenuOptions: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false,
          dirty: false,
          draftCode: props.node.code,
      }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.node.nodeId !== this.props.node.nodeId) {
      this.setState({draftCode: nextProps.node.code})
    }
  }
  onKeyDown = (e) => {
    if (e.metaKey && e.keyCode === 83) { // 83='s'
      this.onUpdate(e)
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  render() {
    const { onUpdate, params, node, flowOpen } = this.props
    let height = window.innerHeight
    if (flowOpen) {
      height -= 340
    } else {
      height -= 90
    }
    let commonProps = {
      key: params.nodeId, 
      params: params,
      onUpdate: onUpdate,
      height: height,
    }
    return (
      <div className='job-details'>
        <Tabs>
          <Panel title='Info'>
            {this.renderRightMenuOptions()}
            {this.getJobInfoComponent(commonProps)}
          </Panel>
          <Panel title='Code'>
            {this.renderRightMenuOptions()}
            {this.getJobCodeComponent(commonProps)}
          </Panel>
          <Panel title='History'>
            {this.renderRightMenuOptions()}
            <LogsTab params={this.props.params}></LogsTab>
          </Panel>
        </Tabs>
        <EditModal 
          title="Edit Job" 
          node={node} 
          onUpdate={this.props.onUpdate} 
          shown={this.state.shown} 
          toggleEditDialog={this.toggleEditDialog}
          form={(<JobForm node={node} onUpdate={this.props.onUpdate}></JobForm>)}
        ></EditModal>
      </div>
    )
  }
  getRightMenuOptions = () => {
    let saveOption = null
    if (this.state.dirty) {
      saveOption = <a key='save' href='' onClick={this.onUpdate} className='btn btn-default'><i className='fa fa-save'></i></a>
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
  getJobInfoComponent(props) {
    const { node } = this.props
    if (node.subType === 'GENERIC') {
      return (<InfoTab {...props}><JobInfo {...props}></JobInfo></InfoTab>)
    } else if (node.subType === 'BROWSERJS') {
      return (<InfoTab {...props}><JobInfo {...props}></JobInfo></InfoTab>)
    } else if (node.subType === 'AWSLAMBDA') {
      return (<InfoTab {...props}><JobInfo {...props}></JobInfo></InfoTab>)
    }
  }
  getJobCodeComponent(props) {
    const { node } = this.props
    const codeProps = assign(props, {
      draftCode: this.state.draftCode,
      onCodeChange: this.onCodeChange,
    })
    if (node.subType === 'GENERIC') {
      return (<div>Placeholder</div>)
    } else if (node.subType === 'BROWSERJS') {
      return (<BrowserJs {...codeProps}></BrowserJs>)
    } else if (node.subType === 'AWSLAMBDA') {
      return (<AWSLambda {...codeProps}></AWSLambda>)
    } else {
      return null
    }
  }
  toggleEditDialog = (e) => {
    if (e) {e.preventDefault()}
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
  onCodeChange = (newCode) => {
    this.setState({draftCode: newCode, dirty: true})
  }
  onUpdate = (e) => {
    e.preventDefault()
    this.props.onUpdate({
      'code': this.state.draftCode
    }, () => {
      this.setState({ dirty: false })
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(JobDetails)
