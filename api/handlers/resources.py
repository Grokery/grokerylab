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
    body = json.loads(event['body'])
    body['collection'] = event['pathParameters']['collection']
    if 'subtype' not in body:
        body['subtype'] = ""
    event['model'] = models.get_model(body['collection'], body['subtype'])
    event['model'].initialize(body)
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
    body = json.loads(event['body'])
    body['id'] = event['pathParameters']['id']
    body['collection'] = event['pathParameters']['collection']
    if 'subtype' not in body:
        body['subtype'] = ""
    event['model'] = models.get_model(body['collection'], body['subtype'], body)

    existing = db.retrieve(body['collection'], body['id'])['Item']
    if 'subtype' not in existing:
        existing['subtype'] = ""
    existing = models.get_model(existing['collection'], existing['subtype'], existing)
    if event['model'].get_subtype() != existing.get_subtype():
        # TODO fire notification event to update item logs
        existing.transition_to(event['model'])
        event['model'].transition_from(existing)

    print("validateing - " + event['model'].data['collection'] + ":" + event['model'].get_subtype())

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
