import React, { Component} from 'react'
import { Link } from 'react-router-dom'

import CreateEditCloudModel from 'shared/CreateEditCloudModel/CreateEditCloudModel'
import './TopNavBar.css'

export default class TopNavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showNewMenuDropDown: false,
            showUserMenuDropDown: false,
            showCreateModel: false,
        }
    }
    render() {
        const { showUserMenuDropDown, showNewMenuDropDown, showCreateModel } = this.state
        return (
            <nav id='top-nav-wrapper' className='navbar navbar-default navbar-fixed-top' role='navigation'>
                <div id='top-menu-wrapper'>
                    <div className='navbar-header'>
                        <a className='navbar-brand' href='https://grokery.io'><img alt="logo" src="/img/logo-white-on-clear.png"></img></a>
                        {/* <a className='navbar-brand' href='https://grokery.io'><h3 style={{paddingTop:12}}>Brand</h3></a> */}
                    </div>
                    <ul id='top-right-nav-options' className={'nav navbar-top-links'}>
                        <li title="Clouds" className='pull-left'>
                            <Link to={'/'}>
                                <i className='fa fa-cloud fa-fw'></i> Clouds
                            </Link>
                        </li>
                        <li className={'pull-right ' + (showUserMenuDropDown ? 'open' : '')}>
                            <button className='dropdown-toggle' onClick={this.toggleUserMenuDropDown}><i className='fa fa-user fa-fw'></i></button>
                            <ul className='dropdown-menu dropdown-user' onMouseLeave={this.closeDropdowns}>
                                <li><Link to='/account' onClick={this.closeDropdowns}><i className='fa fa-user fa-fw'></i><span>Account</span></Link></li>
                                <li><Link to='/signout' onClick={this.closeDropdowns}><i className='fa fa-sign-out fa-fw'></i><span>Sign Out</span></Link></li>
                            </ul>
                        </li>
                        <li className={'pull-right ' + (showNewMenuDropDown ? 'open' : '')}>
                            <button className='dropdown-toggle' onClick={this.toggleNewMenuDropDown}><i className='fa fa-plus fa-fw'></i></button>
                            <ul className='dropdown-menu dropdown-user' onMouseLeave={this.closeDropdowns}>
                                <li><Link to='/' onClick={this.toggleCreateModal}><i className='fa fa-cloud fa-fw'></i><span>New Cloud</span></Link></li>
                                <li><Link to='/' onClick={this.closeDropdowns}><i className='fa fa-user fa-fw'></i><span>New User</span></Link></li>
                                <li><Link to='/' onClick={this.closeDropdowns}><i className='fa fa-users fa-fw'></i><span>New Team</span></Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>            
                <CreateEditCloudModel 
                key="createnew" 
                shown={showCreateModel} 
                toggleShown={this.toggleCreateModal} 
                modalTitle={"Create New Cloud"}
                isCreate={true}
                />
            </nav>
        )
    }
    closeDropdowns = () => {
        this.setState({showUserMenuDropDown: false, showNewMenuDropDown: false})
    }
    toggleUserMenuDropDown = () => {
        this.setState({showUserMenuDropDown: !this.state.showUserMenuDropDown, showNewMenuDropDown: false})
    }
    toggleNewMenuDropDown = () => {
        this.setState({showUserMenuDropDown: false, showNewMenuDropDown: !this.state.showNewMenuDropDown})
    }
    toggleCreateModal = () => {
        this.setState({showUserMenuDropDown: false, showNewMenuDropDown: false, showCreateModel: !this.state.showCreateModel})
    }
}