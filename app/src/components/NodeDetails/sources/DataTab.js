import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/github'

import './DataTab.css'

class DataTab extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  }
  constructor(props) {
    super(props)

    this.state = {
      draft: JSON.stringify(props.node.data, null, 2),
    }
  }
  onChange = (newData) => {
    this.setState({ draft: newData })
  }
  updateCode = (e) => {
    e.preventDefault()
    this.props.onUpdate({
      'data': JSON.parse(this.state.draft)
    })
  }
  render() {
    let { node } = this.props
    let synced = this.state.draft === JSON.stringify(node.data, null, 2)
    return (
      <div className='board-code-tab'>
        <div style={{paddingRight:'11px', position:'absolute', top:'50px', right:'0px', zIndex:2}}>
          <div style={{fontSize:'16px'}}>
            {synced ? <i title='all changes saved' className='fa fa-check'></i> : 
              <i onClick={this.updateCode} className='fa fa-save' style={{cursor:'pointer'}} title='unsaved changes'></i>}
          </div>
        </div>
        <AceEditor
              mode="json"
              theme="github"
              onChange={this.onChange}
              fontSize={12}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={this.state.draft}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              width={this.props.width+'px'}
              height={this.props.height+'px'}
            />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(DataTab)
