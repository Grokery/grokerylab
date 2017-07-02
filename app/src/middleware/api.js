//------------------------------------------------
// Middleware for calling REST api endpoints
//------------------------------------------------

import { AUTH_ENABLED } from "../globals.js"
import { getSessionInfo } from '../authentication'

const callApi = (endpoint, method, data, token, callback) => {
    var myHeaders = new Headers({
        "Content-Type":"application/json"
    })
    if (AUTH_ENABLED && token) {
        myHeaders.append("Authorization", token)
    }
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

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// Interprets actions with CALL_API info specified
// Performs call and promises when actions are dispatched
export default store => next => action => {
    const callApiActionInfo = action[CALL_API]
    if (typeof callApiActionInfo === 'undefined') {
        return next(action)
    }

    const { types } = callApiActionInfo
    const [requestType, successType, failureType] = types
    
    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }
    
    next(actionWith({ type: requestType }))
    
    const { endpoint, method, data, callback } = callApiActionInfo
    const sessionInfo = getSessionInfo()
    const fullUrl = sessionInfo['selectedCloud']['url'] + endpoint
    const token = sessionInfo['token']
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