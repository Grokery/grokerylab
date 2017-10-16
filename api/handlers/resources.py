"""Nodes"""

import logging
import simplejson as json

import models
import connectors
from common.actions import DID_CREATE, WILL_READ, DID_UPDATE, DID_DELETE
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

    result = {
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
        "body": json.dumps(result)
        }


def create(event):
    """Handle create event (POST)"""
    collection = event['pathParameters']['collection']
    jsondata = json.loads(event['body'])
    jsondata['collection'] = collection
    model = models.get_model(collection, jsondata)
    model.validate()
    result = db.create(model.jsonify())
    connectors.notify(DID_CREATE, request=event, result=result)
    return result


def read(event):
    """Handle read (GET) event"""
    # TODO handle projections
    if 'id' in event['pathParameters'] and event['pathParameters']['id'] is not None:
        connectors.notify(WILL_READ, request=event)
        result = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    else:
        # TODO: handle paging
        result = db.retrieve_multiple(event['pathParameters']['collection'])
    return result


def update(event):
    """Handle update (PUT) events"""
    collection = event['pathParameters']['collection']
    jsondata = json.loads(event['body'])
    jsondata['collection'] = collection
    jsondata['id'] = event['pathParameters']['id']
    model = models.get_model(collection, jsondata)
    model.validate()
    result = db.update(model.json())
    connectors.notify(DID_UPDATE, request=event, result=result)
    return result


def delete(event):
    """Handle DELETE (delete) events"""
    result = db.delete(event['pathParameters']['collection'], event['pathParameters']['id'])
    connectors.notify(DID_DELETE, request=event, result=result)
    return result
