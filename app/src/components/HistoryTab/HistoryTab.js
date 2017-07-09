import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../../authentication'
import { fetchHistory, appendHistoryItem } from '../../actions'
import './HistoryTab.css'

class HistoryTab extends Component {
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
                <li key={item.id} className='left clearfix'>
                    <span className='chat-img pull-left'></span>
                    <div className='chat-body clearfix'>
                        <div className='header'>
                            <a className='primary-font'>{item.collection.charAt(0).toUpperCase() + item.collection.slice(1)} : {item.user}</a>
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
})(HistoryTab)