"""Nodes"""

import logging
import simplejson as json
from database import db

import models

logger = logging.getLogger()

def main(event, context):
    """Resources main handler method"""

    if context and "db" in context:
        db = context['db']
    if context and "models" in context:
        models = context['models']
    if context and "logger" in context:
        logger = context['logger']

    collection = event['pathParameters']['collection']
    # TODO: instaiate model that can validate input
    #event['item'] = models.get_model(collection, event['body'])

    result = {
        'POST': get_create_handler(collection),
        'GET': get_read_handler(collection),
        'PUT':  get_update_handler(collection),
        'DELETE': get_delete_handler(collection),
    }[event['httpMethod']](event)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps(result)
        }


def get_create_handler(collection):
    """Get create handler based on object type"""
    # TODO: change strings to enum pulled from models
    return {
        "eventx": default_create # example
    }.get(collection, default_create)


def default_create(event):
    """Handle basic create event (POST)"""
    item = json.loads(event['body']) # TODO get model from event
    item['collection'] = event['pathParameters']['collection']
    result = db.create(item)
    return result


def get_read_handler(collection):
    """Get read handler based on object type"""
    return {
    }.get(collection, default_read)


def default_read(event):
    """Handle basic read (GET) event"""
    # TODO handle projections
    if 'id' in event['pathParameters'] and event['pathParameters']['id'] is not None:
        result = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    else:
        # TODO: handle paging
        result = db.retrieve_multiple(event['pathParameters']['collection'])
    return result


def get_update_handler(collection):
    """Get update handler based on object type"""
    return {
    }.get(collection, default_update)


def default_update(event):
    """Handle update (PUT) events"""
    item = json.loads(event['body'])
    item['collection'] = event['pathParameters']['collection']
    item['id'] = event['pathParameters']['id']
    result = db.update(item)
    return result


def get_delete_handler(collection):
    """Get update handler based on object type"""
    return {
    }.get(collection, default_delete)


def default_delete(event):
    """Handle DELETE (delete) events"""
    result = db.delete(event['pathParameters']['collection'], event['pathParameters']['id'])
    return result

