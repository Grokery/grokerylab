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
  updateCode = (newCode) => {
    if (this.debounce) {
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(() => {
      this.props.onUpdate({
        'source': newCode
      })
    }, 1000);
  }
  render() {
    let { node } = this.props
    if (!node){
      return (<div></div>)
    }
    let editorOptions = {
      lineNumbers: true,
      dragDrop: false,
      mode: {name: "html"},
      height: 'auto',
    }
    return (
      <div className='board-code-tab'>
        <CodeEditor value={node['source']} options={editorOptions} onChange={this.updateCode} />
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
