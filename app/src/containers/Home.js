import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../authentication'
import CloudSection from '../components/CloudSection/CloudSection'
import Modal from '../components/Modal/Modal'
import ContentEditable from '../components/ContentEditable/ContentEditable'
import '../styles/Home.css'

class Home extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    clouds: PropTypes.object.isRequired
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
  getCloudSections() {
    const { clouds } = this.props
    let sections = []
    Object.keys(clouds).forEach(function(cloudid) {
      let cloud = clouds[cloudid]
      sections.push(   
        <CloudSection key={cloudid} cloudid={cloudid} cloud={cloud}></CloudSection>
      )
    })
    let newCloudDef = {
      "name": "Hello World",
      "id": "helloworld",
      "type": "local",
      "url": "http://localhost:5000/dev"
    }
    sections.push(
        <div key={Math.random()}>   
          <div className='cloud-section'>
            <a className='btn new-cloud-button' href='#' onClick={this.toggleEditDialog.bind(this)}><i className='fa fa-plus'/></a>
            <Modal shown={this.state.shown}>
              <div className="modal-header">
                <button type="button" className="close" onClick={this.toggleEditDialog.bind(this)} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Add Cloud</h4>
              </div>
              <div className="modal-body">
                  <ContentEditable type='pre' value={JSON.stringify(newCloudDef, null, 2)} onChange={function(){}}></ContentEditable>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.toggleEditDialog.bind(this)}>Save</button>
              </div>
            </Modal>
          </div>
         </div>
    )
    return sections
  }
  render() {
    let { username } = this.props
    if (!username) {
      username = ""
    }
    return (
      <div className='page-content home'>
        <div>
          <div className='user-section'>
            <h1>Hi {username.split('@')[0]}</h1>
          </div>
          <div className='cloud-sections'>
            {this.getCloudSections()}
          </div>
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
    username: sessionInfo['username'],
    clouds: sessionInfo['clouds']
  }
}

export default connect(mapStateToProps, {})(Home)
