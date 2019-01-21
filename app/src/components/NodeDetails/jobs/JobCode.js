import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import 'brace/mode/python'
import 'brace/theme/chrome'

import './JobCode.css'

class JobCodeTab extends Component {
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
      <div className='row job-code-tab'>
        <div className='col-md-2' style={{paddingRight:'0px'}}>

          {/*  TODO store files as file objects in list in node */}
          <ul style={{marginTop:'5px', marginBottom:'15px', paddingLeft: '0px', marignRight:'0px', listStyleType: 'none'}}>
            <li style={{padding:'5px', paddingLeft:'15px'}}><a href='#/' onClick={(e) => {e.preventDefault()}}>job.py</a></li>
            <li style={{padding:'5px', paddingLeft:'15px'}}><a href='#/' onClick={(e) => {e.preventDefault()}}>main.py</a></li>
            <li style={{padding:'5px', paddingLeft:'15px'}}><a href='#/' onClick={(e) => {e.preventDefault()}}>requirements.txt</a></li>
          </ul>

        </div>
        <div className='col-md-10'>
          <div className='row' style={{marign:0}}>
            <div className='col-md-12' style={{paddingLeft:'0px'}}> 
              <AceEditor
                mode="python"
                theme="chrome"
                onChange={this.onChange}
                fontSize={12}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={'\n\n\n'}
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
  getInProgress() {
    return (<option key='3'>Started 2017-05-31 10:00 - In Progress... </option>)
  }
  getNextScheduled() {
    if (this.props.node.isActive) {
      return (<option key='1'>Next Scheduled Run: 2017-05-31 09:30</option>)
    } else {
      return [
        (<option key='1'>Next Scheduled Run: - None -</option>),
        (<option key='2'>Next Scheduled Run: 2017-05-31 09:30</option>)]
    }
  }
  toggleIsActive(e) {
    this.props.node.isActive = !this.props.node.isActive
  }
  getLogsForRun() {
    let rawLogs = `
13 Aug 2017 14:43:36 TaskPoller: Executing: amazonaws.datapipeline.activity.ShellCommandActivity@557597b7
13 Aug 2017 14:43:38 S3Helper: Begin Downloading directory from S3 Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data to output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:38 S3Helper: Begin Downloading files from S3 Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data to output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:38 S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_1
13 Aug 2017 14:43:38 S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_1 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_1
13 Aug 2017 14:43:38 S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_2
13 Aug 2017 14:43:38 S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_2 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_2
13 Aug 2017 14:43:38 S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_3
13 Aug 2017 14:43:38 S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_3 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_3
13 Aug 2017 14:43:39 S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_4
13 Aug 2017 14:43:39 S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_4 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_4
13 Aug 2017 14:43:39 S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_5
13 Aug 2017 14:43:39 S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_5 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_5
13 Aug 2017 14:43:39 S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_6
13 Aug 2017 14:43:39 S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_6 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_6
13 Aug 2017 14:43:47 S3Helper: Completed Downloading files from S3 Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data to output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:47 S3Helper: Completed Downloading directory from S3 Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data to output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:47 CommandRunner: Executing command: grep -rc "GET" \${INPUT1_STAGING_DIR}/* > \${OUTPUT1_STAGING_DIR}/output.txt
13 Aug 2017 14:43:47 CommandRunner: configure ApplicationRunner with stdErr file: output/logs/df-04614723BBKXA2LQL637/ShellCommandActivityObj/@ShellCommandActivityObj_2017-08-13T14:20:27/@ShellCommandActivityObj_2017-08-13T14:20:27_Attempt=1/StdError  and stdout file :output/logs/df-04614723BBKXA2LQL637/ShellCommandActivityObj/@ShellCommandActivityObj_2017-08-13T14:20:27/@ShellCommandActivityObj_2017-08-13T14:20:27_Attempt=1/StdOutput
13 Aug 2017 14:43:47 CommandRunner: Executing command: output/tmp/df-04614723BBKXA2LQL637-c308dd0d303c4262a07779d12ed232c1/ShellCommandActivityObj20170813T142027Attempt1_command.sh with env variables :{INPUT1_STAGING_DIR=/media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2, OUTPUT1_STAGING_DIR=/media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789} with argument : null
13 Aug 2017 14:43:48 S3Helper: Begin Uploading local directory:output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789 to S3 s3://fubitz//2017-08-13-14-20-27
13 Aug 2017 14:43:48 S3Helper: Begin Upload single file to S3:s3://fubitz//2017-08-13-14-20-27/output.txt
13 Aug 2017 14:43:48 S3Helper: Begin upload of file /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789/output.txt to  S3 paths3://fubitz//2017-08-13-14-20-27/output.txt
13 Aug 2017 14:43:48 S3Helper: Completed upload of file /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789/output.txt to  S3 paths3://fubitz//2017-08-13-14-20-27/output.txt
13 Aug 2017 14:43:48 S3Helper: Completed uploading of all files
13 Aug 2017 14:43:48 S3Helper: Completed upload of local dir output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789 to s3://fubitz//2017-08-13-14-20-27
13 Aug 2017 14:43:48 StageFromS3Connector: cleaning up directory /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:48 StageInS3Connector: cleaning up directory /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789
13 Aug 2017 14:43:48 HeartBeatService: Finished waiting for heartbeat thread @ShellCommandActivityObj_2017-08-13T14:20:27_Attempt=1
13 Aug 2017 14:43:48 TaskPoller: Work ShellCommandActivity took 0:11 to complete`
    return rawLogs
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(JobCodeTab)
