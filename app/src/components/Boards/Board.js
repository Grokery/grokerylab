import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'

import './Board.css'

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
        <div className='page-content'>
        <div>
          <a href={'#/clouds/' + cloudName + '/boards'} style={{position: 'absolute', right:0, padding:15}}><i className='fa fa-times'></i></a>
        </div>
        </div>
      )
    }
    return (
      <div className='page-content'>
        <div>
          <a href={'#/clouds/'+cloudName+'/flows/board/'+node.nodeId+'?flow=open'} style={{position: 'absolute', right:25, padding:15}}><i className='fa fa-share-alt fa-fw'></i></a>
          <a href={'#/clouds/' + cloudName + '/boards'} style={{position: 'absolute', right:0, padding:15}}><i className='fa fa-times'></i></a>
          <div style={{paddingTop:30}}>
            <iframe srcDoc={node.source} style={{width:window.innerWidth - 64, height:window.innerHeight-50, border:'none'}}></iframe>
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
