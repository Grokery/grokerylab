import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
// import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { createUser } from 'store/actions/users'
import Modal from 'shared/Modal/Modal'
import Loader from 'shared/Loader/Loader'

let defaultData = {
  accountRole: 'USER',
  username: '',
  name: '',
  password: '',
}

class CreateEditUserModel extends Component {
  static propTypes = {
    shown: PropTypes.bool.isRequired,
    createUser: PropTypes.func.isRequired,
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
  onAccountRoleChange = (event) => {
    this.mergeState({data: {accountRole: event.target.value}})
  }
  onUserNameChange = (event) => {
    this.mergeState({data: {username: event.target.value}})
  }
  onNameChange = (event) => {
    this.mergeState({data: {name: event.target.value}})
  }
  onPasswordChange = (event) => {
    this.mergeState({data: {password: event.target.value}})
  }
  onSubmit = (event) => {
    event.preventDefault()
    this.setState({working: true})
    if (this.props.isCreate) {
      let { createUser } = this.props
      createUser(this.state.data, (json, response) => {
        this.setState({
          working: false,
          data: _.cloneDeep(defaultData)
        })
        if (response.ok && json) {
          this.closeEditModal()
          alert('success')
        }
      })
    } else if (this.props.isEdit) {
      console.log('edit')
      console.log(this.state.data)
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
  getForm() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className='row'>
          <div className='col col-md-6'>
            <label>Name:</label>
            <input type='name' className='form-control' value={this.state.data.name} onChange={this.onNameChange}/>
          </div>
          <div className='col col-md-6'>
            <label>Role:</label>
            <select className='form-control' value={this.state.data.accountRole} onChange={this.onAccountRoleChange}>
              <option value='ADMIN'>Admin</option>
              <option value='USER'>User</option>
            </select>
          </div>
        </div>
        <div className='row' style={{paddingTop:'10px'}}>
          <div className='col col-md-6'>
            <label>Email:</label>
            <input type='email' className='form-control' value={this.state.data.username} onChange={this.onUserNameChange}/>
          </div>
          <div className='col col-md-6'>
            <label>Password:</label>
            <input type='password' className='form-control' value={this.state.data.password} onChange={this.onPasswordChange}/>
          </div>
        </div>
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
              <div className='modal-body' style={{padding:'15px'}}>
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
  createUser,
  // updateCloud,
  // deleteCloud,
})(CreateEditUserModel)
