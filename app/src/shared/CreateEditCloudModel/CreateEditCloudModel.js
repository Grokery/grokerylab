import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { addNewCloudToSession, removeCloudFromSession } from 'authentication'
import { createCloud, updateCloud, deleteCloud } from 'store/actions/cloud'
import { API_BASE_URL } from 'config'
import Modal from 'shared/Modal/Modal'
import Loader from 'shared/Loader/Loader'
import './CreateEditCloudModel.css'

let defaultData = {
  title: 'New Cloud',
  name: 'newcloud',
  cloudType: 'AWS',
  url: API_BASE_URL,
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

class CreateEditCloudModel extends Component {
  static propTypes = {
    shown: PropTypes.bool.isRequired,
    createCloud: PropTypes.func.isRequired,
    updateCloud: PropTypes.func.isRequired,
    deleteCloud: PropTypes.func.isRequired,
    addNewCloudToSession: PropTypes.func.isRequired,
    modalTitle: PropTypes.string,
    isCreate: PropTypes.bool,
    isEdit: PropTypes.bool,
    cloudData: PropTypes.object,
  }
  constructor(props) {
    super(props)
      this.state = {
          working: false,
          data: _.defaultsDeep({}, this.props.cloudData, defaultData)
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
  onSubmit = (event) => {
    event.preventDefault()
    this.setState({working: true})
    // TODO validate state
    if (this.props.isCreate) {
      let { createCloud, addNewCloudToSession } = this.props
      createCloud(this.state.data, (response, json) => {
        this.setState({
          working: false,
          data: _.cloneDeep(defaultData)
        })
        if (response.ok && json) {
          addNewCloudToSession(json)
        }
        this.toggleEditModal()
      })
    } else if (this.props.isEdit) {
      let { updateCloud } = this.props
      updateCloud(this.props.cloudData.name, this.state.data, () => {
        this.setState({
          working: false,
        })
        // if (response.ok && json) {
          // addNewCloudToSession(json)
        // }
        this.toggleEditModal()
      })
      // TODO
    }

  }
  deleteCloud = (e) => {
    e.preventDefault()
    const { cloudData } = this.props
    confirmAlert({
      title: 'Confirm delete:',
      message: 'Perminantly delete cloud and all cloud data?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({working: true})
            this.props.deleteCloud(cloudData.name, (json, response) => {
              if (response.ok) {
                removeCloudFromSession(cloudData.name)
              } else {
                alert("Error deleteing cloud")
                console.err(response)
              }
              this.setState({working: false})
              return json
            })
          }
        },
        {
          label: 'No',
        }
      ]
    })
  }
  toggleEditModal = () => {
    this.setState(_.cloneDeep(defaultData))
    this.props.toggleShown()
  }
  getAccessKeyFormFields() {
    if (this.state.data.cloudType === 'AWS') {
      return (
        <div key='aws-creds' className='row'>
          <div className='col col-sm-4'>
            <label>Region:</label>
            <input name='awsRegion' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsRegion} onChange={this.onAWSREgionChange.bind(this)}/>
          </div>
          <div className='col col-sm-8'>
            <label>Acess Key Id:</label>
            <input name='awsAccess' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsAccessKeyId} onChange={this.onAWSAccessKeyIdChange.bind(this)}/>
          </div>
          <div className='col col-sm-12'>
            <label>Secret Key:</label>
            <input name='awsSecret' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsSecretKey} onChange={this.onAWSSecretKeyChange.bind(this)}/>
          </div>
        </div>
      )
    } else if (this.state.data.cloudType === 'AZURE') {
      return (
        <div key='azure-creds' className='row'>
          <div className='col col-sm-12'>
            <label>Azure Access Key:</label>
            <input name='AzureAccess' type='text' className='form-control' value={this.state.data.adminAccess.credentials.azureKey} onChange={this.onAzureKeyChange.bind(this)}/>
          </div>
        </div>
      )
    } else if (this.state.data.cloudType === 'CUSTOM') { 
      return (
        <div key='local-creds' className='row'>
        <div className='col col-sm-12'>
          <label>MongoDB Connection String:</label>
          <input name='LocalAccess' type='text' className='form-control'/>
        </div>
      </div>
      )
    }
  }
  getForm() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className='row'>
          <div className='col col-sm-7'>
            <label>Cloud Title:</label>
            <input type='text' className='form-control' value={this.state.data.title} onChange={this.onTitleChange.bind(this)}/>
          </div>
          <div className='col col-sm-5'>
            <label>URL Friendly Title:</label>
            <input disabled type='text' className='form-control' value={this.state.data.name} onChange={this.onNameChange.bind(this)}/>
          </div>
        </div>
        <div className='row'>
          <div className='col col-sm-6'>
            <label>Cloud Type:</label>
            <select className='form-control' value={this.state.data.cloudType} onChange={this.onCloudTypeChange.bind(this)} disabled={this.props.isEdit}>
              <option defaultValue value='AWS'>AWS</option>
              <option value='AZURE'>Azure</option>
              <option value='CUSTOM'>Custom</option>
            </select>
          </div>
        </div>
        {this.getAccessKeyFormFields()}
        <div className='row'>
          <div className='col col-sm-5'>
            <label>Your Password:</label>
            <input type='password' className='form-control' value={this.state.data.password} onChange={this.onPasswordChange.bind(this)}/>
          </div>
          <div className='col col-md-8'></div>
        </div>
      </form>
    )
  }
  render() {
    const { isCreate } = this.props
    return (
        <div id='CreateEditCloudModel' key='add-cloud'>
          <div>
            <Modal shown={this.props.shown} >
              <div className='modal-header'>
                <button type='button' className='close' onClick={this.toggleEditModal} aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                <h4 className='modal-title'>{this.props.modalTitle}</h4>
              </div>
              <div className='modal-body'>
                <Loader show={this.state.working} />
                {this.getForm()}
              </div>
              <div className='modal-footer'>
                {!isCreate ? <button type='button' className='btn btn-danger' onClick={this.deleteCloud} style={{float:'left'}}>Delete</button> : null}
                <button type='button' className='btn btn-default' onClick={this.toggleEditModal}>Cancel</button>
                <button type='button' className='btn btn-primary' onClick={this.onSubmit}>Save</button>
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
  createCloud,
  updateCloud,
  deleteCloud,
})(CreateEditCloudModel)
