import { get } from 'lodash'
import { API_BASE_URL } from "config"
import { history } from 'index'
import { isFunction } from 'util';

export const setRedirectUrl = (url) => {
    sessionStorage.setItem("redirectUrl", url)
}

export const getRedirectUrl = () => {
    return sessionStorage.getItem("redirectUrl")
}

export const getSessionInfo = () => {
    let sessionInfo = sessionStorage.getItem("sessionInfo")
    if (sessionInfo) {
        return JSON.parse(sessionInfo);
    }
    return null
}

export const setSessionInfo = (sessionInfo) => {
    sessionStorage.setItem("sessionInfo", JSON.stringify(sessionInfo))
}

export const isAuthenticated = () => {
    let sessionInfo = getSessionInfo()
    if (sessionInfo && sessionInfo.accountToken){
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
                throw Error(response.statusText);
            }
            return response.json()
        })
        .then((json) => {
            if (isFunction(onSuccess)) {
                onSuccess(json);
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
                onError(errorMsg);
            }
            alert(errorMsg)
        });
}

export const disAuthenticate = () => {
    delete sessionStorage.sessionInfo
}

export const getAccountToken = () => {
    return get(getSessionInfo(), ['accountToken'], null)
}

export const getCloudId = (cloudName) => {
    return get(getSessionInfo(), ['clouds', cloudName, 'cloudId'], null)
}

export const getCloudToken = (cloudName) => {
    return get(getSessionInfo(), ['clouds', cloudName, 'cloudToken'], null)
}

export const addNewCloudToSession = (cloud) => {
    var sessionInfo = getSessionInfo()
    sessionInfo['clouds'][cloud['name']] = cloud
    setSessionInfo(sessionInfo)
    history.replace("/")
}

export const removeCloudFromSession = (cloudName) => {
    var sessionInfo = getSessionInfo()
    delete sessionInfo['clouds'][cloudName]
    setSessionInfo(sessionInfo)
    history.replace("/")
}