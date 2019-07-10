import { connect } from 'react-redux'
import 'brace/mode/json'

import { Text } from './Text';

class Json extends Text {
  constructor(props) {
    super(props)
    this.mode = 'json'
    this.sourceTypeLabel = 'Json Data'
    this.state = {
      shown: false,
      dirty: false,
      dataDraft: JSON.stringify(props.node.jsonData, null, 2),
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({dataDraft: JSON.stringify(nextProps.node.jsonData, null, 2)}, () => {
      // editor.scrollToLine(0, true, true, () => {});
      // editor.gotoLine(0, 0, true);
    })
  }
  onUpdate = (e) => {
    e.preventDefault()
    let newdata = null
    try {
      newdata = JSON.parse(this.state.dataDraft)
    } catch (e) {
      console.log(e)
      return
    }
    this.props.onUpdate({
      'jsonData': newdata,
    }, () => {
      this.setState({ dirty: false })
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(Json)
