import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


class ContentEditable extends Component {
  static propTypes = {
      type: PropTypes.string,
      value: PropTypes.string,
      onChange: PropTypes.func
  }
  shouldComponentUpdate(nextProps) {
      return nextProps.value !== ReactDOM.findDOMNode(this).innerText.trim()
  }
  emitChange() {
    const { onChange } = this.props
    var value = ReactDOM.findDOMNode(this).innerText.trim()
    if (onChange && value !== this.lastValue) {
        onChange({
            target: {
                value: value
            }
        });
    }
    this.lastValue = value
  }
  render() {
    var options = {
        className: this.props.className,
        // onInput: this.emitChange.bind(this),
        onBlur: this.emitChange.bind(this),
        contentEditable: true,
        dangerouslySetInnerHTML: {__html: this.props.value}
    }
    if (this.props.type === "h1") {
        return React.DOM.h1(options)
    } else if (this.props.type === "p") {
        return React.DOM.p(options)
    } else if (this.props.type === "pre") {
        return React.DOM.pre(options)
    } else {
        return React.DOM.div(options)
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(ContentEditable)
