import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import IChart from 'shared/IChart/IChart'

class ChartInfo extends Component {
  static propTypes = {
    node: PropTypes.object,
    params: PropTypes.object
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.node || !this.props.node) {
        return true
    } else if (JSON.stringify(nextProps.node) !== JSON.stringify(this.props.node)) {
        return true
    }
    return false
  }
  render() {
    const { node, params } = this.props
    if (!node) { return <div></div> }
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
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(ChartInfo)
