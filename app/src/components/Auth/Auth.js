import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { authenticate, isAuthenticated, disAuthenticate } from '../../authentication'
import { history } from '../../index.js'
import './Auth.css'

class Auth extends Component {
  static propTypes = {
    authenticate: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.func.isRequired,
    disAuthenticate: PropTypes.func.isRequired
  }
  componentWillMount() {
    const { isAuthenticated, disAuthenticate} = this.props
    if (isAuthenticated()){
      disAuthenticate()
      history.push("/")
    }
  }
  onSubmit(event) {
    event.preventDefault()
    const { authenticate } = this.props
    let username = document.getElementsByName('email')[0].value
    let password = document.getElementsByName('password')[0].value
    authenticate(username, password)
  }
  render() {
    return (
      <div className='page-content auth'>
        <div className="container signin-panel">
            <div className="row">
            <div className="col-md-4 col-md-offset-4">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <span>GrokeryLab</span>
                    {/* <span className="pull-right"><a href='https://grokery.io'>sign up</a> | <a href="https://grokery.io">reset pass</a></span> */}
                </div>
                  <div className="panel-body">
                    <form role="form" onSubmit={this.onSubmit.bind(this)}>
                      <fieldset>
                        <div className="form-group">
                          <input className="form-control" name="email" type="text" />
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
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    authenticate: authenticate,
    isAuthenticated: isAuthenticated,
    disAuthenticate: disAuthenticate
  }
}

export default connect(mapStateToProps, {

})(Auth)
