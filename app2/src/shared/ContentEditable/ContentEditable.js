import React from 'react'
import { Component } from 'react'
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
        onBlur: this.emitChange.bind(this),
        contentEditable: true,
        dangerouslySetInnerHTML: {__html: this.props.value}
    }
    if (this.props.type === "h1") {
        return <h1 {...options}></h1>
    } else if (this.props.type === "p") {
        return <p {...options}></p>
    } else if (this.props.type === "pre") {
        return <pre {...options}></pre>
    } else {
        return <div {...options}></div>
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(ContentEditable)
