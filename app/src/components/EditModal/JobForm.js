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
  render() {
    let { lookups, node } = this.props
    console.log(lookups.jobtypes)
    return (
      <form>
        <label>ETL Job Type</label>
        <select id="type" className="form-control" value={node.type ? node.type : ""} onChange={this.onChange.bind(this)}>
          <option>-- choose type --</option>
          <option value="Shell Script">Shell Script</option>
          <option value="MySql Script">MySql Script</option>
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

