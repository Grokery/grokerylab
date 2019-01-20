import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat } from 'lodash'

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
    onUpdate: PropTypes.func.isRequired,
    rightMenuOptions: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props)
      this.state = {
          shown: false,
          dirty: false,
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
  getRightMenuOptions = () => {
    let saveOption = null
    if (this.state.dirty) {
      saveOption = <a key='save' href='' onClick={this.updateSourceCode} className='btn btn-default'><i className='fa fa-save'></i></a>
    }
    return concat([
      saveOption,
      <a key='edit' href='' onClick={this.toggleEditDialog} className='btn btn-default'><i className='fa fa-cog'></i></a>,
    ], this.props.rightMenuOptions)
  }
  renderRightMenuOptions() {
    return (
      <div className='btn-group item-options' style={{position: 'absolute', right: 0, top: 0}}>
          {this.getRightMenuOptions()}
      </div>
    )
  }
  render() {
    const { params, onUpdate, node } = this.props
    return (
      <div className='source-details'>
        <Tabs>
          <Panel title='Info'>
            {this.renderRightMenuOptions()}
            <InfoTab key={params.nodeId} params={params} onUpdate={onUpdate}>
              <SourceInfo key={params.nodeId} params={params} onUpdate={onUpdate}></SourceInfo>
            </InfoTab>
          </Panel>
          <Panel title='Data'>
            {this.renderRightMenuOptions()}
            <DataTab key={params.nodeId} params={params} onUpdate={onUpdate}></DataTab>
          </Panel>
          <Panel title='History'>
            {this.renderRightMenuOptions()}
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
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(SourceDetails)
