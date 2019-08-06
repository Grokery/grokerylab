import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

import { APPSTATUS, updateQueryParam } from "common"
import { headerNavHeight, sideNavWidth } from 'constants.js'
import Loader from 'shared/Loader/Loader'
import D3DataFlow from 'shared/D3DataFlow/D3DataFlow'

class Dataflows extends Component {
  static propsTypes = {
    urlParams: PropTypes.object,
    queryParams: PropTypes.object,
  }
  render() {
    const { queryParams, urlParams } = this.props
    return (
      <div className='sidebar-page-content'>
        <Loader show={this.props.appStatus === APPSTATUS.BUSY} />
        <D3DataFlow
          params={urlParams}
          showControls={true}
          selectedNodeId={queryParams.nodeId}
          filterText={queryParams.filterText}
          zoomOnHighlight={false}
          singleClickNav={false}
          colored={false}
          nodeShape={2}
          query={{}}
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
    appStatus: state.appStatus,
    urlParams: ownProps.match.params,
    queryParams: queryString.parse(ownProps.location.search),
  }
}

export default withRouter(connect(mapStateToProps, {
})(Dataflows))
