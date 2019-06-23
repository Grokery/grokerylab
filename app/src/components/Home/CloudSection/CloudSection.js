import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Gallery from 'shared/Gallery/Gallery'
import CreateEditCloudModel from 'shared/CreateEditCloudModel/CreateEditCloudModel'
import './CloudSection.css'

class CloudSection extends Component {
  static propTypes = {
    cloudid: PropTypes.string.isRequired,
    cloudAccess: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
      this.state = {
        showEditModel: false
      }
  }
  getCloudIcon(cloudType) {
    if (cloudType === 'AWS') {
      return 'img/aws.png'
    } else if (cloudType === 'AZURE') {
      return 'img/azure.png'
    } else {
      return 'img/custom.png'
    }
  }
  getCloudLinks(cloudid, cloudAccess) {
    let links = []
    // let links = [{
    //   url: '/',
    //   title: 'title',
    //   description: 'description',
    // }]
    // if (cloudAccess.links) {
    //   cloudAccess.links.forEach(function(link){
    //     links.push(link)
    //   })
    // }
    return links
  }
  showEditModal = (trueFalse) => {
    this.setState({showEditModel: trueFalse})
  }
  render() {
    const { cloudid, cloudAccess } = this.props
    return (
      <div className='cloud-section'>
        <div className='cloud-section-header'>
          <Link to={'/clouds/' + cloudid} className='cloud-title'>
            <img src={'/'+this.getCloudIcon(cloudAccess.cloudInfo.cloudType)} className='cloud-icon' alt='cloud type'/>
            {cloudAccess.cloudInfo.title}
          </Link>
          {/* <label style={{paddingLeft:'10px'}}>{cloudAccess.cloudInfo.url}</label> */}
          <button onClick={() => this.showEditModal(true)} className='cloud-edit-button'><i className='fa fa-cog cloud-edit-icon'/></button>
          {/* {this.getCloudStatusIcon(cloudAccess.cloudInfo.status)} */}
          <CreateEditCloudModel
              key="edit-cloud"
              shown={this.state.showEditModel}
              showEditModal={this.showEditModal}
              modalTitle={"Edit Cloud"}
              isEdit={true}
              cloudInfo={cloudAccess.cloudInfo}
            />
        </div>
        <div className='cloud-section-quicklinks'>
          <Gallery itemSize='medium' colorClass='light' images={false} items={this.getCloudLinks(cloudid, cloudAccess)} params={{}}></Gallery>
        </div>
      </div>
    )
  }
  getCloudStatusIcon() {
    return (
      <button onClick={() => this.showEditModal(true)} className='cloud-edit-button'><i style={{color:'green'}} className='fa fa-check cloud-edit-icon'/></button>
    )
  }
  updateCloud(newValue) {
    if (this.debounce){
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(function() {
      // this.props.onUpdate(newValue)
      let self = this
      return self
    }.bind(this), 1000);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(CloudSection)
