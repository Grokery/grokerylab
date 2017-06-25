import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Panel } from '../Tabs/Tabs'
import EditModal from '../EditModal/EditModal'
import InfoTab from '../InfoTab/InfoTab'
import ContentEditable from '../ContentEditable/ContentEditable'
import DataTab from '../DataTab/DataTab'
import './NodeDetails.css'

class SourceDetails extends Component {
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
  getRightMenuOptions(){
    const { params, toggleNodeDetailsPain } = this.props
    const exitHref = "#/clouds/"+params.cloudId+"/flow/" + params.nodeId
    return (                    
      <div className='btn-group pull-right item-options'>
          <a href='' onClick={this.toggleEditDialog.bind(this)} className='btn btn-default'><i className='fa fa-cog'></i></a>
          <a href='' onClick={toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-share-alt'></i></a>
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
    const { params, onUpdate } = this.props
    return (
      <div className='source-details'>
        <Tabs getRightMenuOptions={this.getRightMenuOptions.bind(this)}>
          <Panel title='Info'>
            <InfoTab key={params.nodeId} params={params} onUpdate={onUpdate}></InfoTab>
          </Panel>
          <Panel title='Data'>
            <DataTab key={params.nodeId} params={params} onUpdate={onUpdate}></DataTab>
          </Panel>
          <Panel title='History'>
            <p></p>
          </Panel>
        </Tabs>

        <EditModal title="Edit Data Source" shown={this.state.shown} toggleEditDialog={this.toggleEditDialog.bind(this)}>
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

export default connect(mapStateToProps, {})(SourceDetails)
