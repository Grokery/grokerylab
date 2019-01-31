import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Generic from './subTypes/Generic'
import JsonData from './subTypes/JsonData'
import Delimited from './subTypes/Delimited'


class SourceDetails extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    reloadData: PropTypes.func.isRequired,
    rightMenuOptions: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
  }
  render() {
    const { node } = this.props
    if (node.subType === 'GENERIC') {
      return <Generic {...this.props} />
    } else if (node.subType === 'DELIMITED') {
      return <Delimited {...this.props} />
    } else if (node.subType === 'JSON') {
      return <JsonData {...this.props} />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(SourceDetails)
