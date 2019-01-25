import React, { Component } from 'react'
import { object, func, array } from 'prop-types'
import { connect } from 'react-redux'

import { fetchJobRuns } from 'store/actions'

import './AwsLambdaInfo.css'

export default connect(
    (state, ownProps) => {
        return {
            node: state.nodes[ownProps.params.nodeId] || {},
            jobRuns: state.jobruns[ownProps.params.nodeId] || [],
        }
    }, 
    {
        fetchJobRuns,
    }
)(
class AwsLambdaInfo extends Component {
    static propTypes = {
      params: object.isRequired,
      onUpdate: func.isRequired,

      node: object.isRequired,
      jobRuns: array.isRequired,
    }
    componentDidMount() {
      const { fetchJobRuns, node, params } = this.props
      fetchJobRuns(params.cloudName, "?jobId="+node.nodeId+"&limit=5")
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
                                  {/* <th>Version</th> */}
                                    <th>Run Type</th>
                                    <th>User</th>
                                    <th>Start Time</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <td>Schedule</td>
                                    <td>Aug 3, 2018, 11:00 PM</td>
                                    <td></td>
                                    <td><span className="label label-default">STAGED</span></td>
                                </tr> */}
                                {this.getJobRuns()}
                            </tbody>
                        </table>
                    </div>
                </div>
     
            </div>
        )
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
                      <label>Until</label>
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
      } else {
          return (
              <div className="run-control manual-run">
                  <div className="col-md-2">
                      <label>Run Now</label>
                      <button className="run-btn form-control" onClick={this.props.runJob}>
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
          let startTime = new Date(element.startTime)
          let endTime = new Date(element.endTime)
          let difference = endTime - startTime
          difference = difference ? (difference / 1000).toFixed(0) + 's' : '-'
          results.push(
              <tr key={element.jobrunId}>
                  {/* <td>v0</td> */}
                  <td>Manual</td>
                  <td>{element.userContact}</td>
                  {/* <td>{startTime.toLocaleTimeString("en-us", dateOptions)}</td> */}
                  {/* <td>{element.startTime}</td> */}
                  <td>{element.startTime}</td>
                  <td>{difference}</td>
                  <td><span className={"label " + this.getRunLabelType(element.runStatus)}>{element.runStatus}</span></td>
              </tr>
          )
      });
      return results
    }
}
)
