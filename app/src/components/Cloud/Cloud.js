import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Route } from 'react-router'
import queryString from 'query-string'

import { getCloudId } from 'authentication'
import { fetchNodes, clearNodes } from 'store/actions/nodes'
import { fetchCloud } from 'store/actions/cloud'
import { fetchOptions } from 'store/actions/options'
// import SideNavBar from 'shared/SideNavBar/SideNavBar'
import Boards from 'components/Boards/Boards'
import Board from 'components/Boards/Board'
import Dataflows from 'components/Dataflows/Dataflows'
import NodeDetails from 'components/NodeDetails/NodeDetails'
import Users from 'components/Cloud/Users'

class Cloud extends Component {
  static propTypes = {
    fetchCloud: PropTypes.func.isRequired,
    fetchNodes: PropTypes.func.isRequired,
    clearNodes: PropTypes.func.isRequired,
    urlParams: PropTypes.object,
    queryParams: PropTypes.object,
  }
  componentDidMount() {
    const { clearNodes, fetchCloud, fetchNodes, fetchOptions, history, urlParams  } = this.props
    let cloudName = urlParams.cloudName
    clearNodes()
    if (cloudName && getCloudId(cloudName)) {
      fetchCloud(cloudName)
      fetchOptions(cloudName)
      fetchNodes(cloudName)
    } else {
      console.error("cloud name " + cloudName + " not recognized")
      history.push("/")
    }
  }
  render() {
    const { urlParams } = this.props
    let cloudName = urlParams.cloudName
    if (!cloudName || !getCloudId(cloudName)) {
      return null
    }
    return (
      <div id='cloud-page' className='page-content'>
        {/* <SideNavBar cloudName={cloudName} /> */}
        <div className='sidebar-page-wrapper'>
          <Route exact path='/clouds/:cloudName' component={Dataflows} />
          <Route exact path='/clouds/:cloudName/boards' component={Boards} />
          <Route exact path='/clouds/:cloudName/boards/:boardId' component={Board} />
          <Route exact path='/clouds/:cloudName/flows' component={Dataflows} />
          <Route exact path='/clouds/:cloudName/flows/:nodeType/:nodeId' component={NodeDetails} />
          <Route exact path='/clouds/:cloudName/users' component={Users} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    urlParams: ownProps.match.params,
    queryParams: queryString.parse(ownProps.location.search),
  }
}

export default withRouter(connect(mapStateToProps, {
  fetchCloud,
  fetchNodes,
  clearNodes,
  fetchOptions,
})(Cloud))
