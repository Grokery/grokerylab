import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './SideNavBar.css'

export default class SideNavBar extends Component {
    static propTypes = {
        cloudName: PropTypes.string.isRequired
    }
    render() {
        const { cloudName } = this.props
        let basepath = '/clouds/' + cloudName
        return (
            <div id='side-menu-wrapper' className='navbar-default sidebar paper' role='navigation'>
                <div className='sidebar-nav navbar-collapse'>
                    <ul id='side-menu' className='nav'>
                        <li title="Home">
                            <Link to={'/'}>
                                <i className='fa fa-home fa-fw'></i>
                                <span className='side-menu-link-text'>Home</span>
                            </Link>
                        </li>
                        {/* <hr className='sidebar-section-devider'></hr> */}
                        <li title="DashBoards">
                            <Link to={basepath+'/boards'} className='sidebar-link'>
                                <i className='fa fa-tachometer fa-fw'></i>
                                <span className='side-menu-link-text'>DashBoards</span>
                            </Link>
                        </li>
                        <li title="DataFlows">
                            <Link to={basepath+'/flows'} className="sidebar-link">
                                <i className='fa fa-share-alt fa-fw'></i>
                                <span className='side-menu-link-text'>DataFlows</span>
                            </Link>
                        </li>
                        <li title="Users">
                            <Link to={basepath+'/users'} className="sidebar-link">
                                <i className='fa fa-users fa-fw'></i>
                                <span className='side-menu-link-text'>Users</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}