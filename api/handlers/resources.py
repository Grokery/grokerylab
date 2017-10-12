"""Nodes"""

import logging
import simplejson as json

import models
import connectors
from common.actions import DID_CREATE, DID_READ, DID_UPDATE, DID_DELETE
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
    # TODO: instaiate model that can validate input
    #event['item'] = models.get_model(collection, event['body'])
    item = json.loads(event['body'])
    item['collection'] = event['pathParameters']['collection']
    result = db.create(item)
    connectors.notify(DID_CREATE, request=event, result=result)
    return result


def read(event):
    """Handle read (GET) event"""
    # TODO handle projections
    if 'id' in event['pathParameters'] and event['pathParameters']['id'] is not None:
        result = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
        connectors.notify(DID_READ, request=event, result=result)
    else:
        # TODO: handle paging
        result = db.retrieve_multiple(event['pathParameters']['collection'])
    return result


def update(event):
    """Handle update (PUT) events"""
    # TODO: instaiate model that can validate input
    #event['item'] = models.get_model(collection, event['body'])
    item = json.loads(event['body'])
    item['collection'] = event['pathParameters']['collection']
    item['id'] = event['pathParameters']['id']
    result = db.update(item)
    connectors.notify(DID_UPDATE, request=event, result=result)
    return result


def delete(event):
    """Handle DELETE (delete) events"""
    result = db.delete(event['pathParameters']['collection'], event['pathParameters']['id'])
    connectors.notify(DID_DELETE, request=event, result=result)
    return result

