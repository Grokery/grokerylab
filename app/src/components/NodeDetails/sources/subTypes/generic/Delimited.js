import { connect } from 'react-redux'

import { Text } from './Text';

class Delimited extends Text {
  constructor(props) {
    super(props)
    this.sourceTypeLabel = 'Delimited Data'
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(Delimited)
