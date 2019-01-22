import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import 'brace/mode/python'
import 'brace/theme/chrome'

class BrowserJs extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    height: PropTypes.number,
  }
  static defaultProps = {
    height: window.innerHeight,
  }
  constructor(props) {
    super(props)
      this.state = {
          showModal: false
      }
  }
  render() {
    let { node, height } = this.props
    if (!node){
      return (<div></div>)
    }
    return (
      <div className='row' style={{margin:0,padding:0}}>
          <div className='col-md-12' style={{margin:0,padding:0}}> 
            <AceEditor
              mode="python"
              theme="chrome"
              onChange={this.onChange}
              fontSize={12}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={'\n\n\n\n'}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              width={"100%"}
              height={height+"px"}
            />
        </div>
      </div>
    )
  }
  toggleTemplateModal(e) {
    e.preventDefault()
    if (this.state.showModal) {
      this.setState({showModal: false})
    } else {
      this.setState({showModal: true})
    }
  }
  setTemplate(template) {
    this.props.onUpdate({
      'code': template.code,
      'data': template.data
    })
  }
  getCompleted() {
    let runs = []
    runs.push((<option key='6'>Completed: 2017-05-31 09:20 - 12 min -  Warning</option>))
    runs.push((<option key='5'>Completed: 2017-05-31 09:18 - 5 min -  Success</option>))
    runs.push((<option key='4'>Completed: 2017-05-30 13:13 - 5 min - Success</option>))
    return runs
  }
  getLogsForRun() {
    let rawLogs = ''
    return rawLogs
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(BrowserJs)
