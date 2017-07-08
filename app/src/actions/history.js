import { CALL_API } from '../middleware/api'


//--------------------------------

export const FETCHHISTORY_REQUEST = 'FETCHHISTORY_REQUEST'
export const FETCHHISTORY_SUCCESS = 'FETCHHISTORY_SUCCESS'
export const FETCHHISTORY_FAILURE = 'FETCHHISTORY_FAILURE'

export const fetchHistory = (nodeid, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHHISTORY_REQUEST, FETCHHISTORY_SUCCESS, FETCHHISTORY_FAILURE],
            endpoint: '/history?nodeid=' + nodeid,
            method: 'GET',
            callback: cb
        }
    })
}

//--------------------------------

export const APPENDHISTORY_REQUEST = 'APPENDHISTORY_REQUEST'
export const APPENDHISTORY_SUCCESS = 'APPENDHISTORY_SUCCESS'
export const APPENDHISTORY_FAILURE = 'APPENDHISTORY_FAILURE'

export const appendHistoryItem = (item, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [APPENDHISTORY_REQUEST, APPENDHISTORY_SUCCESS, APPENDHISTORY_FAILURE],
            endpoint: '/history',
            method: 'POST',
            data: item,
            callback: cb
        }
    })
}