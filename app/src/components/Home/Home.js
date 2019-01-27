import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { getSessionInfo } from 'authentication'
import CloudSection from './CloudSection/CloudSection'
import CreateEditCloudModel from './CreateEditCloudModel/CreateEditCloudModel'
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
      <div id='home-page' className='page-content'>
        <CreateEditCloudModel 
            key="createnew" 
            shown={this.state.showCreateModel} 
            toggleShown={this.toggleCreateModal} 
            modalTitle={"Create New Cloud"}
            isCreate={true}
          />
        <div className='cloud-sections'>
          {this.getCloudSections()}
        </div>
        <div>
          <button id='new-cloud-btn' className='btn' onClick={this.toggleCreateModal}><i className='fa fa-plus'/></button>
        </div>
      </div>
    )
  }
  getCloudSections() {
    const { clouds } = getSessionInfo()
    let sections = []
    Object.keys(clouds).forEach(function(name) {
      sections.push(
        <CloudSection key={name} cloudid={name} cloud={clouds[name]} />
      )
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
