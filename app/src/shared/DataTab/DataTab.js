import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNode } from 'store/actions'
import CodeEditor from 'shared/CodeEditor/CodeEditor'
// import SchemaExplorer from 'shared/SchemaExplorer/SchemaExplorer'
import './DataTab.css'

class DataTab extends Component {
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
    fetchNode('DATASOURCE', params.nodeId)
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
      'query': template.code,
      'data': template.data
    })
  }
  updateCode(newCode) {
    if (this.debounce){
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(function(){
      this.props.onUpdate({
        'query': newCode
      })
    }.bind(this), 1000);
  }
  updateData(newData) {
    if (this.debounce){
      clearTimeout(this.debounce)
    }
    this.debounce = setTimeout(function(){
      this.props.onUpdate({
        'data': newData
      })
    }.bind(this), 1000);
  }
  render() {
    let { node } = this.props
    if (!node){
      return (<div></div>)
    }
    let queryOptions = {
      lineNumbers: true,
      dragDrop: false,
      mode: "text/x-sql"
    }
    let dataOptions = {
      lineNumbers: true,
      dragDrop: false,
      mode: "text/x-livescript"
    }
    return (
      <div className='data-code-tab'>
        <div className='code col-md-6'>
          <CodeEditor value={node.query} options={queryOptions} onChange={this.updateCode.bind(this)} />
        </div>
        <div className='output col-md-6'>
          <div className='template-select'>
          </div>
          <div className="row">
            {/*<SchemaExplorer datasource={node}></SchemaExplorer>*/}
          </div>
          <div className="row">
            <CodeEditor value={node.data} options={dataOptions} onChange={this.updateData.bind(this)} />
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
})(DataTab)
