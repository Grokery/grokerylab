import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../../authentication'
import Modal from '../../shared/Modal/Modal'
import { GROKERY_API } from '../../config.js'

class CreateCloudSection extends Component {
  static propTypes = {
    username: PropTypes.string
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false
      }
  }
  toggleDialog(e) {
    if (e) {e.preventDefault()}
    this.setState({shown: !this.state.shown})
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
  render() {
    return (
        <div key="add-cloud">
          <div className='cloud-section'>
            <a className='btn new-cloud-button' href='#' onClick={this.toggleDialog.bind(this)}><i className='fa fa-plus'/></a>
            <Modal shown={this.state.shown}>
              <div className="modal-header">
                <button type="button" className="close" onClick={this.toggleDialog.bind(this)} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Add Cloud</h4>
              </div>
              <div className="modal-body">
                  <form >

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>Cloud Title:</label>
                        <input type="text" className="form-control" placeholder="My New Cloud" />
                      </div>
                      <div className="form-group col-md-6">
                        <label>URL Name:</label>
                        <input type="text" className="form-control" placeholder="mynewcloud" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-9">
                        <label>URL:</label>
                        <input type="text" className="form-control" placeholder={GROKERY_API} disabled/>
                      </div>
                      <div className="form-group col-md-3">
                        <label>Type:</label>
                        <select className="form-control" disabled>
                          <option>AWS</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-5">
                        <label>AWS_ACCESS_KEY_ID:</label>
                        <input type="text" className="form-control"/>
                      </div>
                      <div className="form-group col-md-5">
                        <label>AWS_SECRET_KEY:</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="form-group col-md-2">
                        <label>AWS_REGION:</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>

                  </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.toggleDialog.bind(this)}>Create</button>
              </div>
            </Modal>
          </div>
         </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let sessionInfo = getSessionInfo()
  if (!sessionInfo) {
    sessionInfo = {
      name: ""
    }
  }
  return {
    name: sessionInfo['name']
  }
}

export default connect(mapStateToProps, {})(CreateCloudSection)
