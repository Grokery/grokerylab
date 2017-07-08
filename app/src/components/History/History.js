import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../../authentication'
import { fetchHistory, appendHistoryItem } from '../../actions'
import './History.css'

class History extends Component {
    static propTypes = {
        history: PropTypes.array.isRequired,
        fetchHistory: PropTypes.func.isRequired,
        appendHistoryItem: PropTypes.func.isRequired
    }
    componentDidMount() {
        const { fetchHistory, params } = this.props
        fetchHistory(params.nodeId)
    }
    getHistory() {
        let lis = []
        this.props.history.forEach(function(item) {
            lis.push((
                <li className='left clearfix'>
                    <span className='chat-img pull-left'></span>
                    <div className='chat-body clearfix'>
                        <div className='header'>
                            <a className='primary-font'>{item.type} : {item.user}</a>
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
                    <ul className='chat'>{this.getHistory()}</ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let sessionInfo = getSessionInfo()
    return {
        username: sessionInfo ? sessionInfo['username'] : "User Name",
        history: state.history
    }
}

export default connect(mapStateToProps, {
    fetchHistory,
    appendHistoryItem
})(History)