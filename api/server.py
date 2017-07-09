"""Server.py"""

import controllers
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
            response = controllers.authorize(event, None)
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


@app.route("/history", methods=["GET"])
@app.route("/history/<collection>", methods=["GET", "POST"])
@app.route("/history/<collection>/<item_id>", methods=["GET"])
def history(collection=None, item_id=None):
    """Handles CRUD calls"""
    try:
        event = {
            "httpMethod": request.method,
            "pathParameters": {"collection": collection, "id": item_id},
            "query": request.args,
            "body": request.data
        }
        response = controllers.history(event, None)
        return Response(response=response["body"], status=200, mimetype="application/json")
    except Exception, ex:
        print ex.message
        return "Internal Server Error", 500

@app.route("/nodes/<collection>", methods=["GET", "POST"])
@app.route("/nodes/<collection>/<item_id>", methods=["GET", "PUT", "DELETE"])
def nodes(collection, item_id=None):
    """Handles CRUD calls"""
    try:
        event = {
            "httpMethod": request.method,
            "pathParameters": {"collection": collection, "id": item_id},
            "query": request.args,
            "body": request.data
        }
        foo = controllers.nodes(event, None)
        return Response(response=foo["body"], status=200, mimetype="application/json")
    except Exception, ex:
        print ex.message
        return "Internal Server Error", 500


@app.route("/dataflowservice", methods=["GET"])
def dataflowservice():
    """Handels dataflow exploration calls"""
    try:
        event = {
            "httpMethod": request.method,
            "pathParameters": None,
            "query": request.args,
            "body": None
        }
        foo = controllers.dataflowservice(event, None)
        return Response(response=foo["body"], status=200, mimetype="application/json")
    except Exception, ex:
        print(ex.message)
        return "Internal Server Error", 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)