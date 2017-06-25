import React, { Component } from 'react'
import { connect } from 'react-redux'
import D3DataFlow from '../components/D3DataFlow/D3DataFlow'

class Dataflows extends Component {
  render() {
    const { nodeId } = this.props.params
    return (
      <div className='page-content'>
        <D3DataFlow 
          showControls={true}
          selectedNodeId={nodeId}
          zoomOnHighlight={false}
          singleClickNav={false}
          colored={true}
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
