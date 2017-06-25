import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../authentication'

class CloudHome extends Component {
  static propTypes = {
    cloudId: PropTypes.string.isRequired,
    cloudInfo: PropTypes.object.isRequired
  }
  render() {
    const { cloudInfo } = this.props
    return (
      <div className='page-content padded'>
        <h1>{cloudInfo.name}</h1>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  return {
    cloudId: ownProps.params.cloudId,
    cloudInfo: sessionInfo['clouds'][ownProps.params.cloudId]
  }
}

export default connect(mapStateToProps, {})(CloudHome)
