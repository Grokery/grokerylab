import { connect } from 'react-redux'

import { Text } from './Text';

class Delimited extends Text {
  getSubTypeInfo = () => {
    return "delimited"
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(Delimited)
