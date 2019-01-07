import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'
import { NODETYPE } from 'common'

import './Boards.css'

class Boards extends Component {
  static propTypes = {
    cloudName: PropTypes.string.isRequired,
    cloudInfo: PropTypes.object.isRequired,
    boards: PropTypes.array.isRequired,
  }
  render() {
    return (
      <div className='page-content'>
        <div id='boards-page-content'>
          <ul>
            {this.getBoardLinks()}
          </ul>
        </div>
      </div>
    )
  }
  getBoardLinks() {
    const { boards, cloudName } = this.props
    return boards.map((board) => {
      return (<li key={board.nodeId}><a href={'#/clouds/'+cloudName+'/boards/'+board.nodeId}>{board.title}</a></li>)
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  let boards = []
  for (var entry of Object.entries(state.nodes)) {
    let value = entry[1]
    if (value['nodeType'] === NODETYPE.BOARD) {
      boards.push(value)
    }
  }
  return {
    cloudName: ownProps.params.cloudName,
    cloudInfo: sessionInfo['clouds'][ownProps.params.cloudName],
    boards: boards,
  }
}

export default connect(mapStateToProps, {})(Boards)
