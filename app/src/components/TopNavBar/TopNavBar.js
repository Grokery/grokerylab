import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
        let cloudName = "GrokeryLab"
        if (
            getSessionInfo() && 
            getSessionInfo()['selectedCloud']
        ) {
            cloudName = getSessionInfo()['selectedCloud'].name
        }
        return cloudName
    }
    render() {
        const { isAuthenticated } = this.props
        let showRightNav = isAuthenticated() ? "" : "hidden"
        return (
            <nav id='top-nav-wrapper' className='navbar navbar-default navbar-fixed-top' role='navigation'>
                <div id='top-menu-wrapper'>
                    <div className='navbar-header'>
                        <a id='menu-toggle' className='navbar-brand' href='#'><i className='fa fa-bars'></i></a>
                        <a className='navbar-brand' href='#'><i className='fa fa-cloud'></i></a>
                        <a className='navbar-brand' href='#'>{this.getCloudName()}</a>
                    </div>
                    <ul id='top-right-nav-options' className={'nav navbar-top-links navbar-right pull-right '+showRightNav}>
                        <StatusIndicator></StatusIndicator>
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