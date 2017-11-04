"""Resources"""

import logging
import simplejson as json

import models
import connectors
from common import ActionTypes
from database import db


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
    event['model'] = models.get_model(body['collection'], body.get('subtype', ''))
    event['model'].initialize(body)
    event['model'].validate()
    response = db.create(event['model'].jsonify())
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
    body['collection'] = event['pathParameters']['collection'].upper()
    event['model'] = models.get_model(body['collection'], body.get('subtype',''), body)

    existing = db.retrieve(body['collection'], body['id'])['Item']
    existing = models.get_model(existing['collection'], existing.get('subtype',''), existing)
    if event['model'].get_subtype() != existing.get_subtype():
        existing.transition_to(event['model'])
        event['model'].transition_from(existing)

    event['model'].validate()
    response = db.update(event['model'].jsonify())
    return response


def delete(event):
    """Handle DELETE (delete) events"""
    result = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    if result is not None:
        event['model'] = models.get_model(event['pathParameters']['collection'], result['Item'])
        event['model'].decomission()
    response = db.delete(event['pathParameters']['collection'], event['pathParameters']['id'])
    return response
