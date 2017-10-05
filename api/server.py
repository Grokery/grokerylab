"""Server.py"""

import os
from os.path import join, dirname
from dotenv import load_dotenv
from flask import Flask, request

import handlers
import routes

load_dotenv(join(dirname(__file__), '.env'))

# TODO init logging

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
    elif os.environ.get('AUTH_ENABLED') == "True":
        token = request.headers.get('Authorization', '')
        if token:
            response = handlers.authorize({
                "path": request.path,
                "method": request.method,
                "authorizationToken": token
            }, None)
            if response['policyDocument']['Statement'][0]['Effect'] is not "Allow":
                return "unauthorized", 401
        elif not token and "authenticate" in request.path and request.method == "POST":
            return routes.make_response({
                "body": request.data
            }, handlers.authenticate)
        else:
            return "unauthorized", 401


@app.after_request
def after_request(response):
    """CORS"""
    if request.method != 'OPTIONS' and 'Origin' in request.headers:
        response.headers['Access-Control-Allow-Origin'] = request.headers['Origin']
    return response


routes.init(app)


if __name__ == "__main__":
    app.run(host=os.environ.get('FLASK_HOST'), debug=os.environ.get('DEBUG')=="True")
