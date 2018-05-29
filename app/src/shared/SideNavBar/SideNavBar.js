import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './SideNavBar.css'

export default class SideNavBar extends Component {
    static PropTypes = {
        cloudName: PropTypes.string.isRequired
    }
    render() {
        let basepath = '#/clouds/'+this.props.cloudName
        return (
            <div id='side-menu-wrapper' className='navbar-default sidebar' role='navigation'>
                <div className='sidebar-nav navbar-collapse'>
                    <ul id='side-menu' className='nav'>
                        <li title="Cloud Home"><a href={basepath+'/'}><i className='fa fa-home fa-fw'></i></a></li>
                        {/* <li title="DashBoards"><a href={basepath+'/dashboards'}><i className='fa fa-th-large fa-fw'></i></a></li> */}
                        {/* <li title="Charts"><a href={basepath+'/charts'}><i className='fa fa-bar-chart fa-fw'></i></a></li> */}
                        {/* <li title="Projects"><a href={basepath+'/projects'}><i className='fa fa-cube fa-fw'></i></a></li> */}
                        {/* <li title="Notebooks"><a href={basepath+'/notebooks'}><i className='fa fa-file-code-o fa-fw'></i></a></li> */}
                        <hr className='sidebar-section-devider'></hr>
                        <li title="Data Flows"><a href={basepath+'/flows'}><i className='fa fa-share-alt fa-fw'></i></a></li>
                        <li title="Jobs"><a href={basepath+'/jobs'}><i className='fa fa-code fa-fw'></i></a></li>
                        <li title="Sources"><a href={basepath+'/datasources'}><i className='fa fa-database fa-fw'></i></a></li>
                        <hr className='sidebar-section-devider'></hr>
                        <li title="Settings"><a href={basepath+'/settings'}><i className='fa fa-cogs fa-fw'></i></a></li>
                        {/* <li title="Data Storage & Compute Connections"><a href={basepath+'/connections'}><i className='fa fa-key fa-fw'></i></a></li> */}
                        {/* <li title="Users"><a href={basepath+'/users'}><i className='fa fa-users fa-fw'></i></a></li> */}
                    </ul>
                </div>
            </div>
        )
    }
}