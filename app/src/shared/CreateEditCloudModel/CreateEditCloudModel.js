import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { getCloudId, addNewCloudToSession, updateCloudInfoInSession, removeCloudFromSession } from 'authentication'
import { createCloud, updateCloud, deleteCloud } from 'store/actions/cloud'
import { history } from 'index'
import Modal from 'shared/Modal/Modal'
import Loader from 'shared/Loader/Loader'
import './CreateEditCloudModel.css'

let defaultData = {
  title: 'New Cloud',
  name: 'newcloud',
  cloudType: 'AWS',
  cloudHost: 'CUSTOMER',
  installOption: 'EXISTING',
  url: 'http://localhost:8000/api/v0',
  jwtPrivateKey: 'fdksajfdskla843u2938fajsdkfj409r38349jwoi',
  installAccess: {
    credentials: {
      awsAccessKeyId: '',
      awsSecretKey: '',
      awsRegion: '',
      azureKey: ''
    }
  },
  adminAccess: {
    sortRank: 0.0,
    credentials: {
      awsAccessKeyId: '',
      awsSecretKey: '',
      awsRegion: '',
      azureKey: ''
    },
    links: [
      {
        url: '/flows',
        title: 'DataFlows'
      },{
        url: '/boards',
        title: 'DashBoards'
      }
    ]
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
    cloudInfo: PropTypes.object,
    showEditModal: PropTypes.func,
  }
  constructor(props) {
    super(props)
      this.state = {
          working: false,
          data: _.defaultsDeep({}, this.props.cloudInfo, defaultData)
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
  onCloudHostChange(event) {
    this.mergeState({data: {cloudHost: event.target.value}})
  }
  onInstallOptionChange(event) {
    this.mergeState({data: {installOption: event.target.value}})
  }
  onUrlChange(event) {
    this.mergeState({data: {url: event.target.value}})
  }
  onJwtKeyChange(event) {
    this.mergeState({data: {jwtPrivateKey: event.target.value}})
  }
  onInstallAWSAccessKeyIdChange(event) {
    this.mergeState({data: {installAccess: {credentials: {awsAccessKeyId: event.target.value}}}})
  }
  onInstallAWSSecretKeyChange(event) {
    this.mergeState({data: {installAccess: {credentials: {awsSecretKey: event.target.value}}}})
  }
  onInstallAWSREgionChange(event) {
    this.mergeState({data: {installAccess: {credentials: {awsRegion: event.target.value}}}})
    this.mergeState({data: {adminAccess: {credentials: {awsRegion: event.target.value}}}})
  }
  onInstallAzureKeyChange(event) {
    this.mergeState({data: {installAccess: {credentials: {azureKey: event.target.value}}}})
  }
  onAWSAccessKeyIdChange(event) {
    this.mergeState({data: {adminAccess: {credentials: {awsAccessKeyId: event.target.value}}}})
  }
  onAWSSecretKeyChange(event) {
    this.mergeState({data: {adminAccess: {credentials: {awsSecretKey: event.target.value}}}})
  }
  onAWSREgionChange(event) {
    this.mergeState({data: {adminAccess: {credentials: {awsRegion: event.target.value}}}})
    this.mergeState({data: {installAccess: {credentials: {awsRegion: event.target.value}}}})
  }
  onAzureKeyChange(event) {
    this.mergeState({data: {adminAccess: {credentials: {azureKey: event.target.value}}}})
  }
  onSortRankChange(event) {
    this.mergeState({data: {adminAccess: {sortRank: event.target.value}}})
  }
  onSubmit = (event) => {
    event.preventDefault()
    if (this.props.isCreate) {
      let { createCloud, addNewCloudToSession } = this.props
      if (getCloudId(this.state.data.name) !== null) {
        alert('Cloud name/title already in use. Please choose another.')
        return
      }
      this.setState({working: true})
      createCloud(this.state.data, (json, response) => {
        this.setState({
          working: false,
        })
        if (response.ok && json) {
          addNewCloudToSession(json)
        }
        history.replace("/")
        this.closeEditModal()
      })
    } else if (this.props.isEdit) {
      let { updateCloud } = this.props
      this.setState({working: true})
      updateCloud(this.props.cloudInfo.name, this.state.data, (json, response) => {
        this.setState({
          working: false,
        })
        if (response.ok && json) {
          updateCloudInfoInSession(json)
        }
        history.replace("/")
        this.closeEditModal()
      })
    }

  }
  deleteCloud = (e) => {
    e.preventDefault()
    const { cloudInfo } = this.props
    this.closeEditModal()
    confirmAlert({
      title: 'Confirm delete:',
      message: 'Perminantly delete cloud and all cloud data?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({working: true})
            this.props.deleteCloud(cloudInfo.name, (json, response) => {
              if (response.ok) {
                removeCloudFromSession(cloudInfo.name)
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
  closeEditModal = () => {
    this.setState({ data: _.defaultsDeep({}, this.props.cloudInfo, defaultData) })
    this.props.showEditModal(false)
  }
  getInstallFormFields() {
    if (this.state.data.installOption !== 'INSTALL') {
      return null
    }
    if (this.state.data.cloudType === 'AWS') {
      return (
        <div className='row'>
          <div className='col col-sm-4'>
            <label>Install Region:</label>
            <input name='awsRegion' type='text' className='form-control' value={this.state.data.installAccess.credentials.awsRegion} onChange={this.onInstallAWSREgionChange.bind(this)}/>
          </div>
          <div className='col col-sm-8'>
            <label>Install Acess Key Id:</label>
            <input name='awsAccess' type='text' className='form-control' value={this.state.data.installAccess.credentials.awsAccessKeyId} onChange={this.onInstallAWSAccessKeyIdChange.bind(this)}/>
          </div>
          <div className='col col-sm-12'>
            <label>Install Secret Key:</label>
            <input name='awsSecret' type='text' className='form-control' value={this.state.data.installAccess.credentials.awsSecretKey} onChange={this.onInstallAWSSecretKeyChange.bind(this)}/>
          </div>
        </div>
      )
    } else if (this.state.data.cloudType === 'AZURE') {
      return (
        <div className='row'>
          <div className='col col-sm-12'>
            <label>Azure Install Access Key:</label>
            <input name='AzureAccess' type='text' className='form-control' value={this.state.data.installAccess.credentials.azureKey} onChange={this.onInstallAzureKeyChange.bind(this)}/>
          </div>
        </div>
      )
    } else if (this.state.data.cloudType === 'CUSTOM') {
      return (
        <div className='row'>
        <div className='col col-sm-12'>
          <label>MongoDB Connection String:</label>
          <input name='mongoDbConnectionStr' type='text' className='form-control'/>
        </div>
      </div>
      )
    }
  }
  getAccessKeyFormFields() {
    if (this.state.data.cloudType === 'AWS') {
      return (
        <div className='row'>
          <div className='col col-sm-4'>
            <label>Region (same as install):</label>
            <input name='awsRegion' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsRegion} onChange={this.onAWSREgionChange.bind(this)}/>
          </div>
          <div className='col col-sm-8'>
            <label>Admin User Acess Key Id:</label>
            <input name='awsAccess' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsAccessKeyId} onChange={this.onAWSAccessKeyIdChange.bind(this)}/>
          </div>
          <div className='col col-sm-12'>
            <label>Admin User Secret Key:</label>
            <input name='awsSecret' type='text' className='form-control' value={this.state.data.adminAccess.credentials.awsSecretKey} onChange={this.onAWSSecretKeyChange.bind(this)}/>
          </div>
        </div>
      )
    } else if (this.state.data.cloudType === 'AZURE') {
      return (
        <div className='row'>
          <div className='col col-sm-12'>
            <label>Azure Admin User Access Key:</label>
            <input name='AzureAccess' type='text' className='form-control' value={this.state.data.adminAccess.credentials.azureKey} onChange={this.onAzureKeyChange.bind(this)}/>
          </div>
        </div>
      )
    }
  }
  getForm() {
    const { isCreate, isEdit } = this.props
    return (
      <form onSubmit={this.onSubmit}>

        <div className='row'>
          <div className='col col-sm-7'>
            <label>Cloud Flow Title:</label>
            <input type='text' className='form-control' value={this.state.data.title} onChange={this.onTitleChange.bind(this)}/>
          </div>
          <div className='col col-sm-5'>
            <label>URL Friendly Title:</label>
            <input disabled type='text' className='form-control' value={this.state.data.name} onChange={this.onNameChange.bind(this)}/>
          </div>
        </div>

        <div className='row'>
          {/* <div className='col col-sm-6'>
            <label>Cloud Type:</label>
            <select className='form-control' value={this.state.data.cloudType} onChange={this.onCloudTypeChange.bind(this)} disabled={this.props.isEdit}>
              <option value='AWS'>AWS</option>
              <option disabled={true} value='AZURE'>Azure (not yet available)</option>
              <option disabled={true} value='CUSTOM'>Custom (not yet available)</option>
            </select>
          </div> */}
          {/* {isCreate?
            <div className='col col-sm-6'>
              <label>Do you have an existing install?</label>
              <select className='form-control' value={this.state.data.installOption} onChange={this.onInstallOptionChange.bind(this)}>
                <option value='INSTALL'>No, please run the install script</option>
                <option value='EXISTING'>Yes, I have already installed the api</option>
                <option value='LATER'>No, but I'll do it later</option>
              </select>
            </div>
          : null} */}
        </div>
        {isCreate? this.getInstallFormFields() : null}
        {(isCreate && this.state.data.installOption === 'EXISTING') || isEdit ?
          <>
            <div className='row'>
              <div className='col col-sm-12'>
                <label>Cloud Url:</label>
                <input type='text' className='form-control' value={this.state.data.url} onChange={this.onUrlChange.bind(this)}/>
              </div>
            </div>
            <div className='row'>
              <div className='col col-sm-12'>
                <label>JWT Key:</label>
                <input type='text' className='form-control' value={this.state.data.jwtPrivateKey} onChange={this.onJwtKeyChange.bind(this)}/>
              </div>
            </div>
          </>
        : null}

        {/* {isEdit ? 
          <div className='row'>
            <div className='col col-sm-3'>
              <label>Sort Rank:</label>
              <input type='text' className='form-control' value={this.state.data.adminAccess.sortRank} onChange={this.onSortRankChange.bind(this)}/>
            </div>
          </div>
        : null} */}

        {isCreate && this.state.data.installOption === 'INSTALL' ? <h3>Admin User Access</h3> : null}
        {isCreate && this.state.data.installOption === 'INSTALL' ? this.getAccessKeyFormFields() : null}

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
                <button type='button' className='close' onClick={this.closeEditModal} aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                <h4 className='modal-title'>{this.props.modalTitle}</h4>
              </div>
              <div className='modal-body'>
                <Loader show={this.state.working} />
                {this.getForm()}
              </div>
              <div className='modal-footer'>
                {!isCreate ? <button type='button' className='btn btn-danger' onClick={this.deleteCloud} style={{float:'left'}}>Delete</button> : null}
                <button type='button' className='btn btn-default' onClick={this.closeEditModal}>Cancel</button>
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
