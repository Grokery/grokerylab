import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSelectedCloudId, getSelectedCloudName, removeCloudFromSession } from '../../authentication'
import Loader from '../../shared/Loader/Loader'
import { deleteCloud } from '../../store/actions'

class Settings extends Component {
  constructor(props) {
    super(props)
      this.state = {
          working: false
      }
  }
  onSubmit(event) {
    this.setState({working: true})
    event.preventDefault()
    this.props.deleteCloud(getSelectedCloudId(), function (response, json) {
      if (response.ok) {
        removeCloudFromSession(getSelectedCloudName())
      } else {
        alert("Error deleteing cloud")
      }
      this.setState({working: false})
    })
  }
  render() {
    return (
      <div className='page-content padded'>
        <Loader show={this.state.working} />
        <h1>Settings</h1>
        <form>
          <button className="btn btn-danger" type='button' onClick={this.onSubmit.bind(this)}>Delete Cloud</button>
        </form>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {
  deleteCloud
})(Settings)
