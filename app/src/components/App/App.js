import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { resetErrorMessage } from '../../store/actions'
import './App.css'

class App extends Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired
  }
  render() {
    const { children } = this.props
    return (
      <div>
        <div>
          {/*{this.renderErrorMessage()}*/}
          {children}
        </div>
      </div>
    )
  }
  handleDismissClick = e => {
    this.props.resetErrorMessage()
    e.preventDefault()
  }
  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }
    return (
      <p style={{ backgroundColor: '#e99', padding: 10}}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
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
