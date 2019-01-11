import { CALL_API } from 'store/middleware/api'
import { getAccountToken } from 'authentication'


//--------------------------------

export const FETCHLOGS_REQUEST = 'FETCHLOGS_REQUEST'
export const FETCHLOGS_SUCCESS = 'FETCHLOGS_SUCCESS'
export const FETCHLOGS_FAILURE = 'FETCHLOGS_FAILURE'

export const fetchLogs = (nodeid, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [FETCHLOGS_REQUEST, FETCHLOGS_SUCCESS, FETCHLOGS_FAILURE],
            endpoint: '/logs?referenceid='+nodeid,
            method: 'GET',
            token: getAccountToken(),
            callback: cb
        }
    })
}

//--------------------------------

export const APPENDLOGS_REQUEST = 'APPENDLOGS_REQUEST'
export const APPENDLOGS_SUCCESS = 'APPENDLOGS_SUCCESS'
export const APPENDLOGS_FAILURE = 'APPENDLOGS_FAILURE'

export const appendLogItem = (collection, item, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [APPENDLOGS_REQUEST, APPENDLOGS_SUCCESS, APPENDLOGS_FAILURE],
            endpoint: '/logs/' + collection,
            method: 'POST',
            data: item,
            callback: cb
        }
    })
}