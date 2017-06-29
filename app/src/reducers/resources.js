import * as ActionTypes from '../actions'
import _ from 'lodash'
import { APPSTATUS } from "../globals.js"

export const nodes = (state = {}, action) => {
    if (action.type === ActionTypes.FETCHNODES_SUCCESS) {
        return _.merge({}, state, action.response.Items)
    } else if (action.type === ActionTypes.FETCHNODE_SUCCESS || 
        action.type === ActionTypes.UPDATENODE_SUCCESS) {
        let foo = Object.assign({}, state)
        foo[action.response.Item.id] = action.response.Item
        return foo
    } else if (action.type === ActionTypes.DELETEENODE_SUCCESS) {
        let foo = Object.assign({}, state)
        delete foo[action.response.Item.id]
        return foo
    } else if (action.type === ActionTypes.CLEAR_NODES) {
        return {}
    } 
    return state
}

export const appStatus = (state = APPSTATUS.OK, action) => {
    if (action.type === ActionTypes.FETCHNODES_REQUEST || 
        action.type === ActionTypes.FETCHNODE_REQUEST ||
        action.type === ActionTypes.UPDATENODE_REQUEST) {
        return APPSTATUS.BUSY
    } else if (action.type === ActionTypes.FETCHNODES_SUCCESS ||
        action.type === ActionTypes.FETCHNODE_SUCCESS ||
        action.type === ActionTypes.UPDATENODE_SUCCESS) {
        return APPSTATUS.OK
    } else if (action.type === ActionTypes.FETCHNODES_FAILURE || 
        action.type === ActionTypes.FETCHNODE_FAILURE ||
        action.type === ActionTypes.UPDATENODE_FAILURE) {
        return APPSTATUS.ERROR
    } else if (action.type === ActionTypes.SET_APPSTATUS) {
        return action.status
    }
    return state
}