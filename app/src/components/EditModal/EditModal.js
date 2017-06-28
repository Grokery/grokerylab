import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from '../Modal/Modal'
import './EditModal.css'

class EditModal extends Component {
  static propTypes = {
    node: PropTypes.object,
    title: PropTypes.string,
    toggleEditDialog: PropTypes.func.isRequired
  }
  render() {
    return (
      <Modal shown={this.props.shown}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.toggleEditDialog} aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 className="modal-title">{this.props.title}</h4>
        </div>
        <div className="modal-body">
          {this.props.children}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.props.toggleEditDialog}>Close Edit</button>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(EditModal)
