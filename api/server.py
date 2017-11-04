"""Server.py"""

import os
import logging
from os.path import join, dirname
from dotenv import load_dotenv
from flask import Flask, request
from flasgger import Swagger

import handlers
import routes

load_dotenv(join(dirname(__file__), '.env'))

logging.basicConfig(format='%(asctime)s:%(levelname)s: %(message)s', level=logging.DEBUG)

app = Flask(__name__)

app.config['SWAGGER'] = {
    "swagger_version": "2.0",
    "title": "GrokeryLab",
    "specs": [
        {
            "version": "0.0.1",
            "title": "GrokeryLab Api v0",
            "endpoint": 'v0_spec',
            "description": "Grokerylab is an integrated data flow management platform",
            "route": '/v0/spec'
        }
    ]
}
swagger = Swagger(app)

routes.init(app)

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
            if response['policyDocument']['Statement'][0]['Effect'] is "Allow":
                pass
            else:
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


if __name__ == "__main__":
    app.run(host=os.environ.get('FLASK_HOST'), debug=os.environ.get('DEBUG')=="True")
