import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Panel } from '../Tabs/Tabs'
import EditModal from '../EditModal/EditModal'
import InfoTab from '../InfoTab/InfoTab'
import ContentEditable from '../ContentEditable/ContentEditable'
import CodeTab from '../CodeTab/CodeTab'
import './NodeDetails.css'

class JobDetails extends Component {
  static propTypes = {
    node: PropTypes.object,
    toggleNodeDetailsPain: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false
      }
  }
  toggleEditDialog(e) {
    e.preventDefault()
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
  getRightMenuOptions() {
    const { params, toggleNodeDetailsPain } = this.props
    const exitHref = "#/clouds/"+params.cloudId+"/flow/" + params.nodeId
    return (                    
      <div className='btn-group pull-right item-options'>
          <a href='' onClick={this.toggleEditDialog.bind(this)} className='btn btn-default'><i className='fa fa-cog'></i></a>
          <a href='' onClick={toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-arrows-v'></i></a>
          <a href={exitHref} className='btn btn-default'><i className='fa fa-times'></i></a>
      </div>
    )
  }
  handleChange(e) {
    this.props.onUpdate(JSON.parse(e.target.value))
  }
  getNodeJsonForEdit() {
    let json = Object.assign({}, this.props.node) 
    if (!json) {
      json = {}
    }
    delete json.code
    delete json.data
    delete json.img
    return json
  }
  render() {
    const { onUpdate, params } = this.props
    return (
      <div className='job-details'>

        <Tabs getRightMenuOptions={this.getRightMenuOptions.bind(this)}>
          <Panel title='Info'>
            <InfoTab key={params.nodeId} params={params} onUpdate={onUpdate}></InfoTab>
          </Panel>
          <Panel title='Code'>
            <CodeTab key={params.nodeId} params={params} onUpdate={onUpdate}></CodeTab>
          </Panel>
          <Panel title='History'>
            <p></p>
          </Panel>
        </Tabs>

        <EditModal title="Edit ETL Job" shown={this.state.shown} toggleEditDialog={this.toggleEditDialog.bind(this)}>
          <ContentEditable type='pre' value={JSON.stringify(this.getNodeJsonForEdit(), null, 2)} onChange={this.handleChange.bind(this)}></ContentEditable>
        </EditModal>

        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(JobDetails)
