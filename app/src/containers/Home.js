import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../authentication'
import CloudSection from '../components/CloudSection/CloudSection'
import '../styles/Home.css'

class Home extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    clouds: PropTypes.object.isRequired
  }
  getCloudSections() {
    const { clouds } = this.props
    let sections = []
    Object.keys(clouds).forEach(function(cloudid) {
      let cloud = clouds[cloudid]
      sections.push(   
        <CloudSection key={cloudid} cloudid={cloudid} cloud={cloud}></CloudSection>
      )
    })
    return sections
  }
  render() {
    let { username } = this.props
    if (!username) {
      username = ""
    }
    return (
      <div className='page-content home'>
        <div>
          <h1>Your Clouds:</h1>
          <div className='cloud-sections'>
            {this.getCloudSections()}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  console.log(sessionInfo)
  if (!sessionInfo) {
    sessionInfo = {
      username: "",
      clouds:{}
    }
  }
  return {
    username: sessionInfo['username'],
    clouds: sessionInfo['clouds']
  }
}

export default connect(mapStateToProps, {})(Home)
