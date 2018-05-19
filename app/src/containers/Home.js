import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../authentication'
import CloudSection from '../components/CloudSection/CloudSection'
import Modal from '../components/Modal/Modal'
import CodeEditor from '../components/CodeEditor/CodeEditor'
import '../styles/Home.css'

class Home extends Component {
  static propTypes = {
    username: PropTypes.string,
    clouds: PropTypes.object
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
  createCloud(newValue) {
    if (this.debounce){
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(function() {
      // this.props.onUpdate(newValue)
      let foo = this
      return foo
    }.bind(this), 1000);
  }
  getCloudSections() {
    const { clouds } = this.props
    let sections = []
    Object.keys(clouds).forEach(function(name) {
      let cloud = clouds[name]
      sections.push(   
        <CloudSection key={name} cloudid={name} cloud={cloud}></CloudSection>
      )
    })
    let newCloudDef = {
      "title": "Hello World",
      "name": "helloworld",
      "type": "local",
      "url": "http://localhost:5000"
    }
    let options = {
      lineNumbers: false,
      dragDrop: false,
      mode: {name: "javascript"}
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
                  <CodeEditor value={JSON.stringify(newCloudDef, null, 2)} options={options} onChange={this.createCloud.bind(this)} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.toggleEditDialog.bind(this)}>Create</button>
              </div>
            </Modal>
          </div>
         </div>
    )
    return sections
  }
  render() {
    let { name } = this.props
    return (
      <div className='page-content home'>
        <div>
          <div className='user-section'>
            {<h1>Hi {name}</h1>}
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
      name: "",
      clouds:{}
    }
  }
  return {
    name: sessionInfo['name'],
    clouds: sessionInfo['clouds']
  }
}

export default connect(mapStateToProps, {})(Home)
