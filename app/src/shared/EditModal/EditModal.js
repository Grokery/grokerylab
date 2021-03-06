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
  constructor(props) {
    super(props)
    this.state = {
      nodeJson: this.getNodeJsonForEdit(props.node)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.node.nodeId !== this.props.node.nodeId) {
      this.setState({nodeJson: this.getNodeJsonForEdit(nextProps.node)})
    }
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
              onChange={this.onChange}
              fontSize={12}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={this.state.nodeJson}
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
  onChange = (newJson) => {
    this.setState({ nodeJson: newJson, dirty: true })
  }
  closeDialog = () => {
    this.props.onUpdate(JSON.parse(this.state.nodeJson), () => {
      this.setState({ dirty: false })
      this.props.toggleEditDialog()
    })
  }
  getNodeJsonForEdit(node = this.props.node) {
    let json = Object.assign({}, node)
    delete json.source
    delete json.code
    delete json.data
    delete json.jsonData
    if (!json) {
      json = {}
    }
    return JSON.stringify(json, null, 2)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(EditModal)
