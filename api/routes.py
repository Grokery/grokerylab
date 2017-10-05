""""""
import logging
from flask import request, Response

import handlers

logger = logging.getLogger()

# TODO clean up / design good api routes and document with swagger

def init(app):
    """Initualize routes"""

    @app.route("/")
    def hello_world():
        """Hello World"""
        return "Hello World. Im alive!"

    @app.route("/authenticate", methods=["POST"])
    def authenticate():
        """Authenticate user.

            Expects: {"username":String,"password":String} in body
        """
        return make_response({
            "httpMethod": request.method,
            "body": request.data
        }, handlers.authenticate)

    @app.route("/history", methods=["GET"])
    @app.route("/history/<collection>", methods=["GET", "POST"])
    @app.route("/history/<collection>/<item_id>", methods=["GET"])
    def history(collection=None, item_id=None):
        """Depricated"""
        return make_response({
            "httpMethod": request.method,
            "pathParameters": {"collection": collection, "id": item_id},
            "query": request.args,
            "body": request.data
        }, handlers.history)

    @app.route("/resources/<collection>", methods=["GET", "POST"])
    @app.route("/resources/<collection>/<item_id>", methods=["GET", "PUT", "DELETE"])
    def resources(collection, item_id=None):
        """Handles CRUD operations on atomic objects"""
        return make_response({
            "httpMethod": request.method,
            "pathParameters": {"collection": collection, "id": item_id},
            "query": request.args,
            "body": request.data
        }, handlers.resources)


    @app.route("/dataflowservice", methods=["GET"])
    def dataflowservice():
        """"""
        return make_response({
            "httpMethod": request.method,
            "pathParameters": None,
            "query": request.args,
            "body": None
        }, handlers.dataflowservice)

def make_response(event, handler):
    """Make API response"""
    # try:
    return Response(response=handler(event, {})["body"], status=200, mimetype="application/json")
    # except Exception as ex:
    #     # TODO handle important exception types seprately
    #     # TODO retern debug info if DEBUG
    #     # logger.debug(ex)
    #     return "Internal Server Error", 500
