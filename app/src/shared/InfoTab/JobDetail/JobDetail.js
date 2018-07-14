import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './JobDetail.css'

class JobDetail extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }
  toggleIsActive(e) {
    const { node } = this.props
    node.schedule.isActive = !node.schedule.isActive
    // this.setState({'node': node})
    this.props.onUpdate({'schedule': node.schedule})
  }
  onRunControleChange(e) {
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
                        <option>Day</option>
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
                    <button className="run-btn form-control"><i className="fa fa-play" aria-hidden="true"></i></button>
                </div>
            </div>
        )
    }
  }
  render() {
    const { node } = this.props
    if (!node) { return <div></div> }
    return (
        <div className="job-detail">
            <div className="row">
                <div className="col-md-3 form-group run-control-select">
                    <label>Run</label>
                    <select className="form-control" value={this.props.node.runControl} onChange={this.onRunControleChange.bind(this)}>
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
                            <tr>
                                <td>2017-05-31 11:26</td>
                                <td></td>
                                <td><span className="label label-info">Scheduled</span></td>
                            </tr>
                            <tr>
                                <td>2017-05-31 10:26</td>
                                <td>2017-05-31 10:26</td>
                                <td><span className="label label-danger">Error</span></td>
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
            </div>

        </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId] || {}
  }
}

export default connect(mapStateToProps, {})(JobDetail)
