import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class JobForm extends Component {
  static propTypes = {
    lookups: PropTypes.object,
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired
  }
  onChange() {
    let updates = {
      subType: document.getElementById('subType').value
    }
    this.props.onUpdate(updates)
  }
  getOptions() {
    // const { lookups } = this.props
    var items = []
    // if (lookups.jobtypes) {
    //   Object.keys(lookups.jobtypes).map(function(key, index) {
    //     items.push(<option key={index} value={key}>{lookups.jobtypes[key]}</option>)
    //   })
    // }
    return items
  }
  render() {
    let { node } = this.props
    return (
      <form>
        <label>ETL Job Type</label>
        <select id="subType" className="form-control" value={node.subType ? node.subType : ""} onChange={this.onChange.bind(this)}>
          <option value="">-- choose type --</option>
          {this.getOptions()}
        </select>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    lookups: state.cloudDetails ? state.cloudDetails.lookups : {}
  }
}

export default connect(mapStateToProps, {})(JobForm)

