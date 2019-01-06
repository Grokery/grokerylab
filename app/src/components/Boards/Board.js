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
    console.log("DASHBOARD")
    console.log(this.props)
    return (
      <div className='page-content'>
        <div>
          <h3>Board Title</h3>
          <h5>{routeParams.boardId}</h5>
          <a href={'#/clouds/' + cloudName + '/boards'}><i className='fa fa-times'></i></a>
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
