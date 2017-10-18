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
      type: document.getElementById('type').value
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
        <select id="type" className="form-control" value={node.type ? node.type : ""} onChange={this.onChange.bind(this)}>
          <option>-- choose type --</option>
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

