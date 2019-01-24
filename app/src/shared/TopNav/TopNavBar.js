import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { isAuthenticated, getSessionInfo } from 'authentication'

import './TopNavBar.css'

class TopNavBar extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.func.isRequired,
        cloudName: PropTypes.string
    }
    hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    toggleDropDown() {
        var toggle = document.getElementById('nav-dropdown');
        if (this.hasClass(toggle, 'open')) {
            toggle.classList.remove("open")
        } else {
            toggle.classList.add("open")
        }
    }
    closeDropDown() {
        document.getElementById('nav-dropdown').classList.remove("open")
    }
    render() {
        return (
            <nav id='top-nav-wrapper' className='navbar navbar-default navbar-fixed-top' role='navigation'>
                <div id='top-menu-wrapper'>
                    <div className='navbar-header'>
                        {/* <a className='navbar-brand' href='#'><img alt="" src="./img/logo-white-on-clear.png"></img></a> */}
                        <a className='navbar-brand' href='#' style={{paddingTop:'15px', paddingLeft:'15px', paddingRight:'15px', height: '50px'}}>Fubitz</a>
                    </div>
                    {this.getRightNav()}
                </div>
            </nav>
        )
    }
    onClick = (e) => {
        document.getElementById('nav-dropdown').classList.remove("open")
    }
    getRightNav() {
        const { isAuthenticated } = this.props
        if (!isAuthenticated()) {
            return null
        }
        return (
            <ul id='top-right-nav-options' className={'nav navbar-top-links navbar-right pull-right'}>
                <li id='nav-dropdown'>
                    <a className='dropdown-toggle' onClick={() => this.toggleDropDown()}>
                        <i className='fa fa-user fa-fw'></i>
                        <i className='fa fa-caret-down'></i>
                    </a>
                    <ul className='dropdown-menu dropdown-user pull-right' onMouseLeave={() => this.closeDropDown()}>
                        <li><a href='#/' onClick={this.onClick}><i className='fa fa-home fa-fw'></i><span>Home</span></a></li>
                        <li><a href='#/account' onClick={this.onClick}><i className='fa fa-user fa-fw'></i><span>Account</span></a></li>
                        <li><a href='#/signout' onClick={this.onClick}><i className='fa fa-sign-out fa-fw'></i><span>Sign Out</span></a></li>
                    </ul>
                </li>
            </ul>
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