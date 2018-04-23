import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setRedirectUrl, isAuthenticated, setSessionInfo } from '../authentication'
import { history } from '../index.js'
import TopNavBar from '../components/TopNavBar/TopNavBar'
import { AUTH_ENABLED, DEFAULT_SESSION_INFO } from "../globals.js"

class AuthGateway extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.func.isRequired,
    currentURL: PropTypes.string.isRequired,
    setRedirectUrl: PropTypes.func.isRequired,
    setSessionInfo: PropTypes.func.isRequired
  }
  render() {
    const { isAuthenticated, children } = this.props
    if (isAuthenticated() || !AUTH_ENABLED) {
      return (
        <div className='page-content-wrapper'>
          <TopNavBar></TopNavBar>
          {children}
        </div>
        )
    } else {
      return null
    }
  }
  componentDidMount() {
    const { isAuthenticated, setRedirectUrl, currentURL, setSessionInfo } = this.props
    if (AUTH_ENABLED) {
      if (!isAuthenticated()) {
        setRedirectUrl(currentURL)
        history.push("/signin")
      }
    } else {
      if (!isAuthenticated()) {
        setSessionInfo(DEFAULT_SESSION_INFO)
      }
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentURL: ownProps.location.pathname,
    setRedirectUrl: setRedirectUrl,
    isAuthenticated: isAuthenticated,
    setSessionInfo: setSessionInfo
  }
}

export default connect(mapStateToProps, {

})(AuthGateway)
