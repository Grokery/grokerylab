import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CodeEditor from 'shared/CodeEditor/CodeEditor'

import './BoardCode.css'

class BoardCode extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)

    this.state = {
      draft: props.node['source'],
    }
  }
  onChange = (newCode) => {
    this.setState({ draft: newCode })
  }
  updateCode = (e) => {
    e.preventDefault()
    this.props.onUpdate({
      'source': this.state.draft
    })
  }
  render() {
    let { node } = this.props
    if (!node){
      return (<div></div>)
    }
    let editorOptions = {
      lineNumbers: true,
      dragDrop: false,
      mode: {name: "htmlmixed"},
      height: 'auto',
    }
    let synced = this.state.draft === node.source
    return (
      <div className='board-code-tab'>
        <div style={{float:'right', paddingRight:'11px', paddingTop:'10px'}}>
          <div style={{fontSize:'16px'}}>
            {synced ? <i title='all changes saved' className='fa fa-check'></i> : 
              <i onClick={this.updateCode} className='fa fa-save' style={{cursor:'pointer'}} title='unsaved changes'></i>}
          </div>
        </div>
        <CodeEditor value={this.state.draft} options={editorOptions} onChange={this.onChange} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(BoardCode)
