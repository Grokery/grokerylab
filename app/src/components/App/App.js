import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Route } from 'react-router'

import { setRedirectUrl, isAuthenticated } from 'authentication'
import { resetErrorMessage } from 'store/actions/errors'
import TopNavBar from 'shared/TopNav/TopNavBar'
import Home from 'components/Home/Home'
import Cloud from 'components/Cloud/Cloud'
import UserAccount from 'components/UserAccount/UserAccount'
import './App.css'

class App extends Component {
  static propTypes = {
    resetErrorMessage: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
  }
  componentDidMount() {
    const { location, history } = this.props
    if (!isAuthenticated()) {
      if (location.pathname !== '/signout' && location.pathname !== '/signin') {
        setRedirectUrl(location.pathname + location.search)
      }
      history.push('/signin')
    }
  }
  render() {
    if (!isAuthenticated()) {
      return null
    }
    return (
      <div className='app-wrapper'>
        {this.renderErrorMessage()}
        <TopNavBar />
        <div className='page-content-wrapper'>
          <Route exact path='/' component={Home} />
          <Route path='/account' component={UserAccount} />
          <Route path='/clouds/:cloudName' component={Cloud} />
        </div>
      </div>
    )
  }
  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }
    return (
      <div className='app-message paper'>
        <div style={{height: '30px'}}>
          <h4 className='pull-left'>App Message:</h4>
            <button type="button" className="close" onClick={this.handleDismissClick} aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>
        <div style={{position:'relative'}}>
          <b>{errorMessage}</b>
        </div>
      </div>
    )
  }
  handleDismissClick = (e) => {
    const { resetErrorMessage } = this.props
    e.preventDefault()
    resetErrorMessage()
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
