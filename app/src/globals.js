
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

// Update query string params in url
export const updateQueryParam = function(key, value) {
  let uri = window.location.href
  let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i")
  let separator = uri.indexOf('?') !== -1 ? "&" : "?"
  let result = uri + separator + key + "=" + value
  if (uri.match(re)) {
    result = uri.replace(re, '$1' + key + "=" + value + '$2')
  }
  window.history.pushState({}, '', result)
}

// Get query string param value by name
export const getQueryParamByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Authentication and authorization constants
export const AUTH_ENABLED = true
// export const AUTH_URL = "https://hst1vasy9i.execute-api.us-west-2.amazonaws.com/dev/authenticate" 
export const AUTH_URL = "http://localhost:5000/authenticate" 

// Default API 
export const DEFAULT_SESSION_INFO = {
    "username": "admin@fakedomian.com",
    "name":"admin",
    "clouds": {
        "local": {
            "name": "Localhost",
            "id": "local",
            "type": "local",
            "url": "http://localhost:5000"
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