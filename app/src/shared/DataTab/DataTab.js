import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/chrome'

// import CodeEditor from 'shared/CodeEditor/CodeEditor'
import './DataTab.css'

class DataTab extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    height: PropTypes.number,
  }
  static defaultProps = {
    height: window.innerHeight
  }
  constructor(props) {
    super(props)

    this.state = {
      draft: JSON.stringify(props.node.data, null, 2),
    }
  }
  onChange = (data) => {
    this.setState({ draft: data })
  }
  updateData = (e) => {
    e.preventDefault()
    this.props.onUpdate({
      'data': JSON.parse(this.state.draft)
    })
  }
  render() {
    let { node } = this.props
    if (!node){
      return (<div></div>)
    }
    // let dataOptions = {
    //   lineNumbers: true,
    //   dragDrop: false,
    //   mode: "text/x-livescript",
    //   height: 'auto',
    // }
    let synced = this.state.draft === JSON.stringify(node.data, null, 2)
    return (
      <div className='data-code-tab'>
        {/* <div style={{float:'right', paddingRight:'11px', paddingTop:'10px'}}>
          <div style={{fontSize:'16px'}}>
            {synced ? <i title='all changes saved' className='fa fa-check'></i> : 
              <i onClick={this.updateData} className='fa fa-save' style={{cursor:'pointer'}} title='unsaved changes'></i>}
          </div>
        </div> */}
        {/* <CodeEditor value={this.state.draft} options={dataOptions} onChange={this.onChange}/> */}
        <AceEditor
          mode="json"
          theme="chrome"
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
          width={"100%"}
          height={this.props.height+"px"}
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
