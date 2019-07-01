import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

import { headerNavHeight } from 'config'
import { NODETYPE } from 'common'
import { getSessionInfo } from 'authentication'
import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'

class Boards extends Component {
  static propTypes = {
    cloudInfo: PropTypes.object.isRequired,
    boards: PropTypes.array.isRequired,
    urlParams: PropTypes.object,
  }
  constructor(props) {
    super(props)

    this.state = {
      filterValue: '',
    }
  }
  render() {
    let { urlParams, cloudInfo } = this.props
    return (
      <div className='sidebar-page-content clearfix' style={{backgroundColor:'#E1E3E5', minHeight:`${window.innerHeight-headerNavHeight}px`}}>
        <div className='row'>
            <div className='col-md-9' style={{paddingTop:'8px',paddingLeft:'8px',paddingRight:'8px'}}>
                <h2 style={{float:'left'}}>{cloudInfo.cloudInfo.title}</h2>
                <Link to={'/clouds/' + urlParams.cloudName + "/flows"} style={{float:'left',paddingLeft:'10px',paddingTop:'8px'}}>
                    <i className='fa fa-share-alt cloud-edit-icon'/>
                </Link>
            </div>
            <div className='col-md-3' style={{paddingTop:'8px',paddingLeft:'8px',paddingRight:'8px'}}>
              <div className="board-filter" style={{position:'relative',float:'right'}}>
                <input 
                  id='filter-input' 
                  className='filter-input' 
                  onChange={this.onFilterChange} 
                  style={{height:'35px',border:'1px solid #d7d7d7',borderRadius:'4px 4px 4px 4px',width:'240px',paddingLeft:'8px',paddingRight:'26px'}} />
                <i style={{position:'absolute',fontSize:'18px',right:'8px',top:'8px'}} className='fa fa-filter'></i>
              </div>
            </div>
        </div>
        {this.getBoardLinks()}
      </div>
    )
  }
  onFilterChange = (e) => {
    this.setState({ filterValue: e.target.value})
  }
  filterBoards = (board) => {
    const { filterValue } = this.state
    if (board.title.toLowerCase().includes(filterValue.toLowerCase())) {
      return true
    }
      return false 
  }
  getBoardLinks() {
    const { boards, urlParams } = this.props
    let cloudName = urlParams.cloudName
    return boards.filter(this.filterBoards).sort(this.boardSort).map((board) => {
      return (
        <div className='paper' key={board.nodeId} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} style={{float:'left',marginTop:10,marginLeft:10,padding:5, backgroundColor:'white',position:'relative'}}>
          <Link to={'/clouds/'+cloudName+'/boards/'+board.nodeId}>
            <div style={{position:'absolute',top:25,bottom:0,right:0,left:0}}></div>
          </Link>
          <div>
            <Link to={'/clouds/'+cloudName+'/boards/'+board.nodeId} style={{float:'left'}}>{board.title}</Link>
            {/* <Link to={'/clouds/'+cloudName+'/flows?nodeId='+board.nodeId} style={{float:'right'}}><i className='fa fa-share-alt fa-fw'></i></Link> */}
            <Link to={'/clouds/'+cloudName+'/flows/board/'+board.nodeId+'?flow=open&activeTab=0'} style={{float:'right'}}><i className='fa fa-pencil fa-fw'></i></Link>  
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
    urlParams: ownProps.match.params,
    cloudInfo: sessionInfo['clouds'][ownProps.match.params.cloudName],
    boards: boards,
  }
}

export default withRouter(connect(mapStateToProps, {})(Boards))
