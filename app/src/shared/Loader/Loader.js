import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Loader.css'

export default class Loader extends Component {
    static propTypes = {
      show: PropTypes.bool.isRequired
    }
    render() {
        if (this.props.show) {
            return (<div className='loading'></div>)
        }
        return null
    }
}