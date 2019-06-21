import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { getSessionInfo } from 'authentication'
import CloudSection from './CloudSection/CloudSection'
import './Home.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showCreateModel: false
    }
  }
  render() {
    return (
      <div id='home-page' className='page-content' >
      <div className='row'>

        <div className='cloud-sections col-sm-8' style={{minHeight:window.innerHeight - 50}}>
            <h2 style={{padding:'15px', paddingTop:'5px'}}>Clouds</h2>
            {this.getCloudSections()}
        </div>

        <div className='col-sm-4'>
          <div style={{marginTop:'15px', marginLeft:'15px'}}>
            <h2 style={{padding:'15px', paddingTop:'5px'}}>Users</h2>
            <ul>
              <li><a href='/'>user 1</a></li>
            </ul>
          </div>
        </div>

      </div>
      </div>
    )
  }
  getCloudSections() {
    const { clouds } = getSessionInfo()
    let apis = {}
    let sections = []
    Object.keys(clouds).forEach(function(name) {
      if (apis[clouds[name].cloudInfo.url] && apis[clouds[name].cloudInfo.url].length) {
        apis[clouds[name].cloudInfo.url].push(clouds[name])
      } else {
        apis[clouds[name].cloudInfo.url] = [clouds[name]]
      }
    })
    Object.keys(apis).forEach(function(url) {
      if (Object.keys(apis).length > 1) {
        sections.push(<label style={{padding:'15px'}} key={url}>{url}</label>)
      }
      apis[url].forEach((cloud) => {
        sections.push(
          <CloudSection key={cloud.cloudInfo.name} cloudid={cloud.cloudInfo.name} cloudAccess={cloud} />
        )
      })
    })

    return sections
  }
  toggleCreateModal = () => {
    this.setState({showCreateModel: !this.state.showCreateModel})
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default withRouter(connect(mapStateToProps, {})(Home))
