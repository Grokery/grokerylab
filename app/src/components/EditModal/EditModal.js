import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from '../Modal/Modal'
import { Tabs, Panel } from '../Tabs/Tabs'
import ContentEditable from '../ContentEditable/ContentEditable'
import './EditModal.css'

class EditModal extends Component {
  static propTypes = {
    node: PropTypes.object,
    title: PropTypes.string,
    toggleEditDialog: PropTypes.func.isRequired
  }
  render() {
    return (
      <Modal shown={this.props.shown}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.toggleEditDialog} aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 className="modal-title">{this.props.title}</h4>
        </div>
        <div className="modal-body">

        <Tabs getRightMenuOptions={function(){return[]}}>
          <Panel title='Info'>
            <div>hello</div>
          </Panel>
          <Panel title='Code'>
            <ContentEditable type='pre' value={JSON.stringify(this.getNodeJsonForEdit(), null, 2)} onChange={this.handleChange.bind(this)}></ContentEditable>
          </Panel>
        </Tabs>
        
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.props.toggleEditDialog}>Close Edit</button>
        </div>
      </Modal>
    )
  }
  handleChange(e) {
    this.props.onUpdate(JSON.parse(e.target.value))
  }
  getNodeJsonForEdit() {
    let json = Object.assign({}, this.props.node) 
    if (!json) {
      json = {}
    }
    delete json.code
    delete json.data
    delete json.img
    return json
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(EditModal)
