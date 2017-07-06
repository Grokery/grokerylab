import { CALL_API } from '../middleware/api'


//--------------------------------

export const FETCHLINES_REQUEST = 'FETCHLINES_REQUEST'
export const FETCHLINES_SUCCESS = 'FETCHLINES_SUCCESS'
export const FETCHLINES_FAILURE = 'FETCHLINES_FAILURE'

export const fetchLines = (cb) => (dispatch, getState) => {
    // TODO add object id to filter on 
    dispatch({
        [CALL_API]: {
            types: [FETCHLINES_REQUEST, FETCHLINES_SUCCESS, FETCHLINES_FAILURE],
            endpoint: '/historyservice',
            method: 'GET',
            callback: cb
        }
    })
}


//--------------------------------

export const APPENDLINE_REQUEST = 'APPENDLINE_REQUEST'
export const APPENDLINE_SUCCESS = 'APPENDLINE_SUCCESS'
export const APPENDLINE_FAILURE = 'APPENDLINE_FAILURE'

export const appendLine = (collection, line, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [APPENDLINE_REQUEST, APPENDLINE_SUCCESS, APPENDLINE_FAILURE],
            endpoint: '/history/' + collection,
            method: 'POST',
            data: line,
            callback: cb
        }
    })
}