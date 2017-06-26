

// Causes application to run in verbose mode printing debug information to console
export const DEBUG_MODE = process.env.NODE_ENV !== 'production'

// If debug mode, prints debug info to console
export const debug = function(info) {
    if (DEBUG_MODE) {
        console.log(info)
    }
}

// If debug mode, prints error info to console
export const error = function(info) {
    if (DEBUG_MODE) {
        console.error(info)
    }
}

// Authentication and authorization constants
export const AUTH_ENABLED = process.env.AUTH_ENABLED === true
export const AUTH_URL = "" 

// Default API 
export const DEFAULT_SESSION_INFO = {
    "username": "yourusername@domain.com",
    "clouds": {
        "local": {
            "name": "Localhost",
            "id": "local",
            "type": "local",
            "url": "http://localhost:5000/dev"
        }
    },
    "token": "disabled"
}

// App Status indicators
export const APPSTATUS = {
    OK: "ok",
    BUSY: "busy",
    ERROR: "error"
}