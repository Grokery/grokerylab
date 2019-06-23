import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
// import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

// import { addNewCloudToSession, updateuserInfoInSession, removeCloudFromSession } from 'authentication'
// import { createCloud, updateCloud, deleteCloud } from 'store/actions/cloud'
// import { GROKERY_API_BASE_URL } from 'config'
// import { history } from 'index'
import Modal from 'shared/Modal/Modal'
import Loader from 'shared/Loader/Loader'
import './CreateEditUserModel.css'

let defaultData = {
  userName: '',
  name: '',
  password: '',
}

class CreateEditUserModel extends Component {
  static propTypes = {
    shown: PropTypes.bool.isRequired,
    // createCloud: PropTypes.func.isRequired,
    // updateCloud: PropTypes.func.isRequired,
    // deleteCloud: PropTypes.func.isRequired,
    modalTitle: PropTypes.string,
    isCreate: PropTypes.bool,
    isEdit: PropTypes.bool,
    userInfo: PropTypes.object,
    showEditModal: PropTypes.func,
  }
  constructor(props) {
    super(props)
      this.state = {
          working: false,
          data: _.defaultsDeep({}, this.props.userInfo, defaultData)
      }
  }
  mergeState(newState) {
    this.setState(_.merge(this.state, newState))
  }
  onNameChange(event) {
    this.mergeState({data: {name: event.target.value}})
  }
  onPasswordChange(event) {
    this.mergeState({data: {password: event.target.value}})
  }
  onSubmit = (event) => {
    event.preventDefault()
    this.setState({working: true})
    if (this.props.isCreate) {
      // let { createCloud, addNewCloudToSession } = this.props
      // createCloud(this.state.data, (json, response) => {
      //   this.setState({
      //     working: false,
      //     data: _.cloneDeep(defaultData)
      //   })
      //   if (response.ok && json) {
      //     addNewCloudToSession(json)
      //   }
        // history.replace("/")
      // })
    } else if (this.props.isEdit) {
      // let { updateCloud } = this.props
      // updateCloud(this.props.userInfo.name, this.state.data, (json, response) => {
      //   this.setState({
      //     working: false,
      //   })
      //   if (response.ok && json) {
      //     updateuserInfoInSession(json)
      //   }
      //   history.replace("/")
      // })
    }

  }
  closeEditModal = () => {
    this.setState(_.cloneDeep(defaultData))
    this.props.showEditModal(false)
  }
  getPasswordFormField() {
    return (
      <div className='row'>
        <div className='col col-sm-5'>
          <label>Your Password:</label>
          <input type='password' className='form-control' value={this.state.data.password} onChange={this.onPasswordChange.bind(this)}/>
        </div>
        <div className='col col-md-8'></div>
      </div>
    )
  }
  getForm() {
    return (
      <form onSubmit={this.onSubmit}>

      </form>
    )
  }
  render() {
    return (
        <div id='CreateEditUserModel' key='add-user'>
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
  return {}
}

export default connect(mapStateToProps, {
  // createCloud,
  // updateCloud,
  // deleteCloud,
})(CreateEditUserModel)
