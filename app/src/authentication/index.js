import { GROKERY_API } from "../config.js"
import { history } from '../index.js'

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

export const authenticate = (user, pass) => {
    var params = { 
        method: 'POST',
        mode: 'cors',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({username: user, password: pass})
    }
    return fetch(GROKERY_API+"/auth/signin", params)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                setSessionInfo(json)
                let redirectUrl = getRedirectUrl()
                if (redirectUrl) {
                    setRedirectUrl('')
                    history.replace(redirectUrl)
                } else {
                    history.replace("/")
                }
            })
        )
}

export const disAuthenticate = () => {
    delete sessionStorage.sessionInfo
}

export const getAccountToken = () => {
    return getSessionInfo()['accountToken']
}

export const setSelectedCloudName = (name) => {
    sessionStorage.setItem("selectedCloudName", name)
}

export const getSelectedCloudName = () => {
    return sessionStorage.getItem("selectedCloudName")
}

export const getSelectedCloudId = () => {
    return getSessionInfo()['clouds'][getSelectedCloudName()]['cloudId']
}

export const getSelectedCloudUrl = () => {
    return getSessionInfo()['clouds'][getSelectedCloudName()]['url']
}

export const getSelectedCloudToken = () => {
    return getSessionInfo()['clouds'][getSelectedCloudName()]['cloudToken']
}

export const setBaseUrlForCloudName = (name, url) => {
    var sessionInfo = getSessionInfo()
    sessionInfo['clouds'][name]['url'] = url
    setSessionInfo(sessionInfo)
}

export const addNewCloudToSession = (cloud) => {
    var sessionInfo = getSessionInfo()
    sessionInfo['clouds'][cloud['name']] = cloud
    setSessionInfo(sessionInfo)
    history.replace("/")
}