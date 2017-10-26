"""Resource base class"""

import simplejson as json

class Base():
    """Base Class"""
    data = {}

    def __init__(self, data=None):
        if data is None:
            return
        if not isinstance(data, dict):
            raise Exception("Invalid initalization data to model. Expected dict")
        self.initialize(data)

    def initialize(self, data=None):
        print("initializeing self (base): " + str(self.__class__))
        self.data = data

    def transition_to(self, other):
        print("transitioning from: " + str(self.__class__))
        pass

    def transition_from(self, other):
        print("transitioning to: " + str(other.__class__))
        pass

    def decomission(self):
        print("decomissioning self: " + str(self.__class__))
        pass

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
        pass
