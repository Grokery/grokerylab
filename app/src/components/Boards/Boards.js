import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'
import { NODETYPE } from 'common'

import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'
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

            {this.getBoardLinks()}

        </div>
      </div>
    )
  }
  getBoardLinks() {
    const { boards, cloudName } = this.props
    return boards.map((board) => {
      return (
        <div key={board.nodeId} style={{float:'left',marginTop:10,marginLeft:10,border:'solid 1px #ddd',padding:5}}>
          <div>
            <a href={'#/clouds/'+cloudName+'/boards/'+board.nodeId}>{board.title}</a>
          </div>
          <IBoardFrame cloudName={cloudName} boardId={board.nodeId} width={430} height={250}></IBoardFrame>
        </div>
      )
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
