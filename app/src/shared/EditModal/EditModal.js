import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from '../Modal/Modal'
import { Tabs, Panel } from '../Tabs/Tabs'
import { NODETYPE } from '../../common.js'
import CodeEditor from '../CodeEditor/CodeEditor'
import JobForm from './JobForm'
import SourceForm from './SourceForm'
import ChartForm from './ChartForm'
import BoardForm from './BoardForm'
import './EditModal.css'

class EditModal extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
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
        <Tabs key={Math.random()} activeTab={1} getRightMenuOptions={function(){return[]}}>
          <Panel title='Config'>
            <div>{this.getForm()}</div>
          </Panel>
          <Panel title='Json'>
            <CodeEditor value={JSON.stringify(this.getNodeJsonForEdit(), null, 2)} options={options} onChange={this.updateJson.bind(this)} />
          </Panel>
        </Tabs>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.closeDialog.bind(this)}>Close Edit</button>
        </div>
      </Modal>
    )
  }
  getForm() {
    let { node } = this.props
    if (!node) {
      return <div></div>
    }
    if (node.nodeType === NODETYPE.JOB) {
      return (<JobForm node={node} onUpdate={this.props.onUpdate}></JobForm>)
    } else if (node.nodeType === NODETYPE.DATASOURCE) {
      return (<SourceForm node={node} onUpdate={this.props.onUpdate}></SourceForm>)
    } else if (node.nodeType === NODETYPE.CHART) {
      return (<ChartForm node={node} onUpdate={this.props.onUpdate}></ChartForm>)
    } else if (node.nodeType === NODETYPE.JOB) {
      return (<BoardForm node={node} onUpdate={this.props.onUpdate}></BoardForm>)
    } else {
      return <div></div>
    }
  }
  updateJson(newValue) {
    this.json = JSON.parse(newValue)
  }
  closeDialog() {
    if (this.json) {
      this.props.onUpdate(this.json)
    }
    this.props.toggleEditDialog()
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
