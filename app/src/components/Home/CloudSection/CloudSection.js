import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Gallery from 'shared/Gallery/Gallery'
import CreateEditCloudModel from '../CreateEditCloudModel/CreateEditCloudModel'
import './CloudSection.css'

class CloudSection extends Component {
  static propTypes = {
    cloudid: PropTypes.string.isRequired,
    cloud: PropTypes.object.isRequired,
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
  getCloudLinks(cloudid, cloud) {
    let links = []
    // let links = [{
    //   url: '/',
    //   title: 'title',
    //   description: 'description',
    // }]
    if (cloud.links) {
      cloud.links.forEach(function(link){
        links.push(link)
      })
    }
    return links
  }
  toggleEditModal = () => {
    this.setState({showEditModel: !this.state.showEditModel})
  }
  render() {
    const { cloudid, cloud } = this.props
    return (
      <div className='cloud-section'>
        <hr />
        <div className='cloud-section-header'>
          <a href={'/clouds/' + cloudid} className='cloud-title'>
            <img src={this.getCloudIcon(cloud.cloudType)} className='cloud-icon' alt='cloud type'/>
            {cloud.title}
          </a>
          <button onClick={this.toggleEditModal} className='cloud-edit-button'><i className='fa fa-cog cloud-edit-icon'/></button>
          <CreateEditCloudModel 
              key="edit-cloud" 
              shown={this.state.showEditModel} 
              toggleShown={this.toggleEditModal} 
              modalTitle={"Edit Cloud"}
              isEdit={true}
              cloudData={cloud}
            />          
        </div>
        <div className='cloud-section-quicklinks'>
          <Gallery itemSize='medium' colorClass='light' images={false} items={this.getCloudLinks(cloudid, cloud)} params={{}}></Gallery>
        </div>
      </div>
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
