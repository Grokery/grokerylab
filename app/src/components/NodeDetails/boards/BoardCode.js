import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
import 'brace/mode/html'
import 'brace/theme/github'

// import IBoardFrame from 'shared/IBoardFrame/IBoardFrame'

class BoardCode extends Component {
  static propTypes = {
    node: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    addRightMenuOptions: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
  }
  constructor(props) {
    super(props)
    props.addRightMenuOptions([
      <a href='' onClick={this.updateCode} className='btn btn-default'><i className='fa fa-save'></i></a>
    ])
    this.state = {
      draft: props.node['source'],
    }
  }
  onChange = (newCode) => {
    this.setState({ draft: newCode })
  }
  updateCode = (e) => {
    e.preventDefault()
    this.props.onUpdate({
      'source': this.state.draft
    })
  }
  render() {
    // let { node } = this.props
    // let synced = this.state.draft === node.source
    return (
      <div className='board-code-tab'>
        {/* <div style={{paddingRight:'11px', position:'absolute', top:'50px', right:'0px', zIndex:2}}> */}
          {/* TODO move this up with the tab bar icons and put an adjustable preview window here that can toggle between galary preview and board view mode*/}
          {/* <div style={{fontSize:'16px'}}>
            {synced ? <i title='all changes saved' className='fa fa-check'></i> : 
              <i onClick={this.updateCode} className='fa fa-save' style={{cursor:'pointer'}} title='unsaved changes'></i>}
          </div>
        </div> */}
        {/* <div style={{height:250, width:430, position:'sticky', top:'60px', right:'0px', boxShadow: '0px 4px 8px #aaa', backgroundColor:'white', overflow:'hidden', zIndex:2, float:'right'}}>
          <div><IBoardFrame cloudName={params.cloudName} boardId={params.nodeId} height={250} width={430}></IBoardFrame></div>
        </div> */}
        <AceEditor
              mode="html"
              theme="github"
              onChange={this.onChange}
              fontSize={12}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={this.state.draft}
              width={'100%'}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
                maxLines: 1000,
              }}
            />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    node: state.nodes[ownProps.params.nodeId]
  }
}

export default connect(mapStateToProps, {})(BoardCode)
