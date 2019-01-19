import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import 'brace/mode/html'
import 'brace/theme/github'

// import './BoardCode.css'

class BoardCode extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
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
    let synced = this.state.draft === node.source
    return (
      <div className='board-code-tab'>
        <div style={{paddingRight:'11px', position:'absolute', top:'50px', right:'0px', zIndex:2}}>
          <div style={{fontSize:'16px'}}>
            {synced ? <i title='all changes saved' className='fa fa-check'></i> : 
              <i onClick={this.updateCode} className='fa fa-save' style={{cursor:'pointer'}} title='unsaved changes'></i>}
          </div>
        </div>
        <AceEditor
              mode="html"
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
              // width={this.props.width+'px'}
              // height={this.props.height+'px'}
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

export default connect(mapStateToProps, {})(BoardCode)
