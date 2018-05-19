import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class JobInfo extends Component {
  static propTypes = {
    node: PropTypes.object,
    params: PropTypes.object
  }
  render() {
    const { node } = this.props
    if (!node) { return <div></div> }
    return (
        <div>
            {/*<hr />*/}
            {/*<h2>Config:</h2>*/}
            {/*<div className="row config-row">
                <div className="col-md-5 form-inline form-group">
                    <label>Job type</label>
                    <select className="form-control">
                        <option>Shell Script</option>
                        <option>SQL Stored Procedure</option>
                        <option>AWS Redshift Sproc</option>
                        <option>AWS Data Pipeline</option>
                        <option>AWS Lambda</option>
                        <option>Azure USQL Sproc</option>
                        <option>Azure Data Factory</option>
                        <option>Azure Function</option>
                    </select>
                </div>
                <div className="col-md-4 form-inline form-group">
                    <label>Schedule</label>
                    <select className="form-control">
                        <option>Hourly</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label>Run Now</label>
                    <a className="btn"><i className="fa fa-play" aria-hidden="true"></i></a>
                </div>
            </div>*/}
            {/*<hr />*/}
            {/*<h2>Run History:</h2>*/}
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Start time</th>
                        <th>End time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2017-05-31 10:26</td>
                        <td>2017-05-31 10:26</td>
                        <td><span className="label label-success">Finished</span></td>
                    </tr>
                    <tr>
                        <td>2017-05-31 10:26</td>
                        <td>2017-05-31 10:26</td>
                        <td><span className="label label-warning">Finished</span></td>
                    </tr>
                    <tr>
                        <td>2017-05-31 10:26</td>
                        <td>2017-05-31 10:26</td>
                        <td><span className="label label-success">Finished</span></td>
                    </tr>
                    <tr>
                        <td>2017-05-31 10:26</td>
                        <td>2017-05-31 10:26</td>
                        <td><span className="label label-success">Finished</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(JobInfo)
