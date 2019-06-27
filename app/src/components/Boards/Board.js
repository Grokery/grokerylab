import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

import { getSessionInfo } from 'authentication'
import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'
import { sideNavWidth } from 'config/'

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
          <Link to={'/clouds/' + cloudName + '/boards'} style={{position: 'absolute', right:0, padding:15}}><i className='fa fa-times'></i></Link>
        </div>
        </div>
      )
    }
    return (
      <div className='sidebar-page-content'>
        <div>
          <Link to={'/clouds/'+cloudName+'/flows/board/'+node.nodeId+'?flow=open&activeTab=0'} style={{position: 'absolute', right:55, padding:15}}><i className='fa fa-share-alt fa-fw'></i></Link>
          <Link to={'/clouds/'+cloudName+'/flows/board/'+node.nodeId+'?flow=closed&activeTab=0'} style={{position: 'absolute', right:25, padding:15}}><i className='fa fa-pencil fa-fw'></i></Link>
          <Link to={'/clouds/'+cloudName+'/boards'} style={{position: 'absolute', right:0, padding:15}}><i className='fa fa-times'></i></Link>
          <div style={{paddingTop:'50px'}}>
            <IBoardFrame cloudName={cloudName} boardId={node.nodeId} width={window.innerWidth - sideNavWidth} height={window.innerHeight-107}></IBoardFrame>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  return {
    cloudName: ownProps.match.params.cloudName,
    cloudInfo: sessionInfo.clouds[ownProps.match.params.cloudName],
    node: state.nodes[ownProps.match.params.boardId],
  }
}

export default withRouter(connect(mapStateToProps, {})(Board))
