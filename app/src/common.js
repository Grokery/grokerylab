

export const NODETYPE = {
    JOB: "JOB",
    SOURCE: "SOURCE",
    BOARD: "BOARD",
}

export const APPSTATUS = {
    OK: "ok",
    BUSY: "busy",
    ERROR: "error"
}

// TODO make a separate npm package
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
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}