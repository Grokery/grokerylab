from flask import request, Response

import handlers

def init(app):
    """Initualize routes"""
        
    @app.route("/")
    def hello_world():
        """Hello World"""
        return "Hello World. Im alive!"

    @app.route("/authenticate", methods=["POST"])
    def authenticate():
        """Authenticate user and return token"""
        try:
            event = {
                "httpMethod": request.method,
                "body": request.data
            }
            response = handlers.authenticate(event, None)
            return Response(response=response["body"], status=200, mimetype="application/json")
        except Exception, ex:
            print ex.message
            return "Internal Server Error", 500

    @app.route("/history", methods=["GET"])
    @app.route("/history/<collection>", methods=["GET", "POST"])
    @app.route("/history/<collection>/<item_id>", methods=["GET"])
    def history(collection=None, item_id=None):
        """Handles CRUD calls for history items"""
        try:
            event = {
                "httpMethod": request.method,
                "pathParameters": {"collection": collection, "id": item_id},
                "query": request.args,
                "body": request.data
            }
            response = handlers.history(event, None)
            return Response(response=response["body"], status=200, mimetype="application/json")
        except Exception, ex:
            print ex.message
            return "Internal Server Error", 500

    @app.route("/nodes/<collection>", methods=["GET", "POST"])
    @app.route("/nodes/<collection>/<item_id>", methods=["GET", "PUT", "DELETE"])
    def nodes(collection, item_id=None):
        """Handles CRUD calls for nodes"""
        try:
            event = {
                "httpMethod": request.method,
                "pathParameters": {"collection": collection, "id": item_id},
                "query": request.args,
                "body": request.data
            }
            foo = handlers.nodes(event, None)
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
            foo = handlers.dataflowservice(event, None)
            return Response(response=foo["body"], status=200, mimetype="application/json")
        except Exception, ex:
            print(ex.message)
            return "Internal Server Error", 500
