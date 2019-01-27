import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

import { getSessionInfo } from 'authentication'
import { createComment, queryComments } from 'store/actions/comments'

import './Comments.css'

class Comments extends Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        userName: PropTypes.string.isRequired,
        userContact: PropTypes.string.isRequired,
        nodeId: PropTypes.string.isRequired,
        comments: PropTypes.array.isRequired,
        queryComments: PropTypes.func.isRequired,
        createComment: PropTypes.func.isRequired
    }
    componentDidMount() {
        const { queryComments, nodeId, params } = this.props
        queryComments(params.cloudName, "?nodeId="+nodeId+"&limit=5")
    }
    render() {
        return (
            <div className='chat-panel panel panel-default'>
                <div className='input-group'>
                    <form onSubmit={this.onCreateNewComment}>
                        <input id='comment-input' type='text' className='form-control input-sm' placeholder='Add comment ....' />
                    </form>
                    <span className='input-group-btn'>
                        <button id='btn-chat' className='btn btn-primary btn-sm' onClick={this.onCreateNewComment}>Send</button>
                    </span>
                </div>
                <div className='panel-body'>
                    <ul className='chat'>{this.renderComments()}</ul>
                </div>
            </div>
        )
    }
    renderComments() {
        let { comments } = this.props
        let result = []
        comments.forEach((comment) => {
            result.push((
                <li key={comment.commentId} className='left clearfix'>
                    <span className='chat-img pull-left'><i className='fa fa-user fa-fw'></i></span>
                    <div className='chat-body clearfix'>
                        <div className='header'>
                            <strong className='primary-font'>{comment.userName}</strong>
                            <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>
                                {moment(comment.created).format('DD MMM YYYY HH:mm')}
                            </small>
                        </div>
                        <p>{comment.message}</p>
                    </div>
                </li>
            ))
        })
        return result
    }
    onCreateNewComment = (e) => {
        e.preventDefault()
        const { userName, usderContact, createComment, queryComments, nodeId, params } = this.props
        let data = {
            nodeId: nodeId,
            userName: userName,
            userContact: usderContact,
            message: document.getElementById('comment-input').value
        }
        createComment(params.cloudName, data, () => {
            queryComments(params.cloudName, "?nodeId="+nodeId+"&limit=5")
        })
        document.getElementById('comment-input').value = ""
    }
}

const mapStateToProps = (state, ownProps) => {
    let sessionInfo = getSessionInfo()
    return {
        userContact: sessionInfo['userName'] ? sessionInfo['userName'] : "",
        userName: sessionInfo['name'] ? sessionInfo['name'] : "",
        comments: state.comments[ownProps.nodeId] ? state.comments[ownProps.nodeId] : [],
    }
}

export default connect(mapStateToProps, {
    createComment,
    queryComments,
})(Comments)