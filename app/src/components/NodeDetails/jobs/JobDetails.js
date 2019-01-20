import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat } from 'lodash'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import InfoTab from 'shared/InfoTab/InfoTab'
import LogsTab from 'shared/LogsTab/LogsTab'

import JobCode from './JobCode'
import JobInfo from './JobInfo'
import JobForm from './JobForm'

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
    const { onUpdate, params, node } = this.props
    let commonProps = {
      key: params.nodeId, 
      params: params,
      onUpdate: onUpdate,
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
            <JobCode {...commonProps}></JobCode>
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
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(JobDetails)
