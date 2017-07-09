import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNode } from '../../actions'
import ContentEditable from '../ContentEditable/ContentEditable'
import IChart from '../IChart/IChart'
import SchemaExplorer from '../SchemaExplorer/SchemaExplorer'
import Comments from '../Comments/Comments'
import './InfoTab.css'

class InfoTab extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    fetchNode: PropTypes.func.isRequired
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.node && this.props.node && 
        (nextProps.node.id !== this.props.node.id ||
        nextProps.node.title !== this.props.node.title ||
        nextProps.node.description !== this.props.node.description)
    ) {
        return true
    } else if (!nextProps.node || !this.props.node) {
        return true
    }
    return false
  }
  getItemDetailSection() {
      const { node, params } = this.props
    if (node.collection === "charts") {
        return (
            <div>
                {/*<div className="config-row">
                    <div className="row">
                        <div className="col-md-12 form-inline form-group">
                            <label>Chart type</label>
                            <select className="form-control">
                                <option>C3</option>
                                <option>HTML/JS/CSS</option>
                            </select>
                        </div>
                    </div>
                </div>*/}
                <IChart
                    key={Math.random()}
                    id={node.id}
                    params={params}
                    height={350}
                    width={600}
                ></IChart>
            </div>
        )
    } else if (node.collection === "datasources") {
        return (
            <div>
                {/*<div className="config-row">
                    <div className="row">
                        <div className="col-md-12 form-inline form-group">
                            <label>Datasource type</label>
                            <select className="form-control">
                                <option>File(s)</option>
                                <option selected>MySql</option>
                                <option>MSSql</option>
                                <option>PostgreSql</option>
                                <option>MongoDB</option>
                                <option>AWS S3</option>
                                <option>AWS DynamoDB</option>
                                <option>AWS Redshift</option>
                                <option>Azure Blob Storage</option>
                                <option>Azure Data Lake Store</option>
                                <option>Azure SQL Data Warehouse</option>
                            </select>
                        </div>
                    </div>
                </div>*/}
                <SchemaExplorer datasource={node}></SchemaExplorer>
            </div>
        )
    } else if (node.collection === "jobs") {
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
    } else {
        return (<div></div>)
    }
  }
  handleTitleChange(e) {
      this.props.onUpdate({'title': e.target.value})
  }
  handleDescriptionChange(e) {
      this.props.onUpdate({'description': e.target.value})
  }
  render() {
    const { node, params } = this.props
    if (!node) { return <div></div> }
    return (
        <div className='info-tab'>
            <div className='col-md-6'>
                <ContentEditable type='h1' className="node-title" value={node.title} onChange={this.handleTitleChange.bind(this)}></ContentEditable>
                <ContentEditable type='p' className="node-description" value={node.description} onChange={this.handleDescriptionChange.bind(this)}></ContentEditable>
                <div className="node-detail-section">
                    {this.getItemDetailSection()}
                </div>
            </div>
            <div className='col-md-6'>
                <Comments nodeId={params.nodeId}></Comments>
            </div>
        </div>
    )
  }
  componentDidMount() {
    const { fetchNode, params } = this.props
    fetchNode(params.collection, params.nodeId)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {
    fetchNode
})(InfoTab)