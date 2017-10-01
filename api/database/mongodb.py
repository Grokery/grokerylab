"""MongoDB"""

import os
import uuid
from pymongo import MongoClient

client = MongoClient(os.environ.get('MONGODB_HOST'))
db = client[os.environ.get('MONGODB_DB_NAME')]


def create(item):
    """Create new object in db"""
    item['id'] = str(uuid.uuid4())
    db[item['collection']].insert_one(item)
    del item['_id']
    return {'Item': item}


def retrieve_multiple(collection, fields=None, query=None):
    """Read items from db"""
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
    """Read single item from db"""
    projection = {'_id': 0}
    if fields is not None:
        fields = fields.split(',')
        for field in fields:
            projection[field.strip()] = 1
    item = db[collection].find_one({'id': item_id}, projection)
    return {"Item": item}


def update(item):
    """Update item in db"""
    update_values = item
    current_values = db[item['collection']].find_one({'id': item['id']})
    for key in update_values:
        current_values[key] = update_values[key]
    db[item['collection']].update_one({'id': item['id']}, {'$set': current_values}, upsert=False)
    del current_values['_id']
    return {"Item": current_values}


def delete(collection, item_id):
    """Delete item from db"""
    result = db[collection].remove({'id': item_id})
    if result['ok']:
        return {"Success": True, "Item": {"id": item_id}}
    else:
        return {"Success": False, "Item": {"id": item_id}}
