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

        <Tabs getRightMenuOptions={this.props.getRightMenuOptions.bind(this)}>
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
