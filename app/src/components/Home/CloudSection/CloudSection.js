import React, { Component } from 'react'
import { cloneDeep } from 'lodash'
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
    showCloudLinks: PropTypes.bool,
  }
  constructor(props) {
    super(props)
      this.state = {
        showEditModel: false
      }
  }
  getCloudLinks(cloudid, cloudAccess) {
    const { showCloudLinks } = this.props
    let links = []
    if (showCloudLinks && cloudAccess.links && cloudAccess.links.length) {
      cloudAccess.links.forEach((link) => {
        link = cloneDeep(link)
        link.url = '/clouds/' + cloudid + (link.url.slice(0,1) === '/' ? '' : '/') + link.url
        links.push(link)
      })
    }
    return links
  }
  showEditModal = (trueFalse) => {
    this.setState({showEditModel: trueFalse})
  }
  render() {
    const { cloudid, cloudAccess, showCloudLinks } = this.props
    return (
      <div className='cloud-section'>
        <div className='cloud-section-header'>
          <Link to={'/clouds/' + cloudid} className='cloud-title'>
            <img src={'/img/custom.png'} className='cloud-icon' alt='cloud type'/>
            {cloudAccess.cloudInfo.title}
          </Link>
          <button onClick={() => this.showEditModal(true)} className='cloud-button float-right'><i className='fa fa-cog cloud-edit-icon'/></button>
          {showCloudLinks ? null :
            <>
              <Link to={'/clouds/' + cloudid + "/flows"} className='cloud-button'><i className='fa fa-share-alt cloud-edit-icon'/></Link>
              <Link to={'/clouds/' + cloudid + "/boards"} className='cloud-button'><i className='fa fa-tachometer cloud-edit-icon'/></Link>
            </>
          }
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
          <Gallery itemSize='medium' colorClass='light' iframes={true} items={this.getCloudLinks(cloudid, cloudAccess)} params={{}}></Gallery>
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
