import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setSelectedCloud } from '../authentication'
import { fetchNodes, clearNodes, fetchLookupData } from '../actions'

class Cloud extends Component {
  static propTypes = {
    cloudId: PropTypes.string.isRequired,
    fetchNodes: PropTypes.func.isRequired,
    clearNodes: PropTypes.func.isRequired,
    fetchLookupData: PropTypes.func.isRequired
  }
  render() {
    const { cloudId } = this.props
    setSelectedCloud(cloudId)
    return (
      <div>
        <div className='sidebar-page'>
          {this.props.children}
        </div>
      </div>
    )
  }
  componentDidMount(){
    const { fetchNodes, clearNodes, fetchLookupData } = this.props
    clearNodes()
    fetchNodes()
    fetchLookupData()
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cloudId: ownProps.params.cloudId
  }
}

export default connect(mapStateToProps, {
  fetchNodes,
  clearNodes,
  fetchLookupData
})(Cloud)
