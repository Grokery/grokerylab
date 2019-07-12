import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/chrome'

class BrowserJs extends Component {
  static propTypes = {
    onCodeChange: PropTypes.func.isRequired,
    draftCode: PropTypes.string,
    height: PropTypes.number,
    runJob: PropTypes.func.isRequired,
  }
  static defaultProps = {
    draftCode: '',
    height: window.innerHeight,
  }
  constructor(props) {
    super(props)
      this.state = {
          showModal: false,
          showConsole: false,
          consoleHeight: 0,//200
      }
  }
  getSubTypeInfo = () => {
    return (
      <>
        <div className='row' style={{borderBottom:'solid .5px #E1E3E5'}}>
          <div className='col col-md-12' style={{paddingTop:'4px'}}>
            <label style={{paddingTop:'5px',paddingLeft:'10px'}}>JobType:</label> BrowserJs
            <button 
              key='run'
              // disabled={this.state.dirty} 
              onClick={this.props.runJob} 
              className='btn'
              title={"Run job"}
              style={{float:'right'}}>
                <i className='fa fa-play' aria-hidden="true"></i>
            </button>
            <button key='info' 
              // onClick={this.openDocumentation()} 
              className='btn'
              title={"open documentation about this node type"}
              style={{}}>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className='row hidden-xs hidden-sm'>
          <div className='col col-md-12'>
          </div>
        </div>
      </>
    )
  }
  render() {
    let { height, draftCode, onCodeChange } = this.props
    let { consoleHeight, showConsole } = this.state;
    let displayConsole = showConsole ? 'block' : 'none'
    return (
      <div className='row'>
          <div className='col col-md-3'>
            {this.getSubTypeInfo()}
          </div>
          <div className='col col-md-9' style={{paddingRight:'0px',position:'relative'}}>
            <AceEditor
              mode="javascript"
              theme="chrome"
              onChange={onCodeChange}
              fontSize={12}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={draftCode}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              width={"100%"}
              height={`${height-consoleHeight}px`}// -10
            />
            <div id="iframe-console" style={{display:displayConsole}}>
              <pre id="iframe-console-pre" style={{height:consoleHeight+'px',borderRadius:0, backgroundColor:'white',borderBottom:'none'}}>></pre>
            </div>
        </div>
      </div>
    )
  }
  onChange = (newCode) => {
    this.props.onCodeChange(newCode)
  }

  // toggleTemplateModal(e) {
  //   e.preventDefault()
  //   if (this.state.showModal) {
  //     this.setState({showModal: false})
  //   } else {
  //     this.setState({showModal: true})
  //   }
  // }
  // setTemplate(template) {
  //   this.props.onUpdate({
  //     'code': template.code,
  //     'data': template.data
  //   })
  // }
  // getCompleted() {
  //   let runs = []
  //   runs.push((<option key='6'>Completed: 2017-05-31 09:20 - 12 min -  Warning</option>))
  //   runs.push((<option key='5'>Completed: 2017-05-31 09:18 - 5 min -  Success</option>))
  //   runs.push((<option key='4'>Completed: 2017-05-30 13:13 - 5 min - Success</option>))
  //   return runs
  // }
  // getLogsForRun() {
  //   let rawLogs = ''
  //   return rawLogs
  // }

}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, {})(BrowserJs)
