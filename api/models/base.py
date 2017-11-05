"""Resource base class"""

import logging
import simplejson as json

class Base(object):
    """Base Class"""
    data = {
        "id": "",
        "collection": "",
        "subtype": ""
    }

    def __init__(self, data=None):
        if data is None:
            return
        self.initialize(data)

    def initialize(self, data=None):
        """Initialize model with data and validate

        @param data: initialization data

        """
        logging.debug("Initializeing: " + str(self.__class__))
        if data is not None:
            if not isinstance(data, dict):
                raise Exception("Invalid initalization data. Expected object of type dict")
            self.data = data

    def decomission(self):
        """Clean up logic before delete, Should always be called before deleting"""
        logging.debug("Decomissioning self: " + str(self.__class__))
        pass

    def transition_to(self, other):
        """Transition logic called on old subtype. Should always be called when updating from one subtype to another

        @param other: object of new subtype

        """
        logging.debug("Transitioning to: " + str(other.__class__))
        pass

    def transition_from(self, other):
        """Transition logic called on new subtype. Should always be called when updating from one subtype to another

        @param other: object of old subtype

        """
        logging.debug("Transitioning from: " + str(other.__class__))
        pass

    def get_subtype(self):
        """Returns subtype of object or empty"""
        return self.data.get('subtype', '')

    def jsonify(self):
        """Return data as json"""
        return self.data

    def serialize(self):
        """Return data as serialized json string"""
        return json.dumps(self.jsonify())

    def validate(self):
        """Validate required fields and throw exception on error"""
        logging.debug("Validating: " + str(self.__class__))
        if not "id" in self.data:
            raise Exception("'id' field is required")
        if not "collection" in self.data:
            raise Exception("'collection' field is required")
        if not "subtype" in self.data:
            raise Exception("'subtype' field is required")
