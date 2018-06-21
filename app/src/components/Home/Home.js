import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'
import CloudSection from 'shared/CloudSection/CloudSection'
import CreateCloudModel from './CreateCloudModel'
import './Home.css'

class Home extends Component {
  static propTypes = {
    username: PropTypes.string,
    clouds: PropTypes.object
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false
      }
  }
  getCloudSections() {
    const { clouds } = this.props
    let sections = []
    Object.keys(clouds).forEach(function(name) {
      sections.push(
        <CloudSection key={name} cloudid={name} cloud={clouds[name]} />
      )
    })
    return sections
  }
  render() {
    let { username } = this.props
    return (
      <div id='Home' className='page-content home'>
        <div className='user-section'>
          {<h1>Hi {username}</h1>}
        </div>
        <CreateCloudModel key="createnew" />
        <div className='cloud-sections'>
          {this.getCloudSections()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  if (!sessionInfo) {
    sessionInfo = {
      username: "",
      clouds:{}
    }
  }
  return {
    username: sessionInfo['name'],
    clouds: sessionInfo['clouds']
  }
}

export default connect(mapStateToProps, {})(Home)
