import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'

import './Boards.css'

class Boards extends Component {
  static propTypes = {
    cloudName: PropTypes.string.isRequired,
    cloudInfo: PropTypes.object.isRequired
  }
  render() {
    const { cloudName } = this.props
    console.log(this.props)
    return (
      <div className='page-content'>
        <div id='boards-page-content'>
          <ul>
            <li><a href={'#/clouds/'+cloudName+'/boards/1'}>dashboard 1</a></li>
            <li><a href={'#/clouds/'+cloudName+'/boards/2'}>dashboard 2</a></li>
            <li><a href={'#/clouds/'+cloudName+'/boards/3'}>dashboard 3</a></li>
          </ul>
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

export default connect(mapStateToProps, {})(Boards)
