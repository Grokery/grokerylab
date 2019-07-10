import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat, assign, cloneDeep } from 'lodash'

import { getCloudId, getCloudToken, getSessionInfo, getCloudBaseUrl } from 'authentication'
import { fetchNode, fetchNodes } from 'store/actions/nodes'
import { postJobRun, fetchJobRuns, fetchJobRunsWithRepeat, updateJobRun } from 'store/actions/jobruns'
import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import InfoTab from 'shared/InfoTab/InfoTab'
import LogsTab from 'shared/LogsTab/LogsTab'
import PlaceholderInfo from './infoTabs/PlaceholderInfo'
import BrowserJsInfo from './infoTabs/BrowserJsInfo'
import AwsLambdaInfo from './infoTabs/AwsLambdaInfo'
import JobForm from './editModal/JobForm'
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
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) { // 83='s'
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
          <Panel title={node.title}>
            {this.renderRightMenuOptions()}
            {this.getJobCodeComponent(commonProps)}
          </Panel>
          <Panel title='Info'>
            {this.renderRightMenuOptions()}
            {this.getJobInfoComponent(commonProps)}
          </Panel>
          <Panel title='History'>
            {this.renderRightMenuOptions()}
            <LogsTab {...commonProps}></LogsTab>
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
  renderRightMenuOptions() {
    return (
      <div className='btn-group item-options' style={{position: 'absolute', right: 0, top: 0}}>
          {this.getRightMenuOptions()}
      </div>
    )
  }
  getRightMenuOptions = () => {
    const { node } = this.props
    let runOption = null
    if (node.subType !== 'GENERIC') {
      // TODO move to left panel ...
      runOption = <button key='run' disabled={this.state.dirty} onClick={this.runJob} className='btn btn-default'><i className='fa fa-play'></i></button>
    }
    return concat([
      <button key='save' disabled={!this.state.dirty} onClick={this.onUpdate} className='btn btn-default'><i className='fa fa-save'></i></button>,
      runOption,
      <button key='edit' onClick={this.toggleEditDialog} className='btn btn-default'><i className='fa fa-cog'></i></button>,
    ], this.props.rightMenuOptions)
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

      document.getElementById("iframe-console-pre").innerHTML = "";
      iframe.contentWindow.console.log = (logData) => {
        let el = document.createElement('div');
        el.innerHTML = `> ${JSON.stringify(logData, null, 2)}`;
        document.getElementById("iframe-console-pre").appendChild(el);
      }

      iframe.contentWindow.document.open()
      iframe.contentWindow.document.write(this.getHelperCode())
      iframe.contentWindow.document.write('<script>'+cloneDeep(node.code)+'</script>')
      iframe.contentWindow.document.close()

      postJobRun(params.cloudName, {nodeId: node.nodeId, jobRunType: node.subType, runStatus: "COMPLETED", userContact: userEmail}, () => {
        fetchJobRunsWithRepeat(params.cloudName, "?nodeId="+node.nodeId+"&limit=5", null, [[0, 0.0, 1]])
      })
    }
    catch (e) {
      postJobRun(params.cloudName, {nodeId: node.nodeId, jobRunType: node.subType, runStatus: "ERRORED", userContact: userEmail}, () => {
        fetchJobRunsWithRepeat(params.cloudName, "?nodeId="+node.nodeId+"&limit=5", null, [[0, 0.0, 1]])
      })
    }
  }
  getHelperCode() {
    const { params } = this.props
    let url = getCloudBaseUrl(params.cloudName) + '/clouds/' + getCloudId(params.cloudName) + '/nodes/source/'
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
      nodeId: node.nodeId,
      jobRunType: node.subType,
      lambdaARN: node.lambdaARN,
      args: {
          baseUrl: getCloudBaseUrl(params.cloudName),
          authorization: getCloudToken(params.cloudName),
      }
    }, () => {
        fetchJobRunsWithRepeat(params.cloudName, "?nodeId="+node.nodeId+"&limit=5", null, [[1, 0.0, 5], [1, 2.0, 5]])
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
