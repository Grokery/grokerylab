import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from '../../authentication'
import { fetchLogs, appendLogItem } from '../../store/actions'
import './Comments.css'

class Comments extends Component {
    static propTypes = {
        username: PropTypes.string.isRequired,
        nodeId: PropTypes.string.isRequired,
        comments: PropTypes.array.isRequired,
        fetchLogs: PropTypes.func.isRequired,
        appendLogItem: PropTypes.func.isRequired
    }
    componentDidMount() {
        const { fetchLogs, nodeId } = this.props
        // fetchLogs(nodeId)
    }
    getComments() {
        let lis = []
        this.props.comments.forEach(function(comment) {
            let date = new Date(comment.datetime)
            let options = {
                weekday: "long", year: "numeric", month: "short",
                day: "numeric", hour: "2-digit", minute: "2-digit"
            }
            lis.push((
                <li key={comment.id} className='left clearfix'>
                    <span className='chat-img pull-left'><i className='fa fa-user fa-fw'></i></span>
                    <div className='chat-body clearfix'>
                        <div className='header'>
                            <strong className='primary-font'>{comment.user}</strong>
                            <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>
                                {date.toLocaleTimeString("en-us", options)}
                            </small>
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
        const { username, appendLogItem, nodeId } = this.props
        let newcomment = {
            collection: "comments",
            datetime: new Date().getTime(),
            referenceid: nodeId,
            user: username.split('@')[0],
            body: document.getElementById('comment-input').value
        }
        appendLogItem("comments", newcomment, null)
        document.getElementById('comment-input').value = ""
    }
    render() {
        return (
            <div className='chat-panel panel panel-default'>
                <div className='input-group'>
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <input id='comment-input' type='text' className='form-control input-sm' placeholder='Add comment ....' />
                    </form>
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
    let filter = function(item) {
        return item.collection === "comments"
    }
    let sort = function(a, b) {
        return a.datetime < b.datetime
    }
    return {
        username: sessionInfo['name'] ? sessionInfo['name'] : "User Name",
        comments: state.logs.filter(filter).sort(sort)
    }
}

export default connect(mapStateToProps, {
    fetchLogs,
    appendLogItem
})(Comments)