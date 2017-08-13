import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNode } from '../../actions'
import CodeEditor from '../CodeEditor/CodeEditor'
import './JobCodeTab.css'

class JobCodeTab extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    fetchNode: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
      this.state = {
          showModal: false
      }
  }
  componentDidMount() {
    const { fetchNode, params } = this.props
    fetchNode(params.collection, params.nodeId)
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
  updateCode(newCode) {
    if (this.debounce){
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(function(){ 
      this.props.onUpdate({
        'code': newCode
      }) 
    }.bind(this), 1000);
  }
  getEditorType(node) {
    let type = node.type
    /* TODO: select code editor component by job type (datapipeline is different than sproc) */
    // TODO finish refactoring this
    if (type === 'type a' || type === 'type b') {
      return(<div></div>)
    } else {
      let options = {
        lineNumbers: true,
        dragDrop: false,
        mode: {name: "javascript"}
      }
      return (<CodeEditor value={node.code} options={options} onChange={this.updateCode.bind(this)} />)
    }
  }
  render() {
    let { node } = this.props
    if (!node){
      return (<div></div>)
    }
    return (
      <div className='job-code-tab'>
        <div className='code col col-md-6'>
          {this.getEditorType(node)}
        </div>
        <div className='col col-md-6'>
          {/* TODO abstract out this column to own component that shows run btn or active toggle depending on job type and pulls run info from logs */}
          <div className=''>
            <div className='col col-md-1 run-button'>
              {/* <a href='#' onClick={function(){}}><i className="fa fa-pause" aria-hidden="true"></i></a> */}
              <label className="switch"><input type="checkbox" /><span className="slider round"></span></label>
            </div>
            <div className='col col-md-11 output-select'>
              <select className='form-control'>
              <option>Next Scheduled Run: - None -</option>
                <option>Next Scheduled Run: 2017-05-31 09:30</option>
                <option>Started 2017-05-31 10:00 - In Progress... </option>
                <option>Completed: 2017-05-31 09:20 - 12 min -  Warning</option>
                <option>Completed: 2017-05-31 09:18 - 5 min -  Success</option>
                <option>Completed: 2017-05-30 13:13 - 5 min - Success</option>
              </select>
            </div>
          </div>
          <div className=''>
            <div className='col col-md-12'>
            <pre>
              {`
13 Aug 2017 14:43:36,891 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.taskrunner.TaskPoller: Executing: amazonaws.datapipeline.activity.ShellCommandActivity@557597b7
13 Aug 2017 14:43:38,468 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Downloading directory from S3 Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data to output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:38,588 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Downloading files from S3 Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data to output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:38,588 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_1
13 Aug 2017 14:43:38,588 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_1 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_1
13 Aug 2017 14:43:38,793 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_2
13 Aug 2017 14:43:38,793 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_2 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_2
13 Aug 2017 14:43:38,892 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_3
13 Aug 2017 14:43:38,893 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_3 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_3
13 Aug 2017 14:43:39,010 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_4
13 Aug 2017 14:43:39,010 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_4 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_4
13 Aug 2017 14:43:39,106 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_5
13 Aug 2017 14:43:39,106 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_5 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_5
13 Aug 2017 14:43:39,220 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Local File Relative compared to Input Root Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data is /access_log_6
13 Aug 2017 14:43:39,220 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Downloading S3 file s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data/access_log_6 to /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2/access_log_6
13 Aug 2017 14:43:47,683 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Completed Downloading files from S3 Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data to output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:47,683 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Completed Downloading directory from S3 Path:s3://us-east-1.elasticmapreduce.samples/pig-apache-logs/data to output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:47,684 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.objects.CommandRunner: Executing command: grep -rc "GET" \${INPUT1_STAGING_DIR}/* > \${OUTPUT1_STAGING_DIR}/output.txt
13 Aug 2017 14:43:47,698 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.objects.CommandRunner: configure ApplicationRunner with stdErr file: output/logs/df-04614723BBKXA2LQL637/ShellCommandActivityObj/@ShellCommandActivityObj_2017-08-13T14:20:27/@ShellCommandActivityObj_2017-08-13T14:20:27_Attempt=1/StdError  and stdout file :output/logs/df-04614723BBKXA2LQL637/ShellCommandActivityObj/@ShellCommandActivityObj_2017-08-13T14:20:27/@ShellCommandActivityObj_2017-08-13T14:20:27_Attempt=1/StdOutput
13 Aug 2017 14:43:47,698 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.objects.CommandRunner: Executing command: output/tmp/df-04614723BBKXA2LQL637-c308dd0d303c4262a07779d12ed232c1/ShellCommandActivityObj20170813T142027Attempt1_command.sh with env variables :{INPUT1_STAGING_DIR=/media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2, OUTPUT1_STAGING_DIR=/media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789} with argument : null
13 Aug 2017 14:43:48,703 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Uploading local directory:output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789 to S3 s3://fubitz//2017-08-13-14-20-27
13 Aug 2017 14:43:48,704 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin Upload single file to S3:s3://fubitz//2017-08-13-14-20-27/output.txt
13 Aug 2017 14:43:48,735 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Begin upload of file /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789/output.txt to  S3 paths3://fubitz//2017-08-13-14-20-27/output.txt
13 Aug 2017 14:43:48,846 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Completed upload of file /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789/output.txt to  S3 paths3://fubitz//2017-08-13-14-20-27/output.txt
13 Aug 2017 14:43:48,846 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Completed uploading of all files
13 Aug 2017 14:43:48,846 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.S3Helper: Completed upload of local dir output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789 to s3://fubitz//2017-08-13-14-20-27
13 Aug 2017 14:43:48,846 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.StageFromS3Connector: cleaning up directory /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_input1_348ba42f722342aab4762ac3cfa009e2
13 Aug 2017 14:43:48,865 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.connector.staging.StageInS3Connector: cleaning up directory /media/ephemeral0/mnt/taskRunner/output/staging/df-04614723BBKXA2LQL637_output1_6f1d9d016765441e954d826dde6c9789
13 Aug 2017 14:43:48,866 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.taskrunner.HeartBeatService: Finished waiting for heartbeat thread @ShellCommandActivityObj_2017-08-13T14:20:27_Attempt=1
13 Aug 2017 14:43:48,866 [INFO] (TaskRunnerService-resource:df-04614723BBKXA2LQL637_@EC2ResourceObj_2017-08-13T14:20:27-0) df-04614723BBKXA2LQL637 amazonaws.datapipeline.taskrunner.TaskPoller: Work ShellCommandActivity took 0:11 to complete`}
            </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {
  fetchNode
})(JobCodeTab)
