import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class SourceForm extends Component {
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
  getOptions() {
    // const { lookups } = this.props
    var items = []
    // if (lookups.sourcetypes) {
    //   items = lookups.sourcetypes.map(function(item, index) {
    //     return <option key={index} value={item.name}>{item.description}</option>
    //   })
    // }
    return items
  }
  render() {
    let { node } = this.props
    return (
      <form>
        <label>Data Source Type</label>
        <select id="type" className="form-control" value={node.type} onChange={this.onChange.bind(this)}>
          <option>-- choose type --</option>
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

export default connect(mapStateToProps, {})(SourceForm)
