import React, { Component } from 'react'
import { connect } from 'react-redux'

class Settings extends Component {
  render() {
    return (
      <div className='page-content padded'>
        <h1>Settings</h1>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(Settings)
