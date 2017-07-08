import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Panel } from '../Tabs/Tabs'
import EditModal from '../EditModal/EditModal'
import InfoTab from '../InfoTab/InfoTab'
import CodeTab from '../CodeTab/CodeTab'
import DataTab from '../DataTab/DataTab'
import History from '../History/History'
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
            <CodeTab key={params.nodeId} params={params} onUpdate={onUpdate}></CodeTab>
          </Panel>
          <Panel title='Data'>
            <DataTab key={params.nodeId} params={params} onUpdate={onUpdate}></DataTab>
          </Panel>
          <Panel title='History'>
            <History params={this.props.params}></History>
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
