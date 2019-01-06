import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './SideNavBar.css'

export default class SideNavBar extends Component {
    static PropTypes = {
        cloudName: PropTypes.string.isRequired
    }
    setActive(e) {
        Array.from(document.getElementsByClassName('sidebar-link')).forEach(element => {
            element.classList.remove("active")
        });
        e.currentTarget.classList.add("active")
    }
    render() {
        let basepath = '#/clouds/'+this.props.cloudName
        return (
            <div id='side-menu-wrapper' className='navbar-default sidebar' role='navigation'>
                <div className='sidebar-nav navbar-collapse'>
                    <ul id='side-menu' className='nav'>
                        <li title="Home"><a href={'/#'}><i className='fa fa-home fa-fw'></i></a></li>
                        <hr className='sidebar-section-devider'></hr>
                        {/* <li title="Cloud Home"><a href={basepath+'/'} className="sidebar-link active" onClick={this.setActive}><i className='fa fa-th-large fa-fw'></i></a></li> */}
                        <li title="DashBoards"><a href={basepath+'/boards'} className='sidebar-link active' onClick={this.setActive}><i className='fa fa-tachometer fa-fw'></i></a></li>
                        {/* <hr className='sidebar-section-devider'></hr> */}
                        <li title="DataFlows"><a href={basepath+'/flows'} className="sidebar-link" onClick={this.setActive}><i className='fa fa-share-alt fa-fw'></i></a></li>
                        {/* <hr className='sidebar-section-devider'></hr> */}
                        <li title="Users"><a href={basepath+'/users'} className="sidebar-link" onClick={this.setActive}><i className='fa fa-users fa-fw'></i></a></li>
                    </ul>
                </div>
            </div>
        )
    }
}