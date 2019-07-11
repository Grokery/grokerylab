import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat } from 'lodash'
import AceEditor from 'react-ace'
import 'brace/mode/text'
import 'brace/theme/chrome'

import { Tabs, Panel } from 'shared/Tabs/Tabs'
import EditModal from 'shared/EditModal/EditModal'
import HistoryTab from 'shared/HistoryTab/HistoryTab'

import SourceForm from 'components/NodeDetails/sources/SourceForm'

class AWSS3 extends Component {
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
      dataDraft: props.node.data,
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({dataDraft: nextProps.node.data}, () => {
      // TODO get ref to editor and set line
      // editor.scrollToLine(0, true, true, () => {});
      // editor.gotoLine(0, 0, true);s
    })
  }
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  getSubTypeInfo = () => {
    return (
      <>
        <div className='row' style={{borderBottom:'solid .5px #E1E3E5'}}>
          <div className='col col-md-12' style={{paddingTop:'4px'}}>
            <label style={{paddingTop:'5px',paddingLeft:'10px'}}>SourceType:</label> AWSS3
            <button key='reload' 
              onClick={this.props.reloadData} 
              className='btn'
              title={"refresh data"}
              style={{float:'right'}}>
                <i className="fa fa-refresh" aria-hidden="true"></i>
            </button>
            <button key='reload' 
              // onClick={this.openDocumentation()} 
              className='btn'
              title={"open documentation about this node type"}
              style={{}}>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className='row hidden-xs hidden-sm'>
          <div className='col col-md-12'>
          </div>
        </div>
      </>
    )
  }
  render() {
    const { node, height } = this.props
    return (
      <div className='source-details'>
        <Tabs>
          <Panel title={node.title}>
          {this.renderRightMenuOptions()}
            <div className='row'>
              <div className='col col-md-3'>
                {this.getSubTypeInfo()}
                <ul style={{marginTop:'5px', marginBottom:'15px', paddingLeft: '0px', marignRight:'0px', listStyleType: 'none'}}>
                  <li style={{padding:'5px', paddingLeft:'15px'}}><a href='#/' onClick={(e) => {e.preventDefault()}}>file1.txt</a></li>
                  <li style={{padding:'5px', paddingLeft:'15px'}}><a href='#/' onClick={(e) => {e.preventDefault()}}>file2.csv</a></li>
                  <li style={{padding:'5px', paddingLeft:'15px'}}><a href='#/' onClick={(e) => {e.preventDefault()}}>file3.log</a></li>
                </ul>
              </div>
              <div className='col col-md-9' style={{padding:0}}>
                <AceEditor
                  mode="text"
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
            <HistoryTab params={this.props.params}></HistoryTab>
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
    e.preventDefault();
    e.stopPropagation();
    this.props.onUpdate({
      'data': this.state.dataDraft,
    }, () => {
      this.setState({ dirty: false })
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(AWSS3)
