import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AUTH_ENABLED } from '../../globals'
import { isAuthenticated, getSessionInfo } from '../../authentication'
import StatusIndicator from '../StatusIndicator/StatusIndicator'
import './TopNavBar.css'

class TopNavBar extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.func.isRequired
    }
    HasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    ToggleDropDown(e) {
        var toggle = document.getElementById('nav-dropdown');
        if (this.HasClass(toggle, 'open')) {
            toggle.classList.remove("open")
            e.target.setAttribute('area-expanded', false)
        } else {
            toggle.classList.add("open")
            e.target.setAttribute('area-expanded', true)
        }
    }
    getCloudName() {
        const { getSessionInfo } = this.props
        let cloudName = "GLab"
        if (
            getSessionInfo() && 
            getSessionInfo()['selectedCloud']
        ) {
            cloudName += " | " + getSessionInfo()['selectedCloud'].name
        }
        return cloudName
    }
    render() {
        const { isAuthenticated } = this.props
        let showRightNav = isAuthenticated() ? "" : "hidden"
        let showAccount = AUTH_ENABLED ? "" : "hidden"
        return (
            <nav id='top-nav-wrapper' className='navbar navbar-default navbar-fixed-top' role='navigation'>
                <div id='top-menu-wrapper'>
                    <div className='navbar-header'>
                        <a id='menu-toggle' className='navbar-brand' href='#'><i className='fa fa-bars'></i></a>
                        {/* <a className='navbar-brand' href='#'><img src="logo-inverse.png"></img></a> */}
                        <a className='navbar-brand' href='#'>{this.getCloudName()}</a>
                    </div>
                    <ul id='top-right-nav-options' className={'nav navbar-top-links navbar-right pull-right '+showRightNav}>
                        <StatusIndicator></StatusIndicator>
                        <li id='nav-dropdown' className={showAccount}>
                            <a className='dropdown-toggle' onClick={(e) => this.ToggleDropDown(e)}>
                                <i className='fa fa-user fa-fw' style={{'pointerEvents':'none'}}></i>
                                <i className='fa fa-caret-down' style={{'pointerEvents':'none'}}></i>
                            </a>
                            <ul className='dropdown-menu dropdown-user pull-right'>
                                <li>
                                    <a href='#/' onClick={(e) => this.ToggleDropDown(e)}>
                                        <i className='fa fa-home fa-fw'></i>
                                        <span>Home</span>
                                    </a>
                                </li>
                                <li>
                                    <a href='#/account' onClick={(e) => this.ToggleDropDown(e)}>
                                        <i className='fa fa-user fa-fw'></i>
                                        <span>Account</span>
                                    </a>
                                </li>
                                <li>
                                    <a href='#/signout' onClick={(e) => this.ToggleDropDown(e)}>
                                        <i className='fa fa-sign-out fa-fw'></i>
                                        <span>Sign Out</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: isAuthenticated,
    getSessionInfo: getSessionInfo
  }
}

export default connect(mapStateToProps, {

})(TopNavBar)