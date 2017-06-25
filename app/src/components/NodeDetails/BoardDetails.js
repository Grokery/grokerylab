import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Panel } from '../Tabs/Tabs'
import EditModal from '../EditModal/EditModal'
import IChart from '../IChart/IChart'
import ContentEditable from '../ContentEditable/ContentEditable'
import './NodeDetails.css'

class BoardDetails extends Component {
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
  render() {
    const { node } = this.props
    if (!node) { return <div></div> }
    return (
      <div className='board-details'>
        <Tabs getRightMenuOptions={this.getRightMenuOptions.bind(this)}>
          <Panel title={node.title}>
            {this.getCharts()}
          </Panel>
          <Panel title=''>
            <span>empty</span>
          </Panel>
        </Tabs>

        <EditModal title="Edit Dash Board" shown={this.state.shown} toggleEditDialog={this.toggleEditDialog.bind(this)}>
          <ContentEditable type='pre' value={JSON.stringify(this.props.node, null, 2)} onChange={this.handleChange.bind(this)}></ContentEditable>
        </EditModal>

        {this.props.children}
      </div>
    )
  }
  handleChange(e) {
    this.props.onUpdate(JSON.parse(e.target.value))
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
          <a href='' onClick={toggleNodeDetailsPain} className='btn btn-default'><i className='fa fa-share-alt'></i></a>
          <a href={exitHref} className='btn btn-default'><i className='fa fa-times'></i></a>
      </div>
    )
  }
  getCharts() {
    const { node, params } = this.props
    let elements = []
    node.upstream.forEach(function(chart) {
      if (!chart || chart.collection !== 'charts') {
        return
      }
      elements.push((
        <div key={chart.id} className={'dashboard-item'}>
          <IChart
            key={Math.random()}
            id={chart.id}
            height={350}
            width={600}
            params={params}
            showTitle={true}
          ></IChart>
        </div>
      ))
    })
    return elements
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(BoardDetails)
