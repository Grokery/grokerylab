import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSelectedCloudId, setBaseUrlForCloudName, setSelectedCloudName } from '../../authentication'
import { fetchNodes, clearNodes, fetchLookupData, fetchCloud } from '../../store/actions'
import SideNavBar from '../../shared/SideNavBar/SideNavBar'

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
    fetchLookupData()
    fetchNodes()
  }
  componentDidMount() {
    const { cloudName, clearNodes, fetchCloud } = this.props
    setSelectedCloudName(cloudName)
    fetchCloud(getSelectedCloudId(), this.setCloudBaseUrlCallBack.bind(this))
    clearNodes()
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
