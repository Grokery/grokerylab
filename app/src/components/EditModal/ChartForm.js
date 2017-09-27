import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ChartForm extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired
  }
  onChange() {
    let updates = {
      type: document.getElementById('type').value
    }
    this.props.onUpdate(updates)
  }
  render() {
    let { node } = this.props
    return (
      <form>
        <label>Chart Type</label>
        <select id="type" className="form-control" value={node.type} onChange={this.onChange.bind(this)}>
          <option>-- choose type --</option>
          <option value="HTML">HTML</option>
        </select>
      </form>
    )
  }
}
