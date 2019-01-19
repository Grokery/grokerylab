import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getSessionInfo } from 'authentication'
import CloudSection from './CloudSection/CloudSection'
import CreateEditCloudModel from './CreateEditCloudModel/CreateEditCloudModel'
import './Home.css'

class Home extends Component {
  static propTypes = {
    sessionInfo: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      showCreateModel: false
    }
  }
  getCloudSections() {
    const { clouds } = this.props.sessionInfo
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
          <a id='new-cloud-btn' className='btn' href='#' onClick={this.toggleCreateModal}><i className='fa fa-plus'/></a>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sessionInfo: getSessionInfo(),
  }
}

export default connect(mapStateToProps, {})(Home)
