"""Nodes"""
import simplejson as json
import logging
from common import settings
from common import mongodb as db

log = logging.getLogger()
log.setLevel(logging.DEBUG)


def nodes(event, context):
    """Nodes main handler function"""
    db_result = {
        'POST': handle_post,
        'GET': handle_get,
        'PUT':  handle_put,
        'DELETE': handle_delete
    }[event['httpMethod']](event)
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps(db_result)
        }


def handle_post(event):
    """Handle POST (create) events"""
    body = json.loads(event['body'])
    result = db.create(event['pathParameters']['collection'], body)
    return result


def handle_get(event):
    """Handle GET (read) events"""
    if 'id' in event['pathParameters'] and event['pathParameters']['id'] is not None:
        result = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    else:
        result = db.retrieve_multiple(event['pathParameters']['collection'])
    return result


def handle_put(event):
    """Handle PUT (update) events"""
    collection = event['pathParameters']['collection']
    item_id = event['pathParameters']['id']
    body = json.loads(event['body'])
    result = db.update(collection, item_id, body)
    return result


def handle_delete(event):
    """Handle DELETE (delete) events"""
    result = db.delete(event['pathParameters']['collection'], event['pathParameters']['id'])
    return result

