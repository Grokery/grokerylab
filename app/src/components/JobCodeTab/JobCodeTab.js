import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNode } from '../../actions'
import CodeEditor from '../CodeEditor/CodeEditor'
import './JobCodeTab.css'

class JobCodeTab extends Component {
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
    let { options, node } = this.props
    if (!node){
      return (<div></div>)
    }
    if (!options){
      options = {
        lineNumbers: true,
        dragDrop: false,
        mode: {name: "javascript"}
      }
    }
    return (
      <div className='job-code-tab'>
        <div className='code col col-md-6'>
          <CodeEditor value={node.code} options={options} onChange={this.updateCode.bind(this)} />
        </div>
        <div className='col col-md-6'>
          <div className=''>
            <div className='col col-md-1 run-button'>
              {/* <a href='#' onClick={function(){}}><i className="fa fa-pause" aria-hidden="true"></i></a> */}
              <label className="switch"><input type="checkbox" /><span className="slider round"></span></label>
            </div>
            <div className='col col-md-11 output-select'>
              <select className='form-control'>
              <option>Next Scheduled Run: - None -</option>
                <option>Next Scheduled Run: 2017-05-31 09:30</option>
                <option>Started 2017-05-31 10:00 - In Progress... </option>
                <option>Completed: 2017-05-31 09:20 - 12 min -  Warning</option>
                <option>Completed: 2017-05-31 09:18 - 5 min -  Success</option>
                <option>Completed: 2017-05-30 13:13 - 5 min - Success</option>
              </select>
            </div>
          </div>
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
})(JobCodeTab)
