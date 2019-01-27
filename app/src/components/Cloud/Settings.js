import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from 'shared/Loader/Loader'

class Settings extends Component {
  constructor(props) {
    super(props)
      this.state = {
          working: false
      }
  }
  render() {
    return (
      <div className='page-content padded'>
        <Loader show={this.state.working} />
        <h1>Users</h1>
        <div><p>add / remove / modify users</p></div>
        <hr />
        <div>
          <h1></h1>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {
})(Settings)
