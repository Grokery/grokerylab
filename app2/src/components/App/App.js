import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { setRedirectUrl, isAuthenticated } from 'authentication'
import { resetErrorMessage } from 'store/actions/errors'
import TopNavBar from 'shared/TopNav/TopNavBar'

import './App.css'

class App extends Component {
  static propTypes = {
    resetErrorMessage: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
  }
  componentDidMount() {
    const { location, history } = this.props
    if (!isAuthenticated()) {
      if (location.pathname !== '/signout')
      setRedirectUrl(location.pathname)
      history.push('/signin')
    }
  }
  render() {
    const { children } = this.props
    if (!isAuthenticated()) {
      return null
    }
    return (
      <div className='app-wrapper'>
        {this.renderErrorMessage()}
        <TopNavBar />
        <div className='page-content-wrapper'>
          <div>app</div>
          {children}
        </div>
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
        <button onClick={this.handleDismissClick}>
          Dismiss
        </button>
      </p>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
   return {
     errorMessage: state.errorMessage,
    }
}

export default withRouter(connect(mapStateToProps, {
  resetErrorMessage
})(App))
