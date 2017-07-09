import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNode } from '../../actions'
import IChart from '../IChart/IChart'
import CodeEditor from '../CodeEditor/CodeEditor'
import './ChartCodeTab.css'

class ChartCodeTab extends Component {
  static propTypes = {
    options: PropTypes.object,
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    fetchNode: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
      this.state = {
          showModal: false
      }
  }
  componentDidMount() {
    const { fetchNode, params } = this.props
    fetchNode(params.collection, params.nodeId)
  }
  toggleTemplateModal(e) {
    e.preventDefault()
    if (this.state.showModal) {
      this.setState({showModal: false})
    } else {
      this.setState({showModal: true})
    }
  }
  setTemplate(template) {
    this.props.onUpdate({
      'code': template.code,
      'data': template.data
    })
  }
  updateCode(newCode) {
    if (this.debounce){
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(function(){ 
      this.props.onUpdate({
        'code': newCode
      }) 
    }.bind(this), 1000);
  }
  render() {
    let { options, node, params } = this.props
    if (!node){
      return (<div></div>)
    }
    if (!options){
      options = {
        lineNumbers: true,
        dragDrop: false,
        mode: {name: "htmlmixed"}
      }
    }
    return (
      <div className='code-tab'>
        <div className='code col-md-6'>
          <CodeEditor value={node.code} options={options} onChange={this.updateCode.bind(this)} />
        </div>
        <div className='output col-md-6'>
          <div className='template-select'>
            <a href='' onClick={function(){}}><i className="fa fa-play" aria-hidden="true"></i></a>
          </div>
          <IChart
            key={node.id}
            id={node.id}
            params={params}
            height={350}
            width={600}
          ></IChart>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {
  fetchNode
})(ChartCodeTab)
