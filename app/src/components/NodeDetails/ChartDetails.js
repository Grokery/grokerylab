import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Panel } from '../Tabs/Tabs'
import EditModal from '../EditModal/EditModal'
import InfoTab from '../InfoTab/InfoTab'
import ChartCodeTab from '../ChartCodeTab/ChartCodeTab'
import DataTab from '../DataTab/DataTab'
import HistoryTab from '../HistoryTab/HistoryTab'
import './NodeDetails.css'

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
    e.preventDefault()
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
          <Panel title='History'>
            <HistoryTab params={this.props.params}></HistoryTab>
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
