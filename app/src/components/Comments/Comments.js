import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchHistory } from '../../actions'
import './Comments.css'

class Comments extends Component {
    static propTypes = {
        comments: PropTypes.array.isRequired,
        fetchHistory: PropTypes.func.isRequired
    }
    componentDidMount() {
        const { fetchHistory, params } = this.props
        console.log(this.props)
        fetchHistory(params.nodeId)
    }
    render() {
        return (
            <div className='chat-panel panel panel-default'>
                <div className='input-group'>
                    <input id='btn-input' type='text' className='form-control input-sm' placeholder='Add comment ....' />
                    <span className='input-group-btn'>
                        <button id='btn-chat' className='btn btn-primary btn-sm'>Send</button>    
                    </span>
                </div>
                <div className='panel-body'>
                    <ul className='chat'>

                        <li className='left clearfix'>
                            <span className='chat-img pull-left'><i className='fa fa-user fa-fw'></i></span>
                            <div className='chat-body clearfix'>
                                <div className='header'>
                                    <strong className='primary-font'>Capt Jack Sparrow</strong>
                                    <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>13 mins ago</small>
                                </div>
                                <p>Why is the rum always gone?</p>
                            </div>
                        </li>

                        <li className='left clearfix'>
                            <span className='chat-img pull-left'><i className='fa fa-user fa-fw'></i></span>
                            <div className='chat-body clearfix'>
                                <div className='header'>
                                    <strong className='primary-font'>Black Sam</strong>
                                    <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>15 mins ago</small>
                                </div>
                                <p>I am sorry they won't let you have your sloop again, for I scorn to do anyone a mischief, when it is not for my advantage.</p>
                            </div>
                        </li>

                        <li className='left clearfix'>
                            <span className='chat-img pull-left'><i className='fa fa-user fa-fw'></i></span>
                            <div className='chat-body clearfix'>
                                <div className='header'>
                                    <strong className='primary-font'>Capt Jack Sparrow</strong>
                                    <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>20 mins ago</small>
                                </div>
                                <p>And that was done without a single drop of rum… STOP BLOWING HOLES IN MY SHIP!!! you know, thats the 2nd time I’v watched that man sail away with my ship.</p>
                            </div>
                        </li>

                        <li className='left clearfix'>
                            <span className='chat-img pull-left'><i className='fa fa-user fa-fw'></i></span>
                            <div className='chat-body clearfix'>
                                <div className='header'>
                                    <strong className='primary-font'>Black Sam</strong>
                                    <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>22 mins ago</small>
                                </div>
                                <p>Aye, tough mermaids are the lot of them</p>
                            </div>
                        </li>

                        <li className='left clearfix'>
                            <span className='chat-img pull-left'><i className='fa fa-user fa-fw'></i></span>
                            <div className='chat-body clearfix'>
                                <div className='header'>
                                    <strong className='primary-font'>Capt Jack Sparrow</strong>
                                    <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>23 mins ago</small>
                                </div>
                                <p>Not all treasure is silver and gold mate!</p>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
      comments: state.history.filter(function(item){return item.type === "comment"})
  }
}

export default connect(mapStateToProps, {
    fetchHistory
})(Comments)