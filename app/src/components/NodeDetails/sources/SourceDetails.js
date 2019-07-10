import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RawText from './subTypes/generic/Text'
import Json from './subTypes/generic/Json'
import Delimited from './subTypes/generic/Delimited'
import AWSS3 from './subTypes/AWSS3'

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
      return <RawText {...this.props} />
    } else if (node.subType === 'DELIMITED') {
      return <Delimited {...this.props} />
    } else if (node.subType === 'JSON') {
      return <Json {...this.props} />
    } else if (node.subType === 'AWSS3') {
      return <AWSS3 {...this.props} />
    } else {
      return <RawText {...this.props} />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(SourceDetails)
