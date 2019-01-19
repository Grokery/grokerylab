import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import InfoTab from 'shared/InfoTab/InfoTab'
import LogsTab from 'shared/LogsTab/LogsTab'
import DataTab from 'shared/DataTab/DataTab'
import SourceInfo from './SourceInfo'
import SourceForm from './SourceForm'

class SourceDetails extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    toggleNodeDetailsPain: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false
      }
  }
  toggleEditDialog = (e) => {
    if (e) {e.preventDefault()}
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
  render() {
    const { params, onUpdate, node } = this.props
    return (
      <div className='source-details'>
        <Tabs getRightMenuOptions={this.getRightMenuOptions}>
          <Panel title='Info'>
            <InfoTab key={params.nodeId} params={params} onUpdate={onUpdate}>
              <SourceInfo key={params.nodeId} params={params} onUpdate={onUpdate}></SourceInfo>
            </InfoTab>
          </Panel>
          <Panel title='Data'>
            <DataTab key={params.nodeId} params={params} onUpdate={onUpdate}></DataTab>
          </Panel>
          <Panel title='History'>
            <LogsTab params={this.props.params}></LogsTab>
          </Panel>
        </Tabs>
        <EditModal 
          title="Edit Data Source" 
          node={node} 
          onUpdate={this.props.onUpdate} 
          shown={this.state.shown} 
          toggleEditDialog={this.toggleEditDialog}
          form={(<SourceForm node={node} onUpdate={this.props.onUpdate}></SourceForm>)}
        ></EditModal>
      </div>
    )
  }
  getRightMenuOptions = () => {
    const { toggleNodeDetailsPain, params } = this.props
    return (
      <div className='btn-group pull-right item-options'>
          <a href='' onClick={this.toggleEditDialog} className='btn btn-default'><i className='fa fa-cog'></i></a>
          <a href='' onClick={toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-arrows-v'></i></a>
          <a href={"#/clouds/"+ params.cloudName + "/flows?nodeId=" + params.nodeId} className='btn btn-default'><i className='fa fa-times'></i></a>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId] || {}
  }
}

export default connect(mapStateToProps, {})(SourceDetails)
