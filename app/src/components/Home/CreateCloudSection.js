import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSessionInfo } from '../../authentication'
import Modal from '../../shared/Modal/Modal'
import { GROKERY_API } from '../../config.js'

class CreateCloudSection extends Component {
  constructor(props) {
    super(props)
      this.state = {
          showModel: false,
          cloudTitle: 'New Cloud',
          cloudName: 'newcloud',
          cloudURL: GROKERY_API,
          cloudType: 'AWS',
          userPass: '',
          adminAccess: {}
      }
      // Cloud create example post body
      // {
      //   "name": "hellocloud",
      //   "title": "Hello Cloud",
      //   "cloudType": "AWS",
      //   "url": "https://localhost:8000/api/v0",
      //   "password": "admin123",
      //   "adminAccess": {
      //       "credentials": {
      //         "awsAccessKeyId": "abc",
      //         "awsSecretKey": "123",
      //         "awsRegion": "us-west-2"
      //       }
      //     }
      // }
  }
  handleCloudTitleValueChange(event) {
    let newTitle = event.target.value
    this.setState({cloudTitle: newTitle})
    let name = newTitle.toLowerCase()
    name = name.replace(/ /g, '')
    name = name.replace(/[^0-9a-z]/gi, '')
    this.setState({cloudName: name})
  }
  handleCloudNameValueChange(event) {
    this.setState({cloudName: event.target.value})
  }
  handleCloudURLValueChange(event) {
    this.setState({cloudURL: event.target.value})
  }
  handleCloudTypeValueChange(event) {
    this.setState({cloudType: event.target.value})
  }
  handleSubmit(event) {
    event.preventDefault();
    // TODO validate state
    // TODO post to api
    this.setState({showModel: false})
  }
  toggleDialog(event) {
    event.preventDefault()
    this.setState({showModel: !this.state.showModel})
  }
  getAccessKeyFormFields() {
    if (this.state.cloudType === 'AWS') {
      return (
        <div className='form-row'>
          <div className='form-group col-md-2'>
            <label>AWS Region:</label>
            <input name='awsRegion' type='text' className='form-control' />
          </div>
          <div className='form-group col-md-5'>
            <label>AWS Acess Key Id:</label>
            <input name='awsAccess' type='text' className='form-control'/>
          </div>
          <div className='form-group col-md-5'>
            <label>AWS Secret Key:</label>
            <input name='awsSecret' type='text' className='form-control' />
          </div>
        </div>
      )
    } else if (this.state.cloudType === 'AZURE') {
      return (
        <div className='form-row'>
          <div className='form-group col-md-12'>
            <label>Azure API Access Key:</label>
            <input name='AzureAccess' type='text' className='form-control' />
          </div>
        </div>
      )
    }
  }
  render() {
    return (
        <div key='add-cloud'>
          <div className='cloud-section'>
            <a className='btn new-cloud-button' href='#' onClick={this.toggleDialog.bind(this)}><i className='fa fa-plus'/></a>
            <Modal shown={this.state.showModel}>
              <div className='modal-header'>
                <button type='button' className='close' onClick={this.toggleDialog.bind(this)} aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                <h4 className='modal-title'>Create New Cloud</h4>
              </div>
              <div className='modal-body'>
                  <form onSubmit={this.handleSubmit.bind(this)}>

                    <div className='form-row'>
                      <div className='form-group col-md-5'>
                        <label>Cloud Title:</label>
                        <input type='text' className='form-control' value={this.state.cloudTitle} onChange={this.handleCloudTitleValueChange.bind(this)}/>
                      </div>
                      <div className='form-group col-md-5'>
                        <label>URL Friendly Title:</label>
                        <input type='text' className='form-control' value={this.state.cloudName} onChange={this.handleCloudNameValueChange.bind(this)} disabled/>
                      </div>
                      <div className='form-group col-md-2'>
                        <label>Type:</label>
                        <select className='form-control' value={this.state.cloudType} onChange={this.handleCloudTypeValueChange.bind(this)} disabled>
                          <option defaultValue value='AWS'>AWS</option>
                          <option value='AZURE'>Azure</option>
                        </select>
                      </div>
                    </div>
{/* 
                    <div className='form-row'>
                      <div className='form-group col-md-9'>
                        <label>URL:</label>
                        <input type='text' className='form-control' value={this.state.cloudURL} onChange={this.handleCloudURLValueChange.bind(this)} disabled/>
                      </div>
                      <div className='form-group col-md-3'>
                        <label>Type:</label>
                        <select className='form-control' value={this.state.cloudType} onChange={this.handleCloudTypeValueChange.bind(this)} disabled >
                          <option defaultValue value='AWS'>AWS</option>
                          <option value='AZURE'>Azure</option>
                        </select>
                      </div>
                    </div>
*/}
                    {this.getAccessKeyFormFields()}

                    <div className='form-row'>
                      <div className='form-group col-md-4'>
                        <label>Your Password:</label>
                        <input type='password' className='form-control' />
                        <span className='form-help-text'>(Used to encrypt access keys so only you can access them)</span>
                      </div>
                      <div className='form-group col-md-8'></div>
                    </div>

                  </form>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-primary' onClick={this.handleSubmit.bind(this)}>Create Cloud</button>
              </div>
            </Modal>
          </div>
         </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {}

export default connect(mapStateToProps, {})(CreateCloudSection)
