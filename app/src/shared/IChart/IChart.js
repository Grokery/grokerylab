import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNode } from 'store/actions'
import './IChart.css'

class IChart extends Component {
    static propTypes = {
        id: PropTypes.string,
        node: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        params: PropTypes.any,
        fetchNode: PropTypes.func.isRequired
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.node.code === this.props.node.code) {
            return false
        }
        return true
    }
    render() {
        const { node, id, showTitle, params, width, height } = this.props
        if (!node || !id) {
            return <div></div>
        }

        const href = '/#/clouds/' + params.cloudName + '/charts/' + id
        return (
            <div>
                <a href={href}><h4>{showTitle ? node.title : ''}</h4></a>
                <iframe id={"ichart-" + id} style={{
                    border: 'none',
                    width: width + "px",
                    height: height + "px"
                }}></iframe>
            </div>
        )
    }
    componentDidMount() {
        const { fetchNode, id, params } = this.props
        if (!id) {
            return
        }
        fetchNode(params.cloudId, 'CHART', id)
        this._render()
    }
    componentDidUpdate() {
        this._render()
    }
    _render(){
        const {id, node, height} = this.props
        if (!node){return}

        var iframe = document.getElementById('ichart-'+id)
        if (!iframe) {return}

        var doc = null;
        if(iframe.contentDocument) {
            doc = iframe.contentDocument
        } else if(iframe.contentWindow) {
            doc = iframe.contentWindow.document
        } else{
            doc = iframe.document
        }
        doc.open()
        doc.writeln(node.code || "")
        doc.close()

        var dataNode = document.createElement('script')
        dataNode.appendChild(document.createTextNode('var data = ' + node.data))
        doc.head.appendChild(dataNode)

        // var clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 50

        // var chartWidth = width
        var chartHeight = height

        // if (clientWidth < chartWidth) {
        //     chartWidth = clientWidth
        //     chartHeight = chartWidth*(height/width)
        // }

        var contentHeight = chartHeight - 50
        var css = 'html, body, div { height:' + contentHeight + 'px !important;}'
        var style = document.createElement('style')
        style.type = 'text/css'
        if (style.styleSheet) {
            style.styleSheet.cssText = css
        } else {
            style.appendChild(document.createTextNode(css))
        }
        doc.head.appendChild(style)
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.id]
  }
}

export default connect(mapStateToProps, {
    fetchNode
})(IChart)
