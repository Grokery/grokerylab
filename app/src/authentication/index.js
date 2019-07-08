import { get } from 'lodash'
import { API_BASE_URL } from "config"
import { history } from 'index'
import { isFunction } from 'lodash'

export const setRedirectUrl = (url) => {
    if (url.includes('signin') || url.includes('register') || url.includes('resetpass') || url.includes('signout')) {
        return
    }
    sessionStorage.setItem("redirectUrl", url)
}

export const getRedirectUrl = () => {
    return sessionStorage.getItem("redirectUrl")
}

export const getSessionInfo = () => {
    let sessionInfo = sessionStorage.getItem("sessionInfo")
    if (sessionInfo) {
        return JSON.parse(sessionInfo)
    }
    return null
}

export const setSessionInfo = (sessionInfo) => {
    sessionStorage.setItem("sessionInfo", JSON.stringify(sessionInfo))
}

export const isAuthenticated = () => {
    let sessionInfo = getSessionInfo()
    if (sessionInfo && sessionInfo.accountToken) {
        return true
    }
    return false
}

export const authenticate = (user, pass, onSuccess, onError) => {
    var params = {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({username: user, password: pass}),
    }
    return fetch(API_BASE_URL + "/users/authenticate", params)
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.json()
        })
        .then((json) => {
            if (isFunction(onSuccess)) {
                onSuccess(json)
            }
            setSessionInfo(json)
            let redirectUrl = getRedirectUrl()
            if (redirectUrl) {
                setRedirectUrl('/')
                history.push(redirectUrl)
            } else {
                history.push("/")
            }
        })
        .catch((errorMsg) => {
            if (isFunction(onError)) {
                onError(errorMsg)
            }
            alert(errorMsg)
        })
}

export const disAuthenticate = () => {
    delete sessionStorage.sessionInfo
}

export const getAccountToken = () => {
    return get(getSessionInfo(), ['accountToken'], null)
}

export const getCloudToken = (cloudName) => {
    return get(getSessionInfo(), ['clouds', cloudName, 'cloudToken'], null)
}

export const getCloudId = (cloudName) => {
    return get(getSessionInfo(), ['clouds', cloudName, 'cloudInfo', 'cloudId'], null)
}

export const getCloudBaseUrl = (cloudName) => {
    return get(getSessionInfo(), ['clouds', cloudName, 'cloudInfo', 'url'], null)
}

export const addNewCloudToSession = (cloud) => {
    var sessionInfo = getSessionInfo()
    sessionInfo['clouds'][cloud['cloudInfo']['name']] = cloud
    setSessionInfo(sessionInfo)
}

export const updateCloudInfoInSession = (updatedCloudInfo) => {
    var sessionInfo = getSessionInfo()
    for (var key in sessionInfo['clouds']) {
        var cloudInfo = sessionInfo['clouds'][key].cloudInfo
        if (cloudInfo.cloudId === updatedCloudInfo.cloudId) {
            if (cloudInfo.name !== updatedCloudInfo.name) {
                sessionInfo['clouds'][updatedCloudInfo.name] = sessionInfo['clouds'][cloudInfo.name]
                delete sessionInfo['clouds'][cloudInfo.name]
            }
            sessionInfo['clouds'][updatedCloudInfo.name].cloudInfo = updatedCloudInfo
            setSessionInfo(sessionInfo)
            break
        }
    }
}

export const removeCloudFromSession = (cloudName) => {
    var sessionInfo = getSessionInfo()
    delete sessionInfo['clouds'][cloudName]
    setSessionInfo(sessionInfo)
    history.replace("/")
}