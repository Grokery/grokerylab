import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NODETYPE } from 'common'

class Sources extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }
  render() {
    const { items, params } = this.props
    var links = []
    if (items.length !== 0) {
      links = items.map(function(item, index) {
          return (<li key={index}><a href={'#/clouds/'+params.cloudName+'/nodes/'+item.nodeType.toLowerCase()+'/'+item.nodeId}>{item.title}</a></li>)
      })
    }
    return (
      <div className='page-content'>
        <h1>Sources</h1>
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
  let sources = []
  Object.keys(state.nodes).forEach(function(key){
    let node = state.nodes[key]
    if (node.nodeType === NODETYPE.SOURCE){
      sources.push(node)
    }
  })
  return {
    items: sources
  }
}

export default connect(mapStateToProps, {
})(Sources)
