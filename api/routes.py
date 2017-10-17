"""TODO add docstring"""

import os
import logging
from flask import request, Response
from flasgger import swag_from

import handlers

# TODO proper logging
logger = logging.getLogger()

def init(app):
    """Initualize routes"""
    app.add_url_rule('/', 'hello', view_func=hello)

    # API Routes
    app.add_url_rule('/authenticate', 'authenticate', view_func=authenticate, methods=["POST"])
    app.add_url_rule('/definitions', 'definition', view_func=definition, methods=["GET"])
    app.add_url_rule('/definitions/<definitiontype>', 'definitions', view_func=definitions, methods=["GET"])
    app.add_url_rule('/resources/<collection>', 'resources', view_func=resources, methods=["GET", "POST"])
    app.add_url_rule('/resources/<collection>/<item_id>', 'resource', view_func=resource, methods=["GET", "PUT", "DELETE"])
    app.add_url_rule('/dataflowservice', 'dataflowservice', view_func=dataflowservice, methods=["GET"])

    # Deprecated Routes
    app.add_url_rule("/history", 'history', view_func=history, methods=["GET"])
    app.add_url_rule("/history/<collection>", 'history', view_func=history, methods=["GET", "POST"])
    app.add_url_rule("/history/<collection>/<item_id>", 'history', view_func=history, methods=["GET"])


def hello():
    """Hello World"""
    return "Hello World. Im alive!"


def todo():
    """Todo placeholder"""
    return "Not Implemented"


@swag_from('swagger/authenticate.yml')
def authenticate():
    """Authenticates user"""
    return make_response({
        "httpMethod": request.method,
        "body": request.data
    }, handlers.authenticate)

# TODO add swagger docs
def definitions(definitiontype):
    """Handles requests for global definitions"""
    return make_response({
        "httpMethod": request.method,
        "pathParameters": {"definitiontype": definitiontype},
        "query": request.args,
        "body": request.data
    }, handlers.definitions)

# TODO add swagger docs
def definition():
    """Handles requests for global definitions"""
    return make_response({
        "httpMethod": request.method,
        "pathParameters": {},
        "query": request.args,
        "body": request.data
    }, handlers.definitions)

@swag_from('swagger/resources_get.yml', endpoint='resources', methods=['GET'])
@swag_from('swagger/resources_post.yml', endpoint='resources', methods=['POST'])
def resources(collection, item_id=None):
    """Handles CRUD operations on atomic objects"""
    return make_response({
        "httpMethod": request.method,
        "pathParameters": {"collection": collection, "id": item_id},
        "query": request.args,
        "body": request.data
    }, handlers.resources)

@swag_from('swagger/resource_get.yml', endpoint='resource', methods=['GET'])
@swag_from('swagger/resource_put.yml', endpoint='resource', methods=['PUT'])
@swag_from('swagger/resource_delete.yml', endpoint='resource', methods=['DELETE'])
def resource(collection, item_id=None):
    """Handles CRUD operations on atomic objects"""
    return make_response({
        "httpMethod": request.method,
        "pathParameters": {"collection": collection, "id": item_id},
        "query": request.args,
        "body": request.data
    }, handlers.resources)

@swag_from('swagger/dataflowservice.yml')
def dataflowservice():
    """"""
    return make_response({
        "httpMethod": request.method,
        "pathParameters": None,
        "query": request.args,
        "body": None
    }, handlers.dataflowservice)

# TODO remove this
def history(collection=None, item_id=None):
    """Depricated"""
    return make_response({
        "httpMethod": request.method,
        "pathParameters": {"collection": collection, "id": item_id},
        "query": request.args,
        "body": request.data
    }, handlers.history)


def make_response(event, handler):
    """Make API response"""
    if os.environ.get('DEBUG') == "True":
        return Response(response=handler(event, {})["body"], status=200, mimetype="application/json")
    else:
        try:
            return Response(response=handler(event, {})["body"], status=200, mimetype="application/json")
        except Exception as ex:
            # TODO handle important exception types seprately
            # TODO retern debug info if DEBUG
            # logger.debug(ex)
            return "Internal Server Error", 500
