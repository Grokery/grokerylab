"""Resources"""

import logging
import simplejson as json

import models
import connectors
from common import ActionTypes
from database import db

logger = logging.getLogger()

def main(event, context):
    """Resources main handler method"""

    global db

    if context and "db" in context:
        db = context['db']
    if context and "models" in context:
        models = context['models']
    if context and "logger" in context:
        logger = context['logger']

    response = {
        'POST': create,
        'GET': read,
        'PUT':  update,
        'DELETE': delete,
    }[event['httpMethod']](event)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps(response)
        }


def create(event):
    """Handle create event (POST)"""
    collection = event['pathParameters']['collection']
    jsondata = json.loads(event['body'])
    jsondata['collection'] = collection
    event['model'] = models.get_model(collection, jsondata)
    event['model'].validate()
    response = db.create(event['model'].jsonify())
    connectors.notify(ActionTypes.DID_CREATE.name, event=event, response=response)
    return response


def read(event):
    """Handle read (GET) event"""
    # TODO handle projections
    if 'id' in event['pathParameters'] and event['pathParameters']['id'] is not None:
        connectors.notify(ActionTypes.WILL_READ.name, event=event)
        response = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    else:
        # TODO: handle paging
        response = db.retrieve_multiple(event['pathParameters']['collection'])
    return response


def update(event):
    """Handle update (PUT) events"""
    collection = event['pathParameters']['collection']
    jsondata = json.loads(event['body'])
    jsondata['collection'] = collection
    jsondata['id'] = event['pathParameters']['id']
    event['model'] = models.get_model(collection, jsondata)
    event['model'].validate()
    response = db.update(event['model'].jsonify())
    connectors.notify(ActionTypes.DID_UPDATE.name, event=event, response=response)
    return response


def delete(event):
    """Handle DELETE (delete) events"""
    item = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    if item is None:
        raise Exception("Not Found")
    event['model'] = models.get_model(event['pathParameters']['collection'], item)
    response = db.delete(event['pathParameters']['collection'], event['pathParameters']['id'])
    connectors.notify(ActionTypes.DID_DELETE.name, event=event, response=response)
    return response
