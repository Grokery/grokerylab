import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SchemaExplorer from '../SchemaExplorer/SchemaExplorer'

class SourceInfo extends Component {
  static propTypes = {
    node: PropTypes.object,
    params: PropTypes.object
  }
  render() {
    const { node, params } = this.props
    if (!node) { return <div></div> }
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
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(SourceInfo)
