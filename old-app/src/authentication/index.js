import { AUTH_URL } from "../globals.js"
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
    if (sessionInfo && sessionInfo.token){
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
    return fetch(AUTH_URL, params)
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

export const setSelectedCloud = (cloudId) => {
    let sessionInfo = getSessionInfo()
    if (sessionInfo && sessionInfo['clouds']) {
        sessionInfo['selectedCloud'] = sessionInfo['clouds'][cloudId]
        sessionStorage.setItem("sessionInfo", JSON.stringify(sessionInfo))
    }
}