import React, { Component } from 'react'
import { connect } from 'react-redux'
import { removeCloudFromSession } from 'authentication'
import Loader from 'shared/Loader/Loader'
import { deleteCloud } from 'store/actions'

// TODO move the delete into CreateEditCloudModel and edit settings from home page

class Settings extends Component {
  constructor(props) {
    super(props)
      this.state = {
          working: false
      }
  }
  onClick = (event) => {
    const { params } = this.props
    this.setState({working: true})
    event.preventDefault()
    this.props.deleteCloud(params.cloudName, function (response, json) {
      if (response.ok) {
        removeCloudFromSession(params.cloudName)
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
        <h1>Users</h1>
        <div><p>add / remove / modify users</p></div>
        <hr />
        <div>
          <h1></h1>
          <form>
            <button className="btn btn-danger" type='button' onClick={this.onClick}>Delete Cloud</button>
          </form>
        </div>
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
