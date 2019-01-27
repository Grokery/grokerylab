import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Modal.css'

export default class Modal extends Component {
  static propTypes = {
    shown: PropTypes.bool.isRequired
  }
  render() {
    const { shown } = this.props
    return (
      <div id={this.props.id} className={"modal fade" + (shown ? " in" : "")} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              {this.props.children}
            </div>
          </div>
      </div>
    )
  }
}
