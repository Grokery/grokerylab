"""Resources"""

import logging
import simplejson as json

import models
from common import ActionTypes
from database import db


def main(event, context):
    """Resources main handler method"""

    global db

    if context and "db" in context:
        db = context['db']
    if context and "models" in context:
        models = context['models']
    if context and "logging" in context:
        logging = context['logging']

    response = {
        "POST": create,
        "GET": read,
        "PUT":  update,
        "DELETE": delete,
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
    model = models.get_model(body['collection'], body.get('subtype',''), body)
    model.initialize()
    model.validate()
    response = db.create(model.jsonify())
    return response


def read(event):
    """Handle read (GET) event"""
    # TODO handle projections
    if "id" in event['pathParameters'] and event['pathParameters']['id'] is not None:
        item = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])['Item']
        item = models.get_model(item['collection'], item.get('subtype', ''), item)
        item.prepare_read()
        response = {"Item": item.jsonify()}
    else:
        # TODO: handle paging
        response = db.retrieve_multiple(event['pathParameters']['collection'])
    return response


def update(event):
    """Handle update (PUT) events"""
    body = json.loads(event['body'])
    body['id'] = event['pathParameters']['id']
    body['collection'] = event['pathParameters']['collection'].upper()
    model = models.get_model(body['collection'], body.get('subtype',''), body)

    item = db.retrieve(body['collection'], body['id'])['Item']
    existing = models.get_model(item['collection'], item.get('subtype',''), item)
    if model.get_subtype() != existing.get_subtype():
        existing.transition_to(model)
        model.transition_from(existing)

    model.prepare_update()
    model.validate()
    response = db.update(model.jsonify())
    return response


def delete(event):
    """Handle DELETE (delete) events"""
    collection = event['pathParameters']['collection']
    item_id = event['pathParameters']['id']
    result = db.retrieve(collection, item_id)
    if result is None:
        raise Exception("Item not Found")
    item = result['Item']
    model = models.get_model(item['collection'], item.get('subtype',''), item)
    model.decomission()
    response = db.delete(collection, item_id)
    return response
