"""MongoDB"""

import os
import uuid
from pymongo import MongoClient

class MongoDatabase(object):
    """Mongo database connector"""
    db = None

    def _get_db(self):
        if not self.db:
            client = MongoClient(os.environ.get('MONGODB_HOST'))
            self.db = client[os.environ.get('MONGODB_DB_NAME')]
        return self.db

    def create(self, item):
        """Create new object in db"""
        item['id'] = str(uuid.uuid4())
        self._get_db()[item['collection']].insert_one(item)
        del item['_id']
        return {'Item': item}


    def retrieve_multiple(self, collection, fields=None, query=None):
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
        cursor = self._get_db()[collection].find(dbquery, projection)
        results = {"Items": []}
        results["Items"].extend(cursor)
        return results


    def retrieve(self, collection, item_id, fields=None):
        """Read single item from db"""
        projection = {'_id': 0}
        if fields is not None:
            fields = fields.split(',')
            for field in fields:
                projection[field.strip()] = 1
        item = self._get_db()[collection].find_one({'id': item_id}, projection)
        return {"Item": item}


    def update(self, item):
        """Update item in db"""
        update_values = item
        current_values = self._get_db()[item['collection']].find_one({'id': item['id']})
        if current_values is None:
            raise Exception("Item with id '"+item['id']+"' not found in collection '"+item['collection']+"'")
        for key in update_values:
            current_values[key] = update_values[key]
        self._get_db()[item['collection']].update_one({'id': item['id']}, {'$set': current_values}, upsert=False)
        del current_values['_id']
        return {"Item": current_values}


    def delete(self, collection, item_id):
        """Delete item from db"""
        result = self._get_db()[collection].remove({'id': item_id})
        if result['ok']:
            return {"Success": True, "Item": {"id": item_id}}
        else:
            return {"Success": False, "Item": {"id": item_id}}
