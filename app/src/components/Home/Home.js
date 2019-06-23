import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { getSessionInfo } from 'authentication'
import CreateEditCloudModel from 'shared/CreateEditCloudModel/CreateEditCloudModel'
import CreateEditUserModel from 'shared/CreateEditUserModel/CreateEditUserModel'
import CloudSection from './CloudSection/CloudSection'
import './Home.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showCloudCreateModal: false,
      showUserCreateModel: false,
    }
  }
  render() {
    return (
      <div id='home-page' className='page-content' >
        <div className='row'>

          <div className='cloud-sections col-sm-8'>
            <h3>Clouds</h3>
            <button id='new-cloud-btn' onClick={() => this.showCloudCreateModal(true)}><i className='fa fa-plus'/></button>
            <CreateEditCloudModel
              key="createnew"
              shown={this.state.showCloudCreateModal}
              showEditModal={this.showCloudCreateModal}
              modalTitle={"Create New Cloud Flow"}
              isCreate={true}
            />
            <hr />
            {this.getCloudSections()}
          </div>

          <div className='col-sm-4'>
            <div className='team-list'>
              <h3>Team</h3>
              <button id='new-user-btn' onClick={() => this.showUserCreateModal(true)}><i className='fa fa-plus'/></button>
              <CreateEditUserModel
                  key="createnewuser"
                  shown={this.state.showUserCreateModel}
                  showEditModal={this.showUserCreateModal}
                  modalTitle={"Create New User"}
                  isCreate={true}
              />
              <hr />
              <ul>
                <li><a href='/'><i className='fa fa-user'/>Donald Duck</a></li>
                <li><a href='/'><i className='fa fa-user'/>Uncle Scrooge</a></li>
                <li><a href='/'><i className='fa fa-user'/>Goofy</a></li>
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
  showCloudCreateModal = (trueFalse) => {
    this.setState({showCloudCreateModal: trueFalse})
  }
  showUserCreateModal = (trueFalse) => {
    this.setState({showUserCreateModel: trueFalse})
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default withRouter(connect(mapStateToProps, {})(Home))
