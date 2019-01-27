import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

import { NODETYPE } from 'common'
import { getSessionInfo } from 'authentication'

import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'

class Boards extends Component {
  static propTypes = {
    cloudInfo: PropTypes.object.isRequired,
    boards: PropTypes.array.isRequired,
  }
  render() {
    return (
      <div className='sidebar-page-content'>
        {this.getBoardLinks()}
      </div>
    )
  }
  getBoardLinks() {
    const { boards, match } = this.props
    let cloudName = match.params.cloudName
    return boards.sort(this.boardSort).map((board) => {
      return (
        <div key={board.nodeId} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} style={{float:'left',marginTop:10,marginLeft:10,border:'solid 1px #ddd',padding:5}}>
          <div style={{position:'relative'}}>
            <Link to={'/clouds/'+cloudName+'/boards/'+board.nodeId} style={{float:'left'}}>{board.title}</Link>
            <div style={{float:'right'}}>
              {/* <Link to={'/clouds/'+cloudName+'/flows?nodeId='+board.nodeId} style={{float:'right', marginRight:0}}><i className='fa fa-share-alt fa-fw'></i></Link> */}
              {/* <Link to={'/clouds/'+cloudName+'/flows/board/'+board.nodeId+'?flow=closed&activeTab=2'} style={{float:'right', marginRight:10}}><i className='fa fa-pencil fa-fw'></i></Link>   */}
            </div>
          </div>
          <IBoardFrame cloudName={cloudName} boardId={board.nodeId} width={430} height={250}></IBoardFrame>
        </div>
      )
    })
  }
  boardSort = (a, b) => {
    let rank = (b.sortRank || 0) - (a.sortRank || 0)
    if (rank === 0) {
      rank = b.updated.localeCompare(a.updated) 
    }
    return rank
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
    cloudInfo: sessionInfo['clouds'][ownProps.match.params.cloudName],
    boards: boards,
  }
}

export default withRouter(connect(mapStateToProps, {})(Boards))
