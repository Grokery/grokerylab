import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Gallery from '../Gallery/Gallery'
import Modal from '../Modal/Modal'
import CodeEditor from '../CodeEditor/CodeEditor'
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
    if (e) {e.preventDefault()}
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
    let options = {
      lineNumbers: false,
      dragDrop: false,
      mode: {name: "javascript"}
    }
    let value = this.state.shown ? JSON.stringify(cloud, null, 2) : ""
    return (
      <div className='cloud-section'>
        <div className='cloud-section-header'>
          <a href={'#/clouds/' + cloudid} className='cloud-title'>
            <img src={this.getCloudIcon(cloud)} className='cloud-icon' role="presentation"/>
            {cloud.name}
          </a>
          <a href='#' onClick={this.toggleEditDialog.bind(this)}><i className='fa fa-cog pull-right cloud-edit-icon'/></a>
          <Modal shown={this.state.shown}>
            <div className="modal-header">
              <button type="button" className="close" onClick={this.toggleEditDialog.bind(this)} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Edit Cloud</h4>
            </div>
            <div className="modal-body">
                <CodeEditor value={value} options={options} onChange={this.updateCloud.bind(this)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.toggleEditDialog.bind(this)}>Close Edit</button>
            </div>
          </Modal>
        </div>
        <div className='cloud-section-quicklinks'>
          {/* <Gallery itemSize='medium' colorClass='dark' images={false} items={this.getCloudLinks(cloudid, cloud)} params={{}}></Gallery> */}
        </div>
        <hr />
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
