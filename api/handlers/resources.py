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
    jsondata = json.loads(event['body'])
    jsondata['collection'] = event['pathParameters']['collection']
    event['model'] = models.get_model(jsondata['collection'])
    event['model'].initialize(jsondata)
    event['model'].validate()
    response = db.create(event['model'].jsonify())
    # connectors.notify(ActionTypes.DID_CREATE.name, event=event, response=response)
    return response


def read(event):
    """Handle read (GET) event"""
    # TODO handle projections
    if 'id' in event['pathParameters'] and event['pathParameters']['id'] is not None:
        response = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    else:
        # TODO: handle paging
        response = db.retrieve_multiple(event['pathParameters']['collection'])
    return response


def update(event):
    """Handle update (PUT) events"""
    jsondata = json.loads(event['body'])
    jsondata['collection'] = event['pathParameters']['collection']
    jsondata['id'] = event['pathParameters']['id']
    event['model'] = models.get_model(jsondata['collection'], jsondata)

    existing = db.retrieve(jsondata['collection'], jsondata['id'])['Item']
    existing = models.get_model(existing['collection'], existing)
    if event['model'].get_type() != existing.get_type():
        # TODO fire notification event to update item logs
        existing.transition_to(event['model'])
        event['model'].transition_from(existing)

    print(event['model'].data['collection'] + ":" + event['model'].data['type'])

    event['model'].validate()
    response = db.update(event['model'].jsonify())
    # connectors.notify(ActionTypes.DID_UPDATE.name, event=event, response=response)
    return response


def delete(event):
    """Handle DELETE (delete) events"""
    result = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    if result is not None:
        event['model'] = models.get_model(event['pathParameters']['collection'], result['Item'])
        event['model'].decomission()
    response = db.delete(event['pathParameters']['collection'], event['pathParameters']['id'])
    # connectors.notify(ActionTypes.DID_DELETE.name, event=event, response=response)
    return response
