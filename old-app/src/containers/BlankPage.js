import React, { Component } from 'react'
import { connect } from 'react-redux'

class Blank extends Component {
  render() {
    return (
      <div className='page-content'>
        <p>(Blank page)</p>
        {/*<pre>
          {this.props.params.cloudId}
        </pre>
        <pre>
          {this.props.params.nodeId}
        </pre>*/}
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(Blank)
