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
        <div className='col-sm-3'>
          <div style={{marginTop:'15px', marginLeft:'15px'}}>
            <h2 className='' style={{padding:'15px', paddingTop:'5px'}}>Teams</h2>
            <ul>
              <li><a href='/'>team 1</a></li>
              {/* <li><a href='/'>team 2</a></li>
              <li><a href='/'>team 3</a></li> */}
            </ul>
          </div>
        </div>
        <div className='cloud-sections col-sm-9' style={{minHeight:window.innerHeight - 50}}>
            <h2 className='pull-left' style={{padding:'15px', paddingTop:'5px'}}>Clouds</h2>
            {/* <button id='new-cloud-btn' className='btn' onClick={this.toggleCreateModal}><i className='fa fa-plus'/></button>
            <CreateEditCloudModel 
              key="createnew" 
              shown={this.state.showCreateModel} 
              toggleShown={this.toggleCreateModal} 
              modalTitle={"Create New Cloud"}
              isCreate={true}
            /> */}
            {this.getCloudSections()}
        </div>
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
