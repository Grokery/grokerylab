import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'
import { fetchLogs, appendLogItem } from 'store/actions/logs'
import './LogsTab.css'

class LogsTab extends Component {
    static propTypes = {
        logs: PropTypes.array.isRequired,
        fetchLogs: PropTypes.func.isRequired,
        appendLogItem: PropTypes.func.isRequired
    }
    componentDidMount() {
        // const { fetchLogs, params } = this.props
        // fetchLogs(params.nodeId)
    }
    getLogs() {
        let lis = []
        this.props.logs.forEach(function(item) {
            lis.push((
                <li key={item.id} className='left clearfix'>
                    <span className='chat-img pull-left'></span>
                    <div className='chat-body clearfix'>
                        <div className='header'>
                            <button className='primary-font'>{item.nodeType.charAt(0).toUpperCase() + item.nodeType.slice(1)} : {item.user}</button>
                            <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>{item.datetime}</small>
                        </div>
                    </div>
                </li>
            ))
        })
        return lis
    }
    render() {
        return (
            <div className='chat-panel panel panel-default'>
                <div className='panel-body'>
                    <ul className='chat'>{this.getLogs()}</ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let sessionInfo = getSessionInfo()
    return {
        username: sessionInfo ? sessionInfo['username'] : "User Name",
        logs: state.logs
    }
}

export default connect(mapStateToProps, {
    fetchLogs,
    appendLogItem
})(LogsTab)