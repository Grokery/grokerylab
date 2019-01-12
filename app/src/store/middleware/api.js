//------------------------------------------------
// Middleware for calling REST api endpoints
//------------------------------------------------

import { API_BASE_URL } from "config"

const callApi = (baseUrl, actionInfo) => {
    const { method, endpoint, data, token, callback } = actionInfo
    var params = {
        method: method,
        mode: "cors",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": token,
        }),
    }
    if (data && (method === 'POST' || method === "PUT")) {
        params['body'] = JSON.stringify(data)
    }
    return fetch(baseUrl + endpoint, params)
        .then(response => response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                if (typeof(callback) === 'function') {
                    return callback(json, response)
                }
                return json
            })
        )
}

export const CALL_API = Symbol('Call admin API')
export const grokeryApi = store => next => action => {
    const actionInfo = action[CALL_API]
    if (typeof actionInfo === 'undefined') {
        return next(action)
    }

    const [requestType, successType, failureType] = actionInfo.types
    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }
    next(actionWith({ type: requestType }))
    return callApi(API_BASE_URL, actionInfo).then(
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
