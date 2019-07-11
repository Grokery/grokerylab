import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessionInfo } from 'authentication'
import { fetchNodeHistory } from 'store/actions/history'
import Loader from '../Loader/Loader'

class HistoryTab extends Component {
    static propTypes = {
        history: PropTypes.array.isRequired,
        fetchNodeHistory: PropTypes.func.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true
        }
    }
    componentDidMount() {
        const { fetchNodeHistory, params } = this.props
        fetchNodeHistory(params.cloudName, params.nodeId, () => this.setState({ isLoading: false }))
    }
    getItems() {
        let list = []
        this.props.history.forEach(function(item) {
            list.push((
                <li key={item.itemId} className='left clearfix' style={{listStyle:'none'}}>
                    <div className='clearfix'>
                        <div className='header'>
                            <button className='primary-font'>{item.userContact}</button>
                            <small className='text-muted'><i className='fa fa-clock-o fa-fw'></i>{item.created}</small>
                            <pre>{JSON.stringify(item, null, 2)}</pre>
                        </div>
                    </div>
                </li>
            ))
        })
        if (list.length === 0) {
            list.push((
                <li className='left clearfix' style={{listStyle:'none'}}>
                    <div className='clearfix'>
                        <div className='header'>
                            <button className='primary-font'>No history items found</button>
                        </div>
                    </div>
                </li>
            ))
        }
        return list
    }
    render() {
        const { isLoading } = this.state
        return (
            <div id="history-tab" className='panel-default'>
                <div className='panel-body'>
                    <Loader show={isLoading} />
                    <ul style={{padding:0}}>{isLoading ? null : this.getItems()}</ul>
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
    fetchNodeHistory,
})(HistoryTab)