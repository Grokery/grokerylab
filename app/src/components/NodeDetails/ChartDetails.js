import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import InfoTab from 'shared/InfoTab/InfoTab'
import ChartCodeTab from 'shared/ChartCodeTab/ChartCodeTab'
import DataTab from 'shared/DataTab/DataTab'
import LogsTab from 'shared/LogsTab/LogsTab'

class ChartDetails extends Component {
  static propTypes = {
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
    if (e) {
      e.preventDefault()
    }
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
  render() {
    const { onUpdate, params, node } = this.props
    return (
      <div className='chart-details'>
        <Tabs getRightMenuOptions={this.props.getRightMenuOptions.bind(this)}>
          <Panel title='Info'>
            <InfoTab key={params.nodeId} params={params} onUpdate={onUpdate}></InfoTab>
          </Panel>
          <Panel title='Code'>
            <ChartCodeTab key={params.nodeId} params={params} onUpdate={onUpdate}></ChartCodeTab>
          </Panel>
          <Panel title='Data'>
            <DataTab key={params.nodeId} params={params} onUpdate={onUpdate}></DataTab>
          </Panel>
          <Panel title='Logs'>
            <LogsTab params={this.props.params}></LogsTab>
          </Panel>
        </Tabs>
        <EditModal title="Edit Chart" node={node} onUpdate={this.props.onUpdate} shown={this.state.shown} toggleEditDialog={this.toggleEditDialog.bind(this)}></EditModal>
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

export default connect(mapStateToProps, {})(ChartDetails)
