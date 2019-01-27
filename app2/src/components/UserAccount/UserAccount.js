import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getSessionInfo } from 'authentication'
import { connect } from 'react-redux'

class Account extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    clouds: PropTypes.object.isRequired
  }
  render() {
    const { username } = this.props
    return (
      <div id='user-account-page' className='page-content'>
        <h1>Account</h1>
        <p>{username}</p>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  return {
    username: sessionInfo['username'],
    clouds: sessionInfo['clouds']
  }
}

export default connect(mapStateToProps, {})(Account)
