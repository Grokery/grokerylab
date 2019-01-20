import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getSessionInfo } from 'authentication'
import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'

class Board extends Component {
  static propTypes = {
    cloudName: PropTypes.string.isRequired,
    cloudInfo: PropTypes.object.isRequired,
    node: PropTypes.object
  }
  render() {
    const { cloudName, node } = this.props
    if (!node) {
      return (
        <div className='sidebar-page-content'>
        <div>
          <a href={'#/clouds/' + cloudName + '/boards'} style={{position: 'absolute', right:0, padding:15}}><i className='fa fa-times'></i></a>
        </div>
        </div>
      )
    }
    return (
      <div className='sidebar-page-content'>
        <div>
          <a href={'#/clouds/'+cloudName+'/flows/board/'+node.nodeId+'?flow=open&activeTab=1'} style={{position: 'absolute', right:55, padding:15}}><i className='fa fa-share-alt fa-fw'></i></a>
          <a href={'#/clouds/'+cloudName+'/flows/board/'+node.nodeId+'?flow=closed&activeTab=2'} style={{position: 'absolute', right:25, padding:15}}><i className='fa fa-pencil fa-fw'></i></a>
          <a href={'#/clouds/'+cloudName+'/boards'} style={{position: 'absolute', right:0, padding:15}}><i className='fa fa-times'></i></a>
          <div style={{paddingTop:'50px'}}>
            <IBoardFrame cloudName={cloudName} boardId={node.nodeId} width={window.innerWidth - 64} height={window.innerHeight-100}></IBoardFrame>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  return {
    cloudName: ownProps.params.cloudName,
    cloudInfo: sessionInfo['clouds'][ownProps.params.cloudName],
    node: state.nodes[ownProps.routeParams.boardId],
  }
}

export default connect(mapStateToProps, {})(Board)
