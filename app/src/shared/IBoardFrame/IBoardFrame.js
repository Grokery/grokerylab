import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isArray } from 'lodash'

import { API_BASE_URL } from "config"
import { getCloudId, getCloudToken } from 'authentication'

class IBoardFrame extends Component {
    static propTypes = {
        cloudName: PropTypes.string.isRequired,
        board: PropTypes.object.isRequired,
        width: PropTypes.any,
        height: PropTypes.any,
    }
    static defaultProps = {
        width: window.innerWidth,
        height: window.innerHeight,
    }
    render() {
        const { board, width, height, cloudName } = this.props
        
        let source = board.source
        if (isArray(board.upstream) && board.upstream[0]) {
            let url = API_BASE_URL + '/clouds/' + getCloudId(cloudName) + '/nodes/datasource/'
            let token = getCloudToken(cloudName)
            let code = `
                <script>
                    var getSource = (id, cb) => {
                        var url = '`+url+`' + id + '/query'
                        var options = {headers:{"Authorization":"`+token+`"}}
                        fetch(url, options)
                        .then((res) => {
                            return res.json();
                        })
                        .then((data) => {
                            cb(data);
                        });
                    }
                </script>
            `        
            source = code + source
        }
        return (
            <iframe id={board.nodeId} title={board.nodeId} srcDoc={source} style={{border: 'none', width: width, height: height}}></iframe>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        board: state.nodes[ownProps.boardId],
    }
}

export default connect(mapStateToProps, {
    
})(IBoardFrame)
