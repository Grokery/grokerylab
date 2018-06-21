import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setRedirectUrl, isAuthenticated } from 'authentication'
import { history } from 'index'
import TopNavBar from 'shared/TopNavBar/TopNavBar'

class AuthGateway extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.func.isRequired,
    currentURL: PropTypes.string.isRequired,
    setRedirectUrl: PropTypes.func.isRequired,
    cloudName: PropTypes.string
  }
  render() {
    const { isAuthenticated, cloudName, children } = this.props
    if (isAuthenticated()) {
      return (
        <div className='page-content-wrapper'>
          <TopNavBar cloudName={cloudName}></TopNavBar>
          {children}
        </div>
        )
    } else {
      return null
    }
  }
  componentDidMount() {
    const { isAuthenticated, setRedirectUrl, currentURL } = this.props
    if (!isAuthenticated()) {
      setRedirectUrl(currentURL)
      history.push("/signin")
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentURL: ownProps.location.pathname,
    setRedirectUrl: setRedirectUrl,
    isAuthenticated: isAuthenticated,
    cloudName: ownProps.params.cloudName
  }
}

export default connect(mapStateToProps, {})(AuthGateway)
