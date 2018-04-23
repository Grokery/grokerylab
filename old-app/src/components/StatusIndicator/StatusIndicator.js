import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { APPSTATUS } from '../../globals'
import { connect } from 'react-redux'
import './StatusIndicator.css'

class StatusIndicator extends Component {
  static propTypes = {
    appStatus: PropTypes.string.isRequired
  }
  render() {
    const { appStatus } = this.props
    let icon = "check"
    if (appStatus === APPSTATUS.BUSY) {
      icon = "refresh fa-spin"
    } else if (appStatus === APPSTATUS.ERROR) {
      icon = "exclamation-triangle"
    }
    return (
        <li><a><i className={"fa fa-"+icon} aria-hidden="true"></i></a></li>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    appStatus: state.appStatus
  }
}

export default connect(mapStateToProps, {
})(StatusIndicator)
