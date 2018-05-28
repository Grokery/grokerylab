//------------------------------------------------
// Middleware for calling REST api endpoints
//------------------------------------------------

import { GROKERY_API } from "../../config.js"
import { getAccountToken, getSelectedCloudUrl, getSelectedCloudToken } from '../../authentication'

const callApi = (endpoint, method, data, token, callback) => {
    var myHeaders = new Headers({
        "Content-Type":"application/json"
    })
    myHeaders.append("Authorization", token)
    var params = { 
        method: method ? method : "GET",
        headers: myHeaders,
        mode: "cors"
    }
    if (data && (method === 'POST' || method === "PUT")) {
        params['body'] = JSON.stringify(data)
    }
    return fetch(endpoint, params)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                if (typeof(callback) === 'function') {
                    callback(json)
                }
                return json
            })
        )
}

export const CALL_GROKERY_API = Symbol('Call Grokery API')
export const grokeryApi = store => next => action => {
    const callApiActionInfo = action[CALL_GROKERY_API]
    if (typeof callApiActionInfo === 'undefined') {
        return next(action)
    }

    const { types } = callApiActionInfo
    const [requestType, successType, failureType] = types

    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_GROKERY_API]
        return finalAction
    }
    
    next(actionWith({ type: requestType }))
    
    const { endpoint, method, data, callback } = callApiActionInfo
    const fullUrl = GROKERY_API + endpoint
    const token = getAccountToken()

    return callApi(fullUrl, method, data, token, callback).then(
        response => next(actionWith({
            response,
            type: successType
        })),
        error => next(actionWith({
            type: failureType,
            error: error.message || 'Error Calling API'
        }))
    )
}

export const CALL_CLOUD_API = Symbol('Call API')

export const cloudApi = store => next => action => {
    const callApiActionInfo = action[CALL_CLOUD_API]
    if (typeof callApiActionInfo === 'undefined') {
        return next(action)
    }

    const { types } = callApiActionInfo
    const [requestType, successType, failureType] = types
    
    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_CLOUD_API]
        return finalAction
    }
    
    next(actionWith({ type: requestType }))
    
    const { endpoint, method, data, callback } = callApiActionInfo
    const fullUrl = getSelectedCloudUrl() + endpoint
    const token = getSelectedCloudToken()

    return callApi(fullUrl, method, data, token, callback).then(
        response => next(actionWith({
            response,
            type: successType
        })),
        error => next(actionWith({
            type: failureType,
            error: error.message || 'Error Calling API'
        }))
    )
}
