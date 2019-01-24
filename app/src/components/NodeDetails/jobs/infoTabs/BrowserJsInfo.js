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
class BrowserJsInfo extends Component {
    static propTypes = {
      params: object.isRequired,
      onUpdate: func.isRequired,

      node: object.isRequired,
      jobRuns: array.isRequired,
    }
    componentDidMount() {
      const { fetchJobRuns, node, params } = this.props
      
      fetchJobRuns(params.cloudName, "?jobId="+node.nodeId+"&limit=10")
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
                  <td>dhogue</td>
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
                                  <th>Run Type</th>
                                  <th>User</th>
                                  <th>Start Time</th>
                                  <th>Duration</th>
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
}
)
