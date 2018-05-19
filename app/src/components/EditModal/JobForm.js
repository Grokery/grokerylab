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
      subtype: document.getElementById('subtype').value
    }
    this.props.onUpdate(updates)
  }
  getOptions() {
    const { lookups } = this.props
    var items = []
    if (lookups.jobtypes) {
      items = lookups.jobtypes.map(function(item, index) {
        return <option key={index} value={item.name}>{item.description}</option>
      })
    }
    return items
  }
  render() {
    let { node } = this.props
    return (
      <form>
        <label>ETL Job Type</label>
        <select id="subtype" className="form-control" value={node.subtype ? node.subtype : ""} onChange={this.onChange.bind(this)}>
          <option value="">-- choose type --</option>
          {this.getOptions()}
        </select>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    lookups: state.lookups
  }
}

export default connect(mapStateToProps, {})(JobForm)

