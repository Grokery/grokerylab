import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './SideNavBar.css'

export default class SideNavBar extends Component {
    static PropTypes = {
        cloudName: PropTypes.string.isRequired
    }
    setActive(ev) {
        ev.currentTarget.classList.add("active")
        Array.from(document.getElementsByClassName('sidebar-link')).forEach(element => {
            if (element !== ev.currentTarget) {
                element.classList.remove("active")
            }
        });
    }
    render() {
        let basepath = '#/clouds/'+this.props.cloudName
        return (
            <div id='side-menu-wrapper' className='navbar-default sidebar' role='navigation'>
                <div className='sidebar-nav navbar-collapse'>
                    <ul id='side-menu' className='nav'>
                        {/* <li title="Home"><a href={'/#'} className="sidebar-link" onClick={this.setActive}><i className='fa fa-arrow-left fa-fw'></i></a></li> */}
                        {/* <hr className='sidebar-section-devider'></hr> */}
                        {/* <li title="Cloud Home"><a href={basepath+'/'} className="sidebar-link" onClick={this.setActive}><i className='fa fa-cloud fa-fw'></i></a></li> */}
                        {/* <li title="DashBoards"><a href={basepath+'/dashboards'}><i className='fa fa-th-large fa-fw'></i></a></li> */}
                        {/* <li title="Charts"><a href={basepath+'/charts'}><i className='fa fa-bar-chart fa-fw'></i></a></li> */}
                        {/* <li title="Notebooks"><a href={basepath+'/notebooks'}><i className='fa fa-file-code-o fa-fw'></i></a></li> */}
                        <li title="Data Flows"><a href={basepath+'/flows'} className="sidebar-link active" onClick={this.setActive}><i className='fa fa-share-alt fa-fw'></i></a></li>
                        <li title="ETL Jobs"><a href={basepath+'/jobs'} className="sidebar-link" onClick={this.setActive}><i className='fa fa-code fa-fw'></i></a></li>
                        <li title="Data Sources"><a href={basepath+'/datasources'} className="sidebar-link" onClick={this.setActive}><i className='fa fa-database fa-fw'></i></a></li>
                        <hr className='sidebar-section-devider'></hr>
                        <li title="Cloud Settings"><a href={basepath+'/settings'} className="sidebar-link" onClick={this.setActive}><i className='fa fa-cogs fa-fw'></i></a></li>
                    </ul>
                </div>
            </div>
        )
    }
}