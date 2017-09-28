"""Server.py"""

from flask import Flask, request, Response, json

import handlers
import routes

AUTH_ENABLED = False

app = Flask(__name__)


@app.before_request
def before_request():
    """CORS"""
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        resheads = response.headers
        reqheaders = request.headers
        resheads['Access-Control-Allow-Origin'] = reqheaders['Origin']
        resheads['Access-Control-Allow-Methods'] = reqheaders['Access-Control-Request-Method']
        resheads['Access-Control-Max-Age'] = "10"
        if 'ACCESS_CONTROL_REQUEST_HEADERS' in reqheaders:
            resheads['Access-Control-Allow-Headers'] = reqheaders['ACCESS_CONTROL_REQUEST_HEADERS']
        return response
    else:
        if AUTH_ENABLED:
            token = request.headers.get('Authorization', '')
            if not token:
                return "", 401
            # TODO Get actual endpoint to pass to authorize func
            event = {
                "endpoint": "ENDPOINTHERE",
                "method": request.method,
                "authorizationToken": token
            }
            response = handlers.authorize(event, None)
            if response['policyDocument']['Statement'][0]['Effect'] is not "Allow":
                return "", 401


@app.after_request
def after_request(response):
    """CORS"""
    if request.method != 'OPTIONS' and 'Origin' in request.headers:
        response.headers['Access-Control-Allow-Origin'] = request.headers['Origin']
    return response


routes.init(app)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
