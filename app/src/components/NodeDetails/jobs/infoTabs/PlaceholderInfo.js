import React, { Component } from 'react'
import { object, func } from 'prop-types'
import { connect } from 'react-redux'

export default connect(
    (state, ownProps) => {
        return {
            node: state.nodes[ownProps.params.nodeId] || {},
        }
    }, 
    {

    }
)(
    class PlaceholderInfo extends Component {
        static propTypes = {
        params: object.isRequired,
        onUpdate: func.isRequired,
        node: object.isRequired,
        }
        render() {
        const { node } = this.props
        if (!node) { return <div></div> }
        return (
            <div className="job-detail">  
                <div className="row">
                    <div className="col-md-12">

                    </div>
                </div>
            </div>
        )
        }
    }
)
