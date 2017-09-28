"""MongoDB"""

import uuid
import settings

from pymongo import MongoClient

client = MongoClient(settings.MONGODB_HOST)
db = client[settings.MONGODB_DB_NAME]


def create(collection, body):
    """Handle create"""
    item = body
    item['collection'] = collection
    item['id'] = str(uuid.uuid4())
    db[collection].insert_one(item)
    del item['_id']
    return {'Item': item}


def retrieve_multiple(collection, fields=None, query=None):
    """Handle read multiple"""
    projection = {'_id': 0}
    if fields is not None:
        fields = fields.split(',')
        for field in fields:
            projection[field.strip()] = 1
    if query:
        dbquery = query.to_dict()
    else:
        dbquery = {}
    cursor = db[collection].find(dbquery, projection)
    results = {"Items": []}
    results["Items"].extend(cursor)
    return results


def retrieve(collection, item_id, fields=None):
    """Handle read single item"""
    projection = {'_id': 0}
    if fields is not None:
        fields = fields.split(',')
        for field in fields:
            projection[field.strip()] = 1
    item = db[collection].find_one({'id': item_id}, projection)
    return {"Item": item}


def update(collection, item_id, body):
    """Handle update"""
    update_values = body
    update_values['collection'] = collection
    update_values['id'] = item_id
    current_values = db[collection].find_one({'id': item_id})
    for key in update_values:
        current_values[key] = update_values[key]
    db[collection].update_one({'id': item_id}, {'$set': current_values}, upsert=False)
    del current_values['_id']
    return {"Item": current_values}


def delete(collection, item_id):
    """Handle delete item"""
    result = db[collection].remove({'id': item_id})
    if result['ok']:
        return {"Success": True, "Item": {"id": item_id}}
    else:
        return {"Success": False, "Item": {"id": item_id}}

