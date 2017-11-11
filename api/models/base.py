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
        logging.debug("init class: " + str(self.__class__) +' id: '+ str(self.data['id']))
        if data is None:
            return
        if data is not None:
            if not isinstance(data, dict):
                raise Exception("Invalid initalization data. Expected object of type dict")
            self.data = data

    def initialize(self, data=None):
        """Set up logic on create. Should always be called on create"""
        logging.debug("Initializing: " + str(self.__class__))

    def decomission(self):
        """Tear down logic before delete. Should always be called before deleting"""
        logging.debug("Decomissioning: " + str(self.__class__))

    def prepare_read(self):
        """Generate calculated fields, gather additional data, etc in preparation for read"""
        logging.debug("Reading: " + str(self.__class__))

    def prepare_update(self):
        """Update foreign as necessary on update local"""
        logging.debug("Reading: " + str(self.__class__))

    def transition_to(self, other):
        """Transition logic called on old subtype. Should always be called
        when updating from one subtype to another

        @param other: object of new subtype

        """
        logging.debug("Transitioning to: " + str(other.__class__))

    def transition_from(self, other):
        """Transition logic called on new subtype. Should always be called when
        updating from one subtype to another

        @param other: object of old subtype

        """
        logging.debug("Transitioning from: " + str(other.__class__))

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
        logging.debug("Validating required Base fields: " + str(self.__class__))
        if not "id" in self.data:
            self.data['subtype'] = ""
        if not "collection" in self.data:
            raise Exception("'collection' field is required")
        if not "subtype" in self.data:
            self.data['subtype'] = ""
