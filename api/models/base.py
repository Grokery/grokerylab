"""Resource base class"""

import simplejson as json

class Base():
    """Base Class"""
    data = {}

    def __init__(self, data):
        if not isinstance(data, dict):
            raise Exception("Invalid initalization data to model. Expected dict")
        self.data = data

    def get_type(self):
        return self.data.get('type', '')

    def jsonify(self):
        """To json function"""
        return self.data

    def serialize(self):
        """Serialize to json string"""
        return json.dumps(self.jsonify())

    def validate(self):
        """Validate required fields and throw exception on error"""
        # raise NotImplementedError()
        pass
