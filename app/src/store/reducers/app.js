import { SET_APPSTATUS } from 'store/actions/app'
import { FETCHNODES_REQUEST, FETCHNODE_REQUEST, UPDATENODE_REQUEST,
    FETCHNODES_SUCCESS, FETCHNODE_SUCCESS, UPDATENODE_SUCCESS, 
    FETCHNODES_FAILURE, FETCHNODE_FAILURE, UPDATENODE_FAILURE } from 'store/actions/nodes'
import { APPSTATUS } from "common"

export const appStatus = (state = APPSTATUS.OK, action) => {
    if (action.type === FETCHNODES_REQUEST ||
        action.type === FETCHNODE_REQUEST ||
        action.type === UPDATENODE_REQUEST) {
        return APPSTATUS.BUSY
    } else if (action.type === FETCHNODES_SUCCESS ||
        action.type === FETCHNODE_SUCCESS ||
        action.type === UPDATENODE_SUCCESS) {
        return APPSTATUS.OK
    } else if (action.type === FETCHNODES_FAILURE ||
        action.type === FETCHNODE_FAILURE ||
        action.type === UPDATENODE_FAILURE) {
        return APPSTATUS.ERROR
    } else if (action.type === SET_APPSTATUS) {
        return action.status
    }
    return state
}