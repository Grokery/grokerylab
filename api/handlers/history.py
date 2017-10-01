"""History"""

import logging
import simplejson as json
from database import db

log = logging.getLogger()
log.setLevel(logging.DEBUG)

# TODO: collapse history into resources handler

def history(event, context):
    """History main handler function"""
    db_result = {
        'POST': handle_post,
        'GET': handle_get
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
    """Handle POST (append) events"""
    body = json.loads(event['body'])
    result = db.create(event['pathParameters']['collection'], body)
    return result


def handle_get(event):
    """Handle GET (read) events"""
    if not event['pathParameters']['collection']:
        collections = ['comments']
        results = []
        for col in collections:
            results.extend(db.retrieve_multiple(col, None, event['query'])['Items'])
        result = {'Items': results}
    elif 'id' in event['pathParameters'] and event['pathParameters']['id'] is not None:
        result = db.retrieve(event['pathParameters']['collection'], event['pathParameters']['id'])
    else:
        result = db.retrieve_multiple(event['pathParameters']['collection'], None, event['query'])
    return result
