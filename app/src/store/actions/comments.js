import { CALL_API } from 'store/middleware/api'
import { getCloudToken, getCloudId } from 'authentication'

//--------------------------------

export const CREATECOMMENT_REQUEST = 'CREATECOMMENT_REQUEST'
export const CREATECOMMENT_SUCCESS = 'CREATECOMMENT_SUCCESS'
export const CREATECOMMENT_FAILURE = 'CREATECOMMENT_FAILURE'

export const createComment = (cloudName, data, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [CREATECOMMENT_REQUEST, CREATECOMMENT_SUCCESS, CREATECOMMENT_FAILURE],
            endpoint: '/clouds/' + getCloudId(cloudName) + '/comments',
            method: 'POST',
            token: getCloudToken(cloudName),
            data: data,
            callback: cb
        }
    })
}

//--------------------------------

export const QUERYCOMMENTS_REQUEST = 'QUERYCOMMENTS_REQUEST'
export const QUERYCOMMENTS_SUCCESS = 'QUERYCOMMENS_SUCCESS'
export const QUERYCOMMENTS_FAILURE = 'QUERYCOMMENTS_FAILURE'

export const queryComments = (cloudName, query, cb) => (dispatch, getState) => {
    dispatch({
        [CALL_API]: {
            types: [QUERYCOMMENTS_REQUEST, QUERYCOMMENTS_SUCCESS, QUERYCOMMENTS_FAILURE],
            endpoint: '/clouds/' + getCloudId(cloudName) + '/comments/search' + (query ? query : ''),
            method: 'GET',
            token: getCloudToken(cloudName),
            callback: cb
        }
    })
}
