import { FETCHNODES_SUCCESS, CREATENODE_SUCCESS, FETCHNODE_SUCCESS, 
    DELETEENODE_SUCCESS, CLEAR_NODES, UPDATENODE_SUCCESS } from 'store/actions/nodes'
import { cloneDeep } from 'lodash'

export const nodes = (state = {}, action) => {

    if (action.type === FETCHNODES_SUCCESS) {
        state = action.response.data
    } 
    else if (action.type === CREATENODE_SUCCESS ||
        action.type === UPDATENODE_SUCCESS ||
        action.type === FETCHNODE_SUCCESS) {
        let newState = cloneDeep(state)
        newState[action.response.nodeId] = action.response
        state = newState
    } 
    else if (action.type === DELETEENODE_SUCCESS) {
        let newState = cloneDeep(state)
        delete newState[action.response.nodeId]
        state = newState
    } 
    else if (action.type === CLEAR_NODES) {
        state = {}
    }

    return state
}
