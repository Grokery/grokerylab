import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './SideNavBar.css'

export default class SideNavBar extends Component {
    static PropTypes = {
        cloudName: PropTypes.string.isRequired
    }
    render() {
        const { cloudName } = this.props
        let basepath = '#/clouds/' + cloudName
        return (
            <div id='side-menu-wrapper' className='navbar-default sidebar' role='navigation'>
                <div className='sidebar-nav navbar-collapse'>
                    <ul id='side-menu' className='nav'>
                        <li title="Home"><a href={'/#'}><i className='fa fa-home fa-fw'></i></a></li>
                        <hr className='sidebar-section-devider'></hr>
                        <li title="DashBoards"><a href={basepath+'/boards'} className='sidebar-link'><i className='fa fa-tachometer fa-fw'></i></a></li>
                        <li title="DataFlows"><a href={basepath+'/flows'} className="sidebar-link"><i className='fa fa-share-alt fa-fw'></i></a></li>
                        <li title="Users"><a href={basepath+'/users'} className="sidebar-link"><i className='fa fa-users fa-fw'></i></a></li>
                    </ul>
                </div>
            </div>
        )
    }
}