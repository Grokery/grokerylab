import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Gallery from '../Gallery/Gallery'
import EditModal from '../EditModal/EditModal'
import ContentEditable from '../ContentEditable/ContentEditable'
import './CloudSection.css'

class CloudSection extends Component {
  static propTypes = {
    cloudid: PropTypes.string.isRequired, 
    cloud: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false
      }
  }
  toggleEditDialog(e) {
    e ? e.preventDefault() : null
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
    getCloudIcon(cloud){
    if (cloud.type === 'aws'){
      return 'img/aws.png'
    } else if (cloud.type === 'azure') {
      return 'img/azure.png'
    } else {
      return 'img/local.png'
    }
  }
  getCloudLinks(cloudid, cloud) {
    let links = []
    links.push({
        title: 'Data Flow',
        url: '#/clouds/' + cloudid,
      })
    if (cloud.links) {
      cloud.links.forEach(function(link){
        links.push(link)
      })
    }
    return links
  }
  render() {
    const { cloudid, cloud } = this.props
    return (
      <div className='cloud-section'>
        <div className='cloud-section-header'>
          <a href={'#/clouds/' + cloudid} className='cloud-title'>
            <img src={this.getCloudIcon(cloud)} className='cloud-icon' role="presentation"/>
            {cloud.name}
          </a>
          <a href='#' onClick={this.toggleEditDialog.bind(this)}><i className='fa fa-cog pull-right cloud-edit-icon'/></a>
          <EditModal title="Edit Cloud" shown={this.state.shown} toggleEditDialog={this.toggleEditDialog.bind(this)}>
            <ContentEditable type='pre' value={JSON.stringify(cloud, null, 2)} onChange={function(){}}></ContentEditable>
          </EditModal>
        </div>
        <div className='cloud-section-quicklinks'>
          <Gallery itemSize='medium' colorClass='dark' images={false} items={this.getCloudLinks(cloudid, cloud)} params={{}}></Gallery>
        </div>
        <hr />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(CloudSection)
