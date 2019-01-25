import React, { Component } from 'react'
import { object, func, array } from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
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
class BrowserJsInfo extends Component {
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
                  <div className="col-md-12">
                      <table className="table table-hover">
                          <thead>
                              <tr>
                                  <th>User</th>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              {this.getJobRuns()}
                          </tbody>
                      </table>
                  </div>
              </div>
   
          </div>
      )
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
      jobRuns.forEach(jobRun => {
          results.push(
              <tr key={jobRun.jobrunId}>
                  <td>{jobRun.userContact}</td>
                  <td>{moment(jobRun.startTime).format('DD MMM YYYY')}</td>
                  <td>{moment(jobRun.startTime).format('HH:mm')}</td>
                  <td><span className={"label " + this.getRunLabelType(jobRun.runStatus)}>{jobRun.runStatus}</span></td>
              </tr>
          )
      });
      return results
    }
}
)
