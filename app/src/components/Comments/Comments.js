import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../../authentication'
import { fetchHistory, appendHistoryItem } from '../../actions'
import './Comments.css'

class Comments extends Component {
    static propTypes = {
        comments: PropTypes.array.isRequired,
        fetchHistory: PropTypes.func.isRequired,
        appendHistoryItem: PropTypes.func.isRequired
    }
    componentDidMount() {
        const { fetchHistory, params } = this.props
        fetchHistory(params.nodeId)
    }
    getComments() {
        let lis = []
        this.props.comments.forEach(function(comment) {
            lis.push((
                <li className='left clearfix'>
                    <span className='chat-img pull-left'><i className='fa fa-user fa-fw'></i></span>
                    <div className='chat-body clearfix'>
                        <div className='header'>
                            <strong className='primary-font'>{comment.user}</strong>
                            <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>{comment.datetime}</small>
                        </div>
                        <p>{comment.body}</p>
                    </div>
                </li>
            ))
        })
        return lis
    }
    onSubmit(event) {
        event.preventDefault()
        const { username, appendHistoryItem, params } = this.props
        let newcomment = {
            collection: "history",
            datetime: new Date().getTime(),
            referenceid: params.nodeId,
            type: "comment",
            user: username.split('@')[0],
            body: document.getElementById('comment-input').value
        }
        console.log(newcomment)
        appendHistoryItem(newcomment, null)
    }
    render() {
        return (
            <div className='chat-panel panel panel-default'>
                <div className='input-group'>
                    <input id='comment-input' type='text' className='form-control input-sm' placeholder='Add comment ....' />
                    <span className='input-group-btn'>
                        <button id='btn-chat' className='btn btn-primary btn-sm' onClick={this.onSubmit.bind(this)}>Send</button>    
                    </span>
                </div>
                <div className='panel-body'>
                    <ul className='chat'>{this.getComments()}</ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let sessionInfo = getSessionInfo()
    return {
        username: sessionInfo ? sessionInfo['username'] : "User Name",
        comments: state.history.filter(function(item){return item.type === "comment"})
    }
}

export default connect(mapStateToProps, {
    fetchHistory,
    appendHistoryItem
})(Comments)