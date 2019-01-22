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
  }
  static defaultProps = {
    draftCode: '',
    height: window.innerHeight,
  }
  constructor(props) {
    super(props)
      this.state = {
          showModal: false,
      }
  }
  render() {
    let { height, draftCode, onCodeChange } = this.props
    return (
      <div className='row' style={{margin:0,padding:0}}>
          <div className='col-md-12' style={{margin:0,padding:0}}> 
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
              height={height+"px"}
            />
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