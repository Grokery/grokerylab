"""DataFlowService"""

import logging
import simplejson as json
from database import db

logger = logging.getLogger()

PROJECTION = "id, collection, title, upstream, downstream, x, y, type, type_abrev"

def main(event, context):
    """DataFlowService main handler method"""

    global db

    if context and "db" in context:
        db = context['db']
    if context and "models" in context:
        models = context['models']
    if context and "logger" in context:
        logger = context['logger']

    if "query" in event:
        query = event['query']
    else:
        query = {}

    if 'id' in query and 'collection' in query:
        items = get_upstream(query['id'], query['collection'], {})
        items = get_downstream(query['id'], query['collection'], items)
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"Items": items})
        }

    types = ['jobs', 'datasources', 'charts', 'dashboards']
    items = {}
    for resource_type in types:
        response = db.retrieve_multiple(resource_type, PROJECTION)
        for item in response['Items']:
            items[item['id']] = item
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps({"Items": items})
    }


def get_upstream(item_id, collection, items):
    """Rescursively walks upstream dependancies"""
    result = db.retrieve(collection, item_id, PROJECTION)

    if 'Item' not in result:
        return items

    node = result['Item']

    items[node['id']] = node

    if 'upstream' in node:
        for item in node['upstream']:
            if item['id'] not in items:
                items = get_upstream(item['id'], item['collection'], items)
    return items


def get_downstream(item_id, collection, items):
    """Recursively walks downstream dependancies"""
    result = db.retrieve(collection, item_id, PROJECTION)

    if 'Item' not in result:
        return items

    node = result['Item']

    items[node['id']] = node

    if 'downstream' in node:
        for item in node['downstream']:
            if item['id'] not in items:
                items = get_downstream(item['id'], item['collection'], items)

    return items


def get_all_connected(item_id, collection, items):
    """Get all upstream and downstream for all nodes reachable from given start node"""
    result = db.retrieve(collection, item_id, PROJECTION)

    if 'Item' not in result:
        return items

    node = result['Item']
    items[node['id']] = node

    if 'upstream' in node:
        for item in node['upstream']:
            if item['id'] not in items:
                items = get_all_connected(item['id'], item['collection'], items)

    if 'downstream' in node:
        for item in node['downstream']:
            if item['id'] not in items:
                items = get_all_connected(item['id'], item['collection'], items)

    return items
