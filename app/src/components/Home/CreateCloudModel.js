import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { addNewCloudToSession } from 'authentication'
import Modal from 'shared/Modal/Modal'
import Loader from 'shared/Loader/Loader'
import { createCloud } from 'store/actions'
import { GROKERY_API } from 'config'
import './CreateCloudModel.css'

let defaultData = {
  title: 'New Cloud',
  name: 'newcloud',
  cloudType: 'AWS',
  url: GROKERY_API,
  password: '',
  adminAccess: {
    credentials: {
      awsAccessKeyId: '',
      awsSecretKey: '',
      awsRegion: 'us-west-2',
      azureKey: ''
    }
  }
}

class CreateCloudModel extends Component {
  static propTypes = {
    createCloud: PropTypes.func.isRequired,
    addNewCloudToSession: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
      this.state = {
          showModel: false,
          working: false,
          data: _.cloneDeep(defaultData)
      }
  }
  mergeState(newState) {
    this.setState(_.merge(this.state, newState))
  }
  onTitleChange(event) {
    let newTitle = event.target.value
    let name = newTitle.toLowerCase()
    name = name.replace(/ /g, '')
    name = name.replace(/[^0-9a-z]/gi, '')
    this.mergeState({data: {title: newTitle, name: name}})
  }
  onNameChange(event) {
    this.mergeState({data: {name: event.target.value}})
  }
  onURLChange(event) {
    this.mergeState({data: {url: event.target.value}})
  }
  onCloudTypeChange(event) {
    this.mergeState({data: {cloudType: event.target.value}})
  }
  onPasswordChange(event) {
    this.mergeState({data: {password: event.target.value}})
  }
  onAWSAccessKeyIdChange(event) {
    this.mergeState({data: {adminAccess: {credentials: {awsAccessKeyId: event.target.value}}}})
  }
  onAWSSecretKeyChange(event) {
    this.mergeState({data: {adminAccess: {credentials: {awsSecretKey: event.target.value}}}})
  }
  onAWSREgionChange(event) {
    this.mergeState({data: {adminAccess: {credentials: {awsRegion: event.target.value}}}})
  }
  onAzureKeyChange(event) {
    this.mergeState({data: {adminAccess: {credentials: {azureKey: event.target.value}}}})
  }
  onSubmit(event) {
    event.preventDefault()
    this.setState({working: true})
    // TODO validate state
    let { createCloud, addNewCloudToSession } = this.props
    createCloud(this.state.data, function(response, json) {
      this.setState({
        showModel: false,
        working: false,
        data: _.cloneDeep(defaultData)
      })
      if (response.ok && json) {
        addNewCloudToSession(json)
      }
    }.bind(this))
  }
  toggleDialog(event) {
    event.preventDefault()
    this.setState({showModel: !this.state.showModel})
  }
  getAccessKeyFormFields() {
    if (this.state.data.cloudType === 'AWS') {
      return (
        <div key='aws-creds' className='form-row'>
          <div className='form-group col-md-2'>
            <label>AWS Region:</label>
            <input name='awsRegion' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsRegion} onChange={this.onAWSREgionChange.bind(this)}/>
          </div>
          <div className='form-group col-md-5'>
            <label>AWS Acess Key Id:</label>
            <input name='awsAccess' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsAccessKeyId} onChange={this.onAWSAccessKeyIdChange.bind(this)}/>
          </div>
          <div className='form-group col-md-5'>
            <label>AWS Secret Key:</label>
            <input name='awsSecret' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsSecretKey} onChange={this.onAWSSecretKeyChange.bind(this)}/>
          </div>
        </div>
      )
    } else if (this.state.data.cloudType === 'AZURE') {
      return (
        <div key='azure-creds' className='form-row'>
          <div className='form-group col-md-12'>
            <label>Azure API Access Key:</label>
            <input name='AzureAccess' type='text' className='form-control' value={this.state.data.adminAccess.credentials.azureKey} onChange={this.onAzureKeyChange.bind(this)}/>
          </div>
        </div>
      )
    }
  }
  getForm() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className='form-row'>
          <div className='form-group col-md-5'>
            <label>Cloud Title:</label>
            <input type='text' className='form-control' value={this.state.data.title} onChange={this.onTitleChange.bind(this)}/>
          </div>
          <div className='form-group col-md-5'>
            <label>URL Friendly Title:</label>
            <input type='text' className='form-control' value={this.state.data.name} onChange={this.onNameChange.bind(this)} disabled/>
          </div>
          <div className='form-group col-md-2'>
            <label>Type:</label>
            <select className='form-control' value={this.state.data.cloudType} onChange={this.onCloudTypeChange.bind(this)}>
              <option value='LOCAL'>Local</option>
              <option defaultValue value='AWS'>AWS</option>
              <option value='AZURE'>Azure</option>
              <option value='MULTICLOUD'>MultiCloud</option>
            </select>
          </div>
        </div>
        {this.getAccessKeyFormFields()}
        <div className='form-row'>
          <div className='form-group col-md-4'>
            <label>Your Password:</label>
            <input type='password' className='form-control' value={this.state.data.password} onChange={this.onPasswordChange.bind(this)}/>
            <span className='form-help-text'>(Used to encrypt access keys so only you can access them)</span>
          </div>
          <div className='form-group col-md-8'></div>
        </div>
      </form>
    )
  }
  render() {
    return (
        <div id='CreateCloudModel' key='add-cloud'>
          <div className='pull-right'>
            <a id='new-cloud-btn' className='btn' href='#' onClick={this.toggleDialog.bind(this)}><i className='fa fa-plus'/></a>
            <Modal shown={this.state.showModel} >
              <div className='modal-header'>
                <button type='button' className='close' onClick={this.toggleDialog.bind(this)} aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                <h4 className='modal-title'>Create New Cloud</h4>
              </div>
              <div className='modal-body'>
                <Loader show={this.state.working} />
                {this.getForm()}
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-default' onClick={this.toggleDialog.bind(this)}>Cancel</button>
                <button type='button' className='btn btn-primary' onClick={this.onSubmit.bind(this)}>Create Cloud</button>
              </div>
            </Modal>
          </div>
         </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    addNewCloudToSession: addNewCloudToSession
  }
}

export default connect(mapStateToProps, {
  createCloud
})(CreateCloudModel)
