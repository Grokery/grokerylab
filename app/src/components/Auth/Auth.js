import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { authenticate, isAuthenticated, disAuthenticate } from 'authentication'
import Loader from 'shared/Loader/Loader'
import './Auth.css'

class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLoading: false
    }
  }
  componentDidMount() {
    const { history } = this.props
    if (isAuthenticated()){
      disAuthenticate()
      history.push("/signin")
    }
  }
  render() {
    return (
      <div className='page-content auth' style={{backgroundColor: '#E1E3E5', position:'absolute',top:0,bottom:0,left:0,right:0}}>
        <div className="container signin-panel">
            <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4">
                <div className="panel panel-default paper">
       
                  <div className="panel-body" style={{position:'relative'}}>
                    <Loader show={this.state.showLoading}></Loader>
                    <form onSubmit={this.onSubmit}>
                      <fieldset>
                        <div className="form-group">
                          <input className="form-control" name="username" type="text" />
                        </div>
                        <div className="form-group">
                          <input className="form-control" name="password" type="password" />
                        </div>
                        <input className="btn btn-lg btn-primary btn-block" type="submit" value="Sign In" onClick={this.onSubmit.bind(this)} />
                      </fieldset>
                    </form>
                  </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  onSubmit = (e) => {
    e.preventDefault()
    this.setState({showLoading:true})
    let cb = () => {
      this.setState({showLoading:false})
    }
    let username = document.getElementsByName('username')[0].value
    let password = document.getElementsByName('password')[0].value
    authenticate(username, password, cb, cb)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default withRouter(connect(mapStateToProps, {})(Auth))
