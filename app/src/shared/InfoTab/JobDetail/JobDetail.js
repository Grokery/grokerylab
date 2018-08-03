import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { postJobRun, fetchJobRuns, fetchJobRunsWithRepeat } from 'store/actions'
import './JobDetail.css'

class JobDetail extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }
  componentDidMount() {
    const { fetchJobRuns, node } = this.props
    
    fetchJobRuns(node.nodeId, "?limit=10")
  }
  toggleIsActive(e) {
    const { node } = this.props
    node.schedule.isActive = !node.schedule.isActive
    // this.setState({'node': node})
    this.props.onUpdate({'schedule': node.schedule})
  }
  onRunControlChange(e) {
    const { node } = this.props
    node.runControl = e.currentTarget.value
    // this.setState({'node': node})
    this.props.onUpdate({'runControl': node.runControl})
  }
  runJob(e) {
      const { postJobRun, node, fetchJobRunsWithRepeat } = this.props
      postJobRun({
        "jobId": node.nodeId,
        "jobRunType": node.subType,
        "lambdaARN": node.lambdaARN,
        "args": {
            "cloudId": "123",
            "baseUrl": "https://566xhrt8dk.execute-api.us-west-2.amazonaws.com/dev/api/v0",
            "authorization":"eyJhbGciOiJIUzI1NiJ9.eyJjbG91ZElkIjoiMjg3ZGMxZGEtMjc4YS00NDIyLWI1NzEtNDcxZTgxNWFjN2E2IiwiY2xvdWRUeXBlIjoiQVdTIiwiY2xvdWROYW1lIjoiZnViaXR6IiwiY2xvdWRSb2xlIjoiYWRtaW4iLCJhd3NBY2Nlc3NLZXlJZCI6IkFLSUFJUVRYRENLS1VaTlRYUjVBIiwiYXdzU2VjcmV0S2V5IjoiN1hzWnRDTW4wd0tDYm55NmcyYUdwcmYxdmFLcWF1eVl1Nkc5Z2NVOCIsImF3c1JlZ2lvbiI6InVzLXdlc3QtMiIsImRhb1R5cGUiOiJEWU5BTU9EQiIsImlzcyI6Imh0dHBzOi8vYXBpLmdyb2tlcnkuaW8iLCJpYXQiOjE1MzE3ODUyODIsImV4cCI6MTUzMTgxNDA4Mn0.0bxnFjZI3wjKR5FPgGRpir-IJDmXmjv_50_7ug9dRNM"
        }
    }, function() {
        fetchJobRunsWithRepeat(node.nodeId, "?limit=10", null, [[1, 0.0, 5], [1, 2.0, 5]])
    })
  }
  getRunControl() {
    const { node } = this.props
    if (node.runControl === 'schedule') {
        return (
            <div className="run-control scheduled-run">
                <div className="col-md-3 form-group">
                    <label>Every</label>
                    <select className="form-control">
                        <option>Minute</option>
                        <option>Hour</option>
                        <option selected>Day</option>
                        <option>Week</option>
                        <option>Month</option>
                    </select>
                </div>
                <div className="col-md-3 form-group">
                    <label>Starting</label>
                    <input className="form-control"/>
                </div>
                <div className="col-md-3 form-group">
                    <label>Active</label>
                    <div className='is-active-switch'>
                        <label className="switch">
                            <input type="checkbox" onChange={this.toggleIsActive.bind(this)} checked={node.schedule.isActive} value />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        )
    } else if (node.runControl === 'event') {
        return (
            <div className="run-control event-run">
                <div className="col-md-4 form-group">
                    <label>Event</label>
                    <select className="form-control">
                        <option>Upstream File Write</option>
                        <option>Custom Event</option>
                    </select>
                </div>
            </div>
        )
    } else {
        return (
            <div className="run-control manual-run">
                <div className="col-md-2">
                    <label>Run Now</label>
                    <button className="run-btn form-control" onClick={this.runJob.bind(this)}>
                        <i className="fa fa-play" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        )
    }
  }
  getRunLabelType(status) {
      if (status === "COMPLETED") {
        return "label-success"
      } else if (status === "ERRORED") {
        return "label-danger"
      } else {
        return "label-default"
      }
  }
  getJobRuns() {
    const { jobRuns } = this.props
    let results = []
    jobRuns.forEach(element => {
        results.push(
            <tr key={element.jobrunId}>
                <td>{element.startTime}</td>
                <td>{element.endTime}</td>
                <td><span className={"label "+this.getRunLabelType(element.runStatus)}>{element.runStatus}</span></td>
            </tr>
        )
    });
    return results
  }
  render() {
    const { node } = this.props
    if (!node) { return <div></div> }
    return (
        <div className="job-detail">
            <div className="row">
                <div className="col-md-3 form-group run-control-select">
                    <label>Run</label>
                    <select className="form-control" value={this.props.node.runControl} onChange={this.onRunControlChange.bind(this)}>
                        <option value='manual'>Manually</option>
                        <option value='schedule'>On Schedule</option>
                        <option value='event'>On Event</option>
                    </select>
                </div>
                {this.getRunControl()}
            </div>

            <div className="row">
                <div className="col-md-12">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Start time</th>
                                <th>End time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                                <td>2017-05-31 11:26</td>
                                <td></td>
                                <td><span className="label label-info">Scheduled</span></td>
                            </tr> */}
                            {this.getJobRuns()}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
        node: state.nodes[ownProps.params.nodeId] || {},
        jobRuns: state.jobruns[ownProps.params.nodeId] || []
    }
}

export default connect(mapStateToProps, {
    postJobRun,
    fetchJobRuns,
    fetchJobRunsWithRepeat
})(JobDetail)
