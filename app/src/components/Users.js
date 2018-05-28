import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Users extends Component {
  static propTypes = {
    users: PropTypes.array,
  }
  render() {
    const { users } = this.props
    var links = []
    if (users.length !== 0) {
      links = users.map(function(user, index) {
          return (
            <li key={index}>
              <a href={'#/profiles/'+user.username}>{user.name}</a>
              <a href=""><i className="fa fa-pencil"></i></a>
            </li>
          )
      })
    }
    return (
      <div className='page-content padded'>
        <h1>Users</h1>
        <ul>
          {links}
        </ul>
        <button><i className="fa fa-plus"></i></button>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state)
  console.log(ownProps)
  var users = []
  if (state.cloud != null) {
    users = state.cloud.users
  }
  return {
    users: users
  }
}

export default connect(mapStateToProps, {})(Users)
