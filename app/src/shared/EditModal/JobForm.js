import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class JobForm extends Component {
  static propTypes = {
    options: PropTypes.object,
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
    const { options } = this.props
    var items = []
    if (options.jobtypes) {
      items = Object.keys(options.jobtypes).map(function(key, index) {
        // items.push(<option key={index} value={key}>{options.jobtypes[key]}</option>)
        return (<option key={index} value={key}>{options.jobtypes[key]}</option>)
      })
    }
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
    options: state.options
  }
}

export default connect(mapStateToProps, {})(JobForm)

