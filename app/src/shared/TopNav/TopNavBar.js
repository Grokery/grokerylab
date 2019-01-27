import React, { Component} from 'react'
import { Link } from 'react-router-dom'

import './TopNavBar.css'

export default class TopNavBar extends Component {
    render() {
        return (
            <nav id='top-nav-wrapper' className='navbar navbar-default navbar-fixed-top' role='navigation'>
                <div id='top-menu-wrapper'>
                    <div className='navbar-header'>
                        <Link className='navbar-brand' to='/'><img alt="logo" src="/img/logo-white-on-clear.png"></img></Link>
                        {/* <Link className='navbar-brand' to='/' style={{paddingTop:'15px', paddingLeft:'15px', paddingRight:'15px', height: '50px'}}>Grokery</Link> */}
                    </div>
                    {this.getRightNav()}
                </div>
            </nav>
        )
    }
    getRightNav() {
        return (
            <ul id='top-right-nav-options' className={'nav navbar-top-links navbar-right pull-right'}>
                <li id='nav-dropdown'>
                    <button className='dropdown-toggle' onClick={() => this.toggleDropDown()}>
                        <i className='fa fa-user fa-fw'></i>
                        <i className='fa fa-caret-down'></i>
                    </button>
                    <ul className='dropdown-menu dropdown-user pull-right' onMouseLeave={() => this.closeDropDown()}>
                        <li><Link to='/' onClick={this.onClick}><i className='fa fa-home fa-fw'></i><span>Home</span></Link></li>
                        <li><Link to='/account' onClick={this.onClick}><i className='fa fa-user fa-fw'></i><span>Account</span></Link></li>
                        <li><Link to='/signout' onClick={this.onClick}><i className='fa fa-sign-out fa-fw'></i><span>Sign Out</span></Link></li>
                    </ul>
                </li>
            </ul>
        )
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
    onClick = (e) => {
        document.getElementById('nav-dropdown').classList.remove("open")
    }
}