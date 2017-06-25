import React, { Component } from 'react'
import { connect } from 'react-redux'

class Config extends Component {
  render() {
    return (
      <div className='page-content padded'>
        <h1>Configuration</h1>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(Config)
