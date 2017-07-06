import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from '../Modal/Modal'
import { Tabs, Panel } from '../Tabs/Tabs'
import CodeEditor from '../CodeEditor/CodeEditor'
import './EditModal.css'

class EditModal extends Component {
  static propTypes = {
    node: PropTypes.object,
    title: PropTypes.string,
    toggleEditDialog: PropTypes.func.isRequired
  }
  render() {
    let options = {
      lineNumbers: false,
      dragDrop: false,
      mode: {name: "javascript"}
    }
    return (
      <Modal id="edit-modal" shown={this.props.shown}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.toggleEditDialog} aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 className="modal-title">{this.props.title}</h4>
        </div>
        <div className="modal-body">

        <Tabs getRightMenuOptions={function(){return[]}}>
          <Panel title='Options'>
            <div></div>
          </Panel>
          <Panel title='Json'>
            <CodeEditor value={JSON.stringify(this.getNodeJsonForEdit(), null, 2)} options={options} onChange={this.updateCode.bind(this)} />
          </Panel>
        </Tabs>
        
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.props.toggleEditDialog}>Close Edit</button>
        </div>
      </Modal>
    )
  }
  updateCode(newValue) {
    if (this.debounce){
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(function() {
      this.props.onUpdate(newValue)
    }.bind(this), 1000);
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
