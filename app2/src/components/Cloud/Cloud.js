import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Route } from 'react-router'

import { getCloudId } from 'authentication'
import { fetchNodes, clearNodes } from 'store/actions/nodes'
import { fetchCloud } from 'store/actions/cloud'
import { fetchOptions } from 'store/actions/options'

import SideNavBar from 'shared/SideNavBar/SideNavBar'
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
  }
  componentDidMount() {
    const { clearNodes, fetchCloud, fetchNodes, fetchOptions, history, match  } = this.props
    let cloudName = match.params.cloudName
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
    const { match } = this.props
    return (
      <div id='cloud-page' className='page-content'>
        <SideNavBar cloudName={match.params.cloudName}></SideNavBar>
        <div className='sidebar-page-wrapper'>
          <Route exact path='/clouds/:cloudName' component={Boards} />
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
  return {}
}

export default withRouter(connect(mapStateToProps, {
  fetchCloud,
  fetchNodes,
  clearNodes,
  fetchOptions,
})(Cloud))
