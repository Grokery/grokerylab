import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Modal.css'

class Modal extends Component {
  static propTypes = {
    shown: PropTypes.bool,
  }
  render() {
    const { shown } = this.props
    return (
      <div className={"modal fade" + (shown ? " in" : "")} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              {this.props.children}
            </div>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(Modal)
