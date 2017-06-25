"""Server.py"""

import handlers
from flask import Flask, request, Response, json

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
            event = {
                "methodArn": request.method,
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


@app.route("/")
def hello_world():
    """Hello World"""
    return "Hello World"


@app.route("/dev/resources/<collection>", methods=["GET", "POST"])
@app.route("/dev/resources/<collection>/<item_id>", methods=["GET", "PUT", "DELETE"])
def resources(collection, item_id=None):
    """Handles CRUD calls"""
    try:
        data = None
        if request.method == "PUT" or request.method == "POST":
            data = request.data
        event = {
            "httpMethod": request.method,
            "pathParameters": {"collection": collection, "id": item_id},
            "query": {},
            "body": data
        }
        foo = handlers.resources(event, None)
        resp = Response(response=foo["body"],
            status=200,
            mimetype="application/json")
        return(resp)
    except Exception, ex:
        print ex.message
        return "Internal Server Error", 500


@app.route("/dev/dataflowservice", methods=["GET"])
def dataflowservice():
    """Handels dataflow exploration calls"""
    try:
        event = {
            "httpMethod": request.method,
            "pathParameters": None,
            "query": {},
            "body": None
        }
        foo = handlers.dataflowservice(event, None)
        resp = Response(response=foo["body"],
            status=200,
            mimetype="application/json")
        
        return(resp)
    except Exception, ex:
        print(ex.message)
        return "Internal Server Error", 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
