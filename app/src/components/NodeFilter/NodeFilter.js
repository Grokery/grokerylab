import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './NodeFilter.css'

class NodeFilter extends Component {
  static propTypes = {
    foo: PropTypes.string.isRequired, 
    bar: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
      this.state = {
          example: false
      }
  }
  render() {
    const { foo, bar } = this.props
    return (
      <div className='node-filter'>


          {/*<div id="filter" className="collapsible-search pull-right">
            <input id="results-filter" className="form-control hidden" type="text" defaultText="Filter" onKeyUp={this.filterOnKeyUp}></input>
            <div>
                <button id='hide-search' type='button' className='btn btn-default hidden' onClick={this._toggleShow}>
                    <i className="fa fa-times" area-hidden={true}></i>
                </button>
            </div>
            <div>
                <button id='hide-search' type='button' className='btn btn-default' onClick={this._toggleShow}>
                    <i className="fa fa-filter" area-hidden={true}></i>
                </button>
            </div>
        </div>*/}

        <a onClick={this.toggleFiltereNodes}><i className="fa fa-filter" aria-hidden="true"></i></a>
      </div>
    )
  }
  filterOnKeyUp(e) {
    let filterTextInputId = 'results-filter'
    let filterItemsClassName = 'results-item'
    let itemFilterTextClassName = 'results-item-filter-text'
    let filter = e.target.value.toLowerCase();
    let items = document.getElementsByClassName(filterItemsClassName);
    for (var i = 0; i < items.length; i++) {
        var text = this._getInnerHTML(items[i].getElementsByClassName(itemFilterTextClassName));
        if (text && text.toLowerCase().indexOf(filter) != -1)
            items[i].style.display = 'block';
        else
            items[i].style.display = 'none';
    }
  }
  getInnerHTML(item) {
    if (item && item[0]) {
        return item[0].innerText
    }
  }
  toggleFiltereNodes() {
    if (document.getElementById('filter-nodes').style.display === 'inline') {        
        document.getElementById('filter-nodes').style.display = 'none'
    } else {
        document.getElementById('filter-nodes').style.display = 'inline'
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(NodeFilter)
