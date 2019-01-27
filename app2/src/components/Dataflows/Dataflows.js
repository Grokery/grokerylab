import React, { Component } from 'react'
import { connect } from 'react-redux'
import { APPSTATUS } from "common"
import { headerNavHeight, sideNavWidth } from 'config'
import Loader from 'shared/Loader/Loader'
import D3DataFlow from 'shared/D3DataFlow/D3DataFlow'

class Dataflows extends Component {
  render() {
    const { location, params } = this.props
    return (
      <div className='sidebar-page-content'>
        <Loader show={this.props.appStatus === APPSTATUS.BUSY} />
        <D3DataFlow
          params={params}
          showControls={true}
          selectedNodeId={location.query.nodeId}
          zoomOnHighlight={false}
          singleClickNav={false}
          colored={false}
          nodeShape={2}
          query={location.query}
          height={window.innerHeight - headerNavHeight}
          width={window.innerWidth - sideNavWidth}
        ></D3DataFlow>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    appStatus: state.appStatus
  }
}

export default connect(mapStateToProps, {
})(Dataflows)
