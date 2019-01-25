import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat, assign, isArray, cloneDeep } from 'lodash'

import { API_BASE_URL } from 'config'
import { getCloudId, getCloudToken, getSessionInfo } from 'authentication'
import { postJobRun, fetchJobRuns, fetchJobRunsWithRepeat, fetchNode, fetchNodes, updateJobRun } from 'store/actions'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import InfoTab from 'shared/InfoTab/InfoTab'
import LogsTab from 'shared/LogsTab/LogsTab'

import PlaceholderInfo from './infoTabs/PlaceholderInfo'
import BrowserJsInfo from './infoTabs/BrowserJsInfo'
import AwsLambdaInfo from './infoTabs/AwsLambdaInfo'
import JobForm from './JobForm'
import BrowserJs from './codeTabs/BrowserJs'
import AWSLambda from './codeTabs/AWSLambda'

class JobDetails extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    rightMenuOptions: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    postJobRun: PropTypes.func.isRequired,
    fetchJobRuns: PropTypes.func.isRequired,
    fetchJobRunsWithRepeat: PropTypes.func.isRequired,
    fetchNode: PropTypes.func.isRequired,
    fetchNodes: PropTypes.func.isRequired,
    updateJobRun: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false,
          dirty: false,
          draftCode: props.node.code,
      }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.node.nodeId !== this.props.node.nodeId) {
      this.setState({draftCode: nextProps.node.code})
    }
  }
  onKeyDown = (e) => {
    if (e.metaKey && e.keyCode === 83) { // 83='s'
      this.onUpdate(e)
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  render() {
    const { onUpdate, params, node, height } = this.props
    let commonProps = {
      key: params.nodeId, 
      params: params,
      onUpdate: onUpdate,
      height: height,
      runJob: this.runJob,
    }
    return (
      <div className='job-details'>
        <Tabs>
          <Panel title='Info'>
            {this.renderRightMenuOptions()}
            {this.getJobInfoComponent(commonProps)}
          </Panel>
          <Panel title='Code'>
            {this.renderRightMenuOptions()}
            {this.getJobCodeComponent(commonProps)}
          </Panel>
          <Panel title='History'>
            {this.renderRightMenuOptions()}
            <LogsTab params={this.props.params}></LogsTab>
          </Panel>
        </Tabs>
        <EditModal 
          title="Edit Job" 
          node={node} 
          onUpdate={this.props.onUpdate} 
          shown={this.state.shown} 
          toggleEditDialog={this.toggleEditDialog}
          form={(<JobForm node={node} onUpdate={this.props.onUpdate}></JobForm>)}
        ></EditModal>
      </div>
    )
  }
  getRightMenuOptions = () => {
    let saveOption = null
    if (this.state.dirty) {
      saveOption = <a key='save' href='' onClick={this.onUpdate} className='btn btn-default'><i className='fa fa-save'></i></a>
    }
    return concat([
      saveOption,
      <a key='run' href='' onClick={this.runJob} className='btn btn-default'><i className='fa fa-play'></i></a>,
      <a key='edit' href='' onClick={this.toggleEditDialog} className='btn btn-default'><i className='fa fa-cog'></i></a>,
    ], this.props.rightMenuOptions)
  }
  renderRightMenuOptions() {
    return (
      <div className='btn-group item-options' style={{position: 'absolute', right: 0, top: 0}}>
          {this.getRightMenuOptions()}
      </div>
    )
  }
  runJob = (e) => {
    e.preventDefault()
    const { node } = this.props
    if (node.subType === 'BROWSERJS') {
      this.runBrowserJsJob()
    } else if (node.subType === 'AWSLAMBDA')  {
      this.runAWSLambdaJob()
    } else {
      alert('No run specification defined for job type: ' + node.subType)
    }
  }
  runBrowserJsJob() {
    const { postJobRun, node, fetchJobRunsWithRepeat, params } = this.props
    let userEmail = getSessionInfo().username
    try {
      var iframe = document.createElement('iframe')
      iframe.style.visibility = "hidden"
      iframe.style.width = "1px"
      iframe.style.height = "1px"
      iframe.style.position = "absolute"
      iframe.style.top = "0"
      iframe.style.left = "0"

      document.body.appendChild(iframe)
      iframe.contentWindow.document.open()
      iframe.contentWindow.document.write(this.getHelperCode())
      iframe.contentWindow.document.write('<script>'+cloneDeep(node.code)+'</script>')
      iframe.contentWindow.document.close()
      postJobRun(params.cloudName, {jobId: node.nodeId, jobRunType: node.subType, runStatus: "COMPLETED", userContact: userEmail}, () => {
        fetchJobRunsWithRepeat(params.cloudName, "?jobId="+node.nodeId+"&limit=5", null, [[0, 0.0, 1]])
      })
    }
    catch (e) {
      postJobRun(params.cloudName, {jobId: node.nodeId, jobRunType: node.subType, runStatus: "ERRORED", userContact: userEmail}, () => {
        fetchJobRunsWithRepeat(params.cloudName, "?jobId="+node.nodeId+"&limit=5", null, [[0, 0.0, 1]])
      })
    }
  }
  getHelperCode() {
    const { params } = this.props
    let url = API_BASE_URL + '/clouds/' + getCloudId(params.cloudName) + '/nodes/datasource/'
    let token = getCloudToken(params.cloudName)
    return `
        <script>
            var getSource = (id, cb) => {
                var url = '`+url+`' + id + '/query'
                var options = {headers:{"Authorization":"`+token+`"}}
                fetch(url, options)
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    cb(data);
                });
            }
        </script>
        <script>
          var putSource = (id, data) => {
              var url = '`+url+`' + id + '/write'
              var options = {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                  "Authorization":"`+token+`",
                  "Content-Type": "application/json"
                }
              }
              fetch(url, options)
          }
      </script>
    ` 
  }
  runAWSLambdaJob() {
    const { postJobRun, node, fetchJobRunsWithRepeat, params } = this.props
    let sessionInfo = getSessionInfo()
    let userEmail = sessionInfo.username
    postJobRun(params.cloudName, {
      userContact: userEmail,
      jobId: node.nodeId,
      jobRunType: node.subType,
      lambdaARN: node.lambdaARN,
      args: {
          baseUrl: API_BASE_URL,
          authorization: getCloudToken(params.cloudName),
      }
    }, () => {
        fetchJobRunsWithRepeat(params.cloudName, "?jobId="+node.nodeId+"&limit=5", null, [[1, 0.0, 5], [1, 2.0, 5]])
    })
  }
  getJobInfoComponent(props) {
    const { node } = this.props
    if (node.subType === 'GENERIC') {
      return (<InfoTab {...props}><PlaceholderInfo {...props}></PlaceholderInfo></InfoTab>)
    } else if (node.subType === 'BROWSERJS') {
      return (<InfoTab {...props}><BrowserJsInfo {...props}></BrowserJsInfo></InfoTab>)
    } else if (node.subType === 'AWSLAMBDA') {
      return (<InfoTab {...props}><AwsLambdaInfo {...props}></AwsLambdaInfo></InfoTab>)
    }
  }
  getJobCodeComponent(props) {
    const { node } = this.props
    const codeProps = assign(props, {
      draftCode: this.state.draftCode,
      onCodeChange: this.onCodeChange,
    })
    if (node.subType === 'GENERIC') {
      return (<div>Placeholder</div>)
    } else if (node.subType === 'BROWSERJS') {
      return (<BrowserJs {...codeProps}></BrowserJs>)
    } else if (node.subType === 'AWSLAMBDA') {
      return (<AWSLambda {...codeProps}></AWSLambda>)
    } else {
      return null
    }
  }
  toggleEditDialog = (e) => {
    if (e) {e.preventDefault()}
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
  onCodeChange = (newCode) => {
    this.setState({draftCode: newCode, dirty: true})
  }
  onUpdate = (e) => {
    e.preventDefault()
    this.props.onUpdate({
      'code': this.state.draftCode
    }, () => {
      this.setState({ dirty: false })
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {
  postJobRun,
  fetchJobRuns,
  fetchJobRunsWithRepeat,
  fetchNode,
  fetchNodes,
  updateJobRun,
})(JobDetails)
