import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../../authentication'

class CloudHome extends Component {
  static propTypes = {
    cloudName: PropTypes.string.isRequired,
    cloudInfo: PropTypes.object.isRequired
  }
  render() {
    const { cloudInfo } = this.props
    return (
      <div className='page-content padded sidebar-page'>
        <h1>{cloudInfo.name}</h1>
        <p>counts badges (sources, jobs, users)</p>
        {/* <p>alerts/messages</p> */}
        <p>activity log</p>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  return {
    cloudName: ownProps.params.cloudName,
    cloudInfo: sessionInfo['clouds'][ownProps.params.cloudName]
  }
}

export default connect(mapStateToProps, {})(CloudHome)
