import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NODETYPE } from 'common'

class Jobs extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }
  render() {
    const { items, params } = this.props
    var links = []
    if (items.length !== 0) {
      links = items.map(function(item, index) {
          return (<li key={index}><a href={'#/clouds/'+params.cloudName+'/'+item.nodeType.toLowerCase()+'/'+item.nodeId}>{item.title}</a></li>)
      })
    }
    return (
      <div className='page-content'>
        <h1>Jobs</h1>
        <ul>
          {links}
        </ul>
        {/*<pre>{JSON.stringify(items, null, 2)}</pre>*/}
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let jobs = []
  Object.keys(state.nodes).forEach(function(key){
    let node = state.nodes[key]
    if (node.nodeType === NODETYPE.JOB){
      jobs.push(node)
    }
  })
  return {
    items: jobs
  }
}

export default connect(mapStateToProps, {
})(Jobs)