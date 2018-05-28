import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo, setBaseUrlForCloudName, setSelectedCloudName } from '../authentication'
import { fetchNodes, clearNodes, fetchLookupData, fetchCloud } from '../store/actions'
import SideNavBar from '../shared/SideNavBar/SideNavBar'

class Cloud extends Component {
  static propTypes = {
    fetchCloud: PropTypes.func.isRequired,
    cloudName: PropTypes.string.isRequired,
    fetchNodes: PropTypes.func.isRequired,
    clearNodes: PropTypes.func.isRequired,
    fetchLookupData: PropTypes.func.isRequired
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
    const { cloudName, fetchNodes, fetchLookupData } = this.props
    setBaseUrlForCloudName(cloudName, json['url'])
    fetchNodes()
    fetchLookupData()
  }
  componentDidMount() {
    const { cloudName, clearNodes, fetchCloud } = this.props
    setSelectedCloudName(cloudName)
    clearNodes()
    fetchCloud(
      getSessionInfo()['clouds'][cloudName]['cloudId'], 
      this.setCloudBaseUrlCallBack.bind(this)
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
  fetchLookupData
})(Cloud)
