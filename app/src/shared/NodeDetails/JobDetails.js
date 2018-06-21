import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Panel } from '../Tabs/Tabs'
import EditModal from '../EditModal/EditModal'
import InfoTab from '../InfoTab/InfoTab'
import JobCodeTab from '../JobCodeTab/JobCodeTab'
import LogsTab from '../LogsTab/LogsTab'
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
    if (e) {e.preventDefault()}
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
  render() {
    const { onUpdate, params, node } = this.props
    return (
      <div className='job-details'>
        <Tabs getRightMenuOptions={this.props.getRightMenuOptions.bind(this)}>
          <Panel title='Info'>
            <InfoTab key={params.nodeId} params={params} onUpdate={onUpdate}></InfoTab>
          </Panel>
          <Panel title='Code'>
            <JobCodeTab key={params.nodeId} params={params} onUpdate={onUpdate}></JobCodeTab>
          </Panel>
          <Panel title='Logs'>
            <LogsTab params={this.props.params}></LogsTab>
          </Panel>
        </Tabs>
        <EditModal title="Edit Job" node={node} onUpdate={this.props.onUpdate} shown={this.state.shown} toggleEditDialog={this.toggleEditDialog.bind(this)}></EditModal>
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
