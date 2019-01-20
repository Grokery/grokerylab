import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/chrome'

import Modal from 'shared/Modal/Modal'
import './EditModal.css'

class EditModal extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    toggleEditDialog: PropTypes.func.isRequired,
    title: PropTypes.string,
    form: PropTypes.object,
  }
  render() {
    return (
      <Modal id="edit-modal" shown={this.props.shown}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.toggleEditDialog} aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 className="modal-title">{this.props.title}</h4>
        </div>
        <div className="modal-body">
          <AceEditor
              mode="json"
              theme="chrome"
              onChange={this.updateJson}
              fontSize={12}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={JSON.stringify(this.getNodeJsonForEdit(), null, 2)}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              width={'100%'}
            />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.closeDialog}>Close Edit</button>
        </div>
      </Modal>
    )
  }
  updateJson = (newValue) => {
    this.json = JSON.parse(newValue)
  }
  closeDialog = () => {
    if (this.json) {
      this.props.onUpdate(this.json)
    }
    this.props.toggleEditDialog()
  }
  getNodeJsonForEdit() {
    let json = Object.assign({}, this.props.node)
    delete json.source
    delete json.data
    if (!json) {
      json = {}
    }
    return json
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(EditModal)
