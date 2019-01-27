import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './SchemaExplorer.css'

class SchemaExplorer extends Component {
    static propTypes = {
        datasource: PropTypes.object
    }
    render() {
        if (this.props.datasource){
        }
        return (
            <div className='schema-explorer'>
                <div className='schema col-md-6'>
                    <ul className='schema-items'>
                        <li>id</li>
                        <li>first_name</li>
                        <li>last_name</li>
                        <li className='selected'>years_employed</li>
                        <li>hire_date</li>
                        <li>title</li>
                        <li>phone</li>
                    </ul>
                </div>
                <div className='details col-md-6'>
                    <span>type: integer</span><br />
                    <span>min: 0</span><br />
                    <span>max: 12</span><br />
                    <span>avg: 5</span><br />
                    {/* <img src='' alt='presentation'></img> */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {})(SchemaExplorer)