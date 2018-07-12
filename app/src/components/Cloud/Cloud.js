import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSelectedCloudId, setBaseUrlForCloudName, setSelectedCloudName } from 'authentication'
import { fetchNodes, clearNodes, fetchCloud, fetchOptions } from 'store/actions'
import SideNavBar from 'shared/SideNavBar/SideNavBar'

class Cloud extends Component {
  static propTypes = {
    fetchCloud: PropTypes.func.isRequired,
    cloudName: PropTypes.string.isRequired,
    fetchNodes: PropTypes.func.isRequired,
    clearNodes: PropTypes.func.isRequired,
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
  setCloudBaseUrlCallBack(json) {
    const { cloudName, fetchNodes, fetchOptions } = this.props
    setBaseUrlForCloudName(cloudName, json['url'])
    fetchNodes()
    fetchOptions()
  }
  componentDidMount() {
    const { cloudName, clearNodes, fetchCloud } = this.props
    clearNodes()
    setSelectedCloudName(cloudName)
    fetchCloud(getSelectedCloudId(), this.setCloudBaseUrlCallBack.bind(this))
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
  fetchOptions
})(Cloud)
