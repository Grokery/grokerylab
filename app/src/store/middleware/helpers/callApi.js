
export const callApi = (baseUrl, token, actionInfo) => {
    const { method, endpoint, data, callback } = actionInfo
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
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                if (typeof(callback) === 'function') {
                    return callback(response, json)
                }
                return json
            })
        )
}