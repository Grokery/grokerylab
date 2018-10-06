

const callApi = (endpoint, method, data, token, callback) => {
    var myHeaders = new Headers({
        "Content-Type":"application/json"
    })
    myHeaders.append("Authorization", token)
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
                if (typeof(callback) === 'function') {
                    callback(response, json)
                }
                if (!response.ok) {
                    return Promise.reject(json)
                }
                return json
            })
        )
}