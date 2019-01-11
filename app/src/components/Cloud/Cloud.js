import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { history } from 'index'
import { getCloudId } from 'authentication'
import { fetchNodes, clearNodes, fetchCloud, fetchOptions } from 'store/actions'
import SideNavBar from 'shared/SideNavBar/SideNavBar'

class Cloud extends Component {
  static propTypes = {
    fetchCloud: PropTypes.func.isRequired,
    cloudName: PropTypes.string.isRequired,
    fetchNodes: PropTypes.func.isRequired,
    clearNodes: PropTypes.func.isRequired,
  }
  componentDidMount() {
    const { cloudName, clearNodes, fetchCloud, fetchNodes, fetchOptions  } = this.props
    clearNodes()
    if (cloudName && getCloudId(cloudName)) {
      fetchCloud(cloudName)
      fetchOptions(cloudName)
      fetchNodes(cloudName)
    } else {
      alert("cloud name " + cloudName + " not recognized")
      history.push("/")
    }
  }
  render() {
    const { cloudName } = this.props
    return (
      <div>
        <SideNavBar cloudName={cloudName}></SideNavBar>
        <div className='sidebar-page'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cloudName: ownProps.params.cloudName
  }
}

export default connect(mapStateToProps, {
  fetchCloud,
  fetchNodes,
  clearNodes,
  fetchOptions,
})(Cloud)
