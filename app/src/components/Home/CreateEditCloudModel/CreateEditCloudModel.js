import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { addNewCloudToSession, removeCloudFromSession } from 'authentication'
import Modal from 'shared/Modal/Modal'
import Loader from 'shared/Loader/Loader'
import { createCloud, updateCloud, deleteCloud } from 'store/actions'
import { API_BASE_URL } from 'config'
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
    if (!confirm("Perminantly delete cloud and all cloud data?")) {
      return
    }
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
  toggleEditModal = () => {
    this.setState(_.cloneDeep(defaultData))
    this.props.toggleShown()
  }
  getAccessKeyFormFields() {
    if (this.state.data.cloudType === 'AWS') {
      return (
        <div key='aws-creds' className='form-row'>
          <div className='form-group col-md-5'>
            <label>AWS Acess Key Id:</label>
            <input name='awsAccess' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsAccessKeyId} onChange={this.onAWSAccessKeyIdChange.bind(this)}/>
          </div>
          <div className='form-group col-md-5'>
            <label>AWS Secret Key:</label>
            <input name='awsSecret' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsSecretKey} onChange={this.onAWSSecretKeyChange.bind(this)}/>
          </div>
          <div className='form-group col-md-2'>
            <label>AWS Region:</label>
            <input name='awsRegion' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsRegion} onChange={this.onAWSREgionChange.bind(this)}/>
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
    } else if (this.state.data.cloudType === 'CUSTOM') { 
      return (
        <div>
          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label>Host API Base Url:</label>
              <input type='text' className='form-control' value={this.state.data.url} onChange={this.onURLChange.bind(this)}/>
            </div>
            <div className='form-group col-md-6'>
              <label>Cloud Id (Leave blank to create new):</label>
              <input type='text' className='form-control' />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col-md-12'>
              <label>Host API Auth Key:</label>
              <input type='text' className='form-control' />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label>Your userid on cloud host:</label>
              <input type='text' className='form-control' />
            </div>
            <div className='form-group col-md-6'>
              <label>Your password on cloud host:</label>
              <input type='text' className='form-control' />
            </div>
          </div>
        </div>
      )
    } else if (this.state.data.cloudType === 'LOCAL') { 
      return (
        <div key='local-creds' className='form-row'>
        <div className='form-group col-md-12'>
          <label>MongoDB Connection String:</label>
          <p>This is where your cloud's meta data will be stored. It must be accessable from the grokeryLab server.</p>
          <input name='LocalAccess' type='text' className='form-control'/>
        </div>
      </div>
      )
    }
  }
  getForm() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className='form-row'>
          <div className='form-group col-md-2'>
            <label>Cloud Type:</label>
            <select className='form-control' value={this.state.data.cloudType} onChange={this.onCloudTypeChange.bind(this)} disabled={this.props.isEdit}>
              <option defaultValue value='AWS'>AWS</option>
              <option value='AZURE'>Azure</option>
              {/* <option value='LINKED'>Linked</option> */}
              {/* <option value='CUSTOM'>Custom</option> */}
              {/* <option value='LOCAL'>Local</option> */}
            </select>
          </div>
          <div className='form-group col-md-5'>
            <label>Cloud Title:</label>
            <input type='text' className='form-control' value={this.state.data.title} onChange={this.onTitleChange.bind(this)}/>
          </div>
          <div className='form-group col-md-5'>
            <label>URL Friendly Title:</label>
            <input disabled type='text' className='form-control' value={this.state.data.name} onChange={this.onNameChange.bind(this)}/>
          </div>
        </div>
        {this.getAccessKeyFormFields()}
        <div className='form-row'>
          <div className='form-group col-md-4'>
            <label>Your Password:</label>
            <input type='password' className='form-control' value={this.state.data.password} onChange={this.onPasswordChange.bind(this)}/>
            <span className='form-help-text'>(Used to encrypt access keys)</span>
          </div>
          <div className='form-group col-md-8'></div>
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
                {/* <button type='button' className='close' onClick={this.toggleEditModal} aria-label='Close'><span aria-hidden='true'>&times;</span></button> */}
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
