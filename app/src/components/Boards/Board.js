import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'

import './Board.css'

class Board extends Component {
  static propTypes = {
    cloudName: PropTypes.string.isRequired,
    cloudInfo: PropTypes.object.isRequired
  }
  render() {
    const { cloudName, routeParams } = this.props
    const url = routeParams.boardId === '2' ? "/hello.html" : null
    return (
      <div className='page-content'>
        <div>
          <a href={'#/clouds/'+cloudName+'/flows?nodeId=9f5e8a26-9a96-474e-b2a5-53d398d3c032'} style={{position: 'absolute', right:25, padding:15}}><i className='fa fa-share-alt fa-fw'></i></a>
          <a href={'#/clouds/' + cloudName + '/boards'} style={{position: 'absolute', right:0, padding:15}}><i className='fa fa-times'></i></a>

          <iframe src={url} style={{width:window.innerWidth - 64, height:window.innerHeight-50, border:'none'}}></iframe>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  return {
    cloudName: ownProps.params.cloudName,
    cloudInfo: sessionInfo['clouds'][ownProps.params.cloudName]
  }
}

export default connect(mapStateToProps, {})(Board)
