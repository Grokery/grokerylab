import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './ReactComponent.css'

class ReactComponent extends Component {
  static propTypes = {
    foo: PropTypes.string.isRequired, 
    bar: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
      this.state = {
          example: false
      }
  }
  render() {
    const { foo, bar } = this.props
    return (
      <div className='template'></div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(ReactComponent)
