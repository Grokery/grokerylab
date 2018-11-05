import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'
import CloudSection from './CloudSection/CloudSection'
import CreateEditCloudModel from './CreateEditCloudModel/CreateEditCloudModel'
import './Home.css'

class Home extends Component {
  static propTypes = {
    username: PropTypes.string,
    clouds: PropTypes.object
  }
  constructor(props) {
    super(props)
      this.state = {
        showCreateModel: false
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
  toggleCreateModal = () => {
    this.setState({showCreateModel: !this.state.showCreateModel})
  }
  render() {
    let { username } = this.props
    return (
      <div id='Home' className='page-content home'>
        <div className='user-section'>
          {<h1>Hi {username}</h1>}
        </div>
        <div className='pull-right'>
          <a id='new-cloud-btn' className='btn' href='#' onClick={this.toggleCreateModal}><i className='fa fa-plus'/></a>
        </div>
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
