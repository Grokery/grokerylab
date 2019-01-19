import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { resetErrorMessage } from 'store/actions'

import './App.css'

class App extends Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired
  }
  render() {
    const { children } = this.props
    return (
      <div className='app-wrapper'>
        {/* TODO */}
        {/* {this.renderErrorMessage()} */}
        {children}
      </div>
    )
  }
  handleDismissClick = (e) => {
    const { resetErrorMessage } = this.props
    e.preventDefault()
    resetErrorMessage()
  }
  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }
    return (
      <p>
        <b>{errorMessage}</b>
        {' '}
        <a href="#" onClick={this.handleDismissClick}>
          Dismiss
        </a>
      </p>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.errorMessage,
})

export default connect(mapStateToProps, {
  resetErrorMessage
})(App)
