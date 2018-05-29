import React, { Component } from 'react'
import { connect } from 'react-redux'
import D3DataFlow from '../../shared/D3DataFlow/D3DataFlow'

class Dataflows extends Component {
  render() {
    const { params, location } = this.props
    return (
      <div className='page-content'>
        <D3DataFlow 
          showControls={true}
          selectedNodeId={params.nodeId}
          zoomOnHighlight={false}
          singleClickNav={false}
          colored={true}
          nodeShape={2}
          query={location.query}
        ></D3DataFlow>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, {
})(Dataflows)
