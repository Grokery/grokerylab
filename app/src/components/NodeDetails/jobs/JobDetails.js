import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat } from 'lodash'

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
      height: height
    }
    return (
      <div className='job-details'>
        <Tabs>
          <Panel title='Info'>
            {this.renderRightMenuOptions()}
            <InfoTab {...commonProps}>
              <JobInfo {...commonProps}></JobInfo>
            </InfoTab>
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
  getJobCodeComponent(props) {
    const { node } = this.props
    if (node.subType === 'GENERIC') {
      return (<BrowserJs {...props}></BrowserJs>)
    } else if (node.subType === 'AWSLAMBDA') {
      return (<AWSLambda {...props}></AWSLambda>)
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(JobDetails)
