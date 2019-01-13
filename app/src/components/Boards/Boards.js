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
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
    }
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
    const { hover } = this.state
    let visibility = hover ? 'visible' : 'hidden'
    return boards.sort(this.boardSort).map((board) => {
      return (
        <div key={board.nodeId} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} style={{float:'left',marginTop:10,marginLeft:10,border:'solid 1px #ddd',padding:5}}>
          <div style={{position:'relative'}}>
            <a href={'#/clouds/'+cloudName+'/boards/'+board.nodeId} style={{float:'left'}}>{board.title}</a>
            <div style={{float:'right', visibility:visibility}}>
              <a href={'#/clouds/'+cloudName+'/flows?nodeId='+board.nodeId} style={{float:'right', marginRight:0}}><i className='fa fa-share-alt fa-fw'></i></a>
              <a href={'#/clouds/'+cloudName+'/flows/board/'+board.nodeId+'?flow=closed&activeTab=2'} style={{float:'right', marginRight:10}}><i className='fa fa-pencil fa-fw'></i></a>  
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
  onMouseOver = (e) => {
    this.setState({hover:true})
  }
  onMouseOut = (e) => {
    this.setState({hover:false})
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
