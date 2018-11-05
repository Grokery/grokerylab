//------------------------------------------------
// Middleware for calling REST api endpoints
//------------------------------------------------

import { ADMIN_API_BASE_URL } from "config"
import { callApi } from './helpers/callApi'
import { getAccountToken, getSelectedCloudUrl, getSelectedCloudToken } from 'authentication'

export const CALL_ADMIN_API = Symbol('Call admin API')
export const adminApi = store => next => action => {
    const actionInfo = action[CALL_ADMIN_API]
    if (typeof actionInfo === 'undefined') {
        return next(action)
    }

    const [requestType, successType, failureType] = actionInfo.types
    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_ADMIN_API]
        return finalAction
    }
    next(actionWith({ type: requestType }))

    return callApi(ADMIN_API_BASE_URL, getAccountToken(), actionInfo).then(
        response => next(actionWith({
            response,
            type: successType
        })),
        error => next(actionWith({
            type: failureType,
            error: error.message || 'Error Calling admin API'
        }))
    )
}

export const CALL_CLOUD_API = Symbol('Call cloud API')
export const cloudApi = store => next => action => {
    const actionInfo = action[CALL_CLOUD_API]
    if (typeof actionInfo === 'undefined') {
        return next(action)
    }

    const [requestType, successType, failureType] = actionInfo.types
    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_CLOUD_API]
        return finalAction
    }
    next(actionWith({ type: requestType }))

    return callApi(getSelectedCloudUrl(), getSelectedCloudToken(), actionInfo).then(
        response => next(actionWith({
            response,
            type: successType
        })),
        error => next(actionWith({
            type: failureType,
            error: error.message || 'Error Calling cloud API'
        }))
    )
}
