import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat } from 'lodash'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/chrome'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
// import InfoTab from 'shared/InfoTab/InfoTab'
import LogsTab from 'shared/LogsTab/LogsTab'

// import SourceInfo from 'components/NodeDetails/sources/SourceInfo'
import SourceForm from 'components/NodeDetails/sources/SourceForm'

class JsonData extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    reloadData: PropTypes.func.isRequired,
    rightMenuOptions: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props)
    this.editor = React.createRef();
    this.state = {
      shown: false,
      dirty: false,
      dataDraft: JSON.stringify(props.node.jsonData, null, 2),
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({dataDraft: JSON.stringify(nextProps.node.jsonData, null, 2)}, () => {
      // editor.scrollToLine(0, true, true, () => {});
      // editor.gotoLine(0, 0, true);
    })
  }
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  render() {
    const { params, onUpdate, node, height } = this.props
    return (
      <div className='source-details'>
        <Tabs>
          {/* <Panel title='Info'>
            {this.renderRightMenuOptions()}
            <InfoTab key={params.nodeId} params={params} onUpdate={onUpdate}>
              <p>jsonData</p>
              <SourceInfo key={params.nodeId} params={params} onUpdate={onUpdate}></SourceInfo>
            </InfoTab>
          </Panel> */}
          <Panel title={node.title}>
            {this.renderRightMenuOptions()}
            <div className='row'>
              <div className='col-md-3'>
                
              </div>
              <div className='col-md-9'>
                <AceEditor
                  mode="json"
                  theme="chrome"
                  onChange={this.onChange}
                  fontSize={12}
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.state.dataDraft}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                  width={"100%"}
                  height={height+"px"}
                />
              </div>
            </div>
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
  getRightMenuOptions = () => {
    return concat([
      <button key='save' disabled={!this.state.dirty} onClick={this.onUpdate} className='btn btn-default'><i className='fa fa-save'></i></button>,
      // TODO make it automatically updated
      <button key='reload' onClick={this.props.reloadData} className='btn btn-default'><i className="fa fa-refresh" aria-hidden="true"></i></button>,
      <button key='edit' onClick={this.toggleEditDialog} className='btn btn-default'><i className='fa fa-cog'></i></button>,
    ], this.props.rightMenuOptions)
  }
  renderRightMenuOptions() {
    return (
      <div className='btn-group item-options' style={{position: 'absolute', right: 0, top: 0}}>
          {this.getRightMenuOptions()}
      </div>
    )
  }
  toggleEditDialog = (e) => {
    if (e) {e.preventDefault()}
    if (this.state.shown) {
      this.setState({shown: false})
    } else {
      this.setState({shown: true})
    }
  }
  onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) { // 83='s'
      this.onUpdate(e)
    }
  }
  onChange = (newData) => {
    this.setState({ dataDraft: newData, dirty: true })
  }
  onUpdate = (e) => {
    e.preventDefault()
    let newdata = null
    try {
      newdata = JSON.parse(this.state.dataDraft)
    } catch (e) {
      alert(e)
      return
    }
    this.props.onUpdate({
      'jsonData': newdata,
    }, () => {
      this.setState({ dirty: false })
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(JsonData)
