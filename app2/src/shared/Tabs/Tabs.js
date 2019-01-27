import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, isFunction } from 'lodash'

import { getQueryParamByName, updateQueryParam } from 'common'
import './Tabs.css'

export class Tabs extends Component {
    static propTypes = {
        activeTab: PropTypes.number,
        onMount: PropTypes.func,
        onBeforeChange: PropTypes.func,
        onAfterChange: PropTypes.func,
        getRightMenuOptions: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    }
    static defaultProps = {
        rightMenuOptions: []
    }
    constructor(props) {
        super(props)
        let index = parseInt(getQueryParamByName('activeTab'), 10)
        this.state = {
            activeTab: props.activeTab ? props.activeTab : index ? index : 1
        }
    }
    componentDidMount() {
        var index = this.state.activeTab
        var selectedPanel = this.refs['tab-panel']
        var selectedMenu = this.refs[("tab-menu-" + index)]
        if (this.props.onMount) {
            this.props.onMount(index, selectedPanel, selectedMenu)
        }
    }
    componentWillReceiveProps(newProps) {
        if(newProps.activeTab && newProps.activeTab !== this.props.activeTab){
            this.setState({activeTab: newProps.activeTab})
        }
    }
    setActive(index, e) {
        e.preventDefault()
        var { onAfterChange, onBeforeChange } = this.props
        var selectedPanel = this.refs['tab-panel']
        var selectedTabMenu = this.refs[("tab-menu-" + index)]

        if (onBeforeChange) {
            var cancel = onBeforeChange(index, selectedPanel, selectedTabMenu)
            if(cancel === false){ return }
        }
        updateQueryParam('activeTab', index)
        this.setState({ activeTab: index }, function()  {
            if (onAfterChange) {
                onAfterChange(index, selectedPanel, selectedTabMenu)
            }
        })
    }
    getTabsNav () {
        if (!this.props.children) {
            throw new Error('Tabs must contain at least one Panel')
        }

        let children = cloneDeep(this.props.children)
        if (!Array.isArray(children)) {
            children = [children]
        }

        let menuItems = children
            .map(function(panel) {
                return typeof panel === 'function' ? panel() : panel
            })
            .filter(function(panel) {
                return panel
            })
            .map(function(panel, index) {
                var active = this.state.activeTab === (index + 1) ? 'active' : ''
                return (
                    <li ref={("tab-menu-" + (index + 1))} key={index} className={'tabs-menu-item ' + active}>
                        <a onClick={this.setActive.bind(this, index + 1)}>{panel.props.title}</a>
                    </li>
                )
            }.bind(this))
        let getRightMenuOptions = this.props.getRightMenuOptions
        return (
            <nav className="tabs-navigation">
                <ul className='nav nav-tabs'>
                    {menuItems}
                    <div className='btn-group pull-right item-options'>
                        {isFunction(getRightMenuOptions) ? getRightMenuOptions() : []}
                    </div>
                </ul>
            </nav>
        )
    }
    getSelectedPanel () {
        var index = this.state.activeTab - 1
        return (
            <div ref="tab-panel" className="tab-pane fade in active">{this.props.children[index]}</div>
        )
    }
    render() {
        return (
        <div className='tabs'>
            {this.getTabsNav()}
            {this.getSelectedPanel()}
        </div>
	    )
    }
}

export class Panel extends Component {
     static propTypes = {
        title: PropTypes.string.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    }
    render() {
        return (
            <div className='tab-content'>{this.props.children}</div>
        )
    }
}