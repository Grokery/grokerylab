"""Resource base class"""

from common import collections

class Base():
    """Base class"""
    jsondata = {}

    def __init__(self, jsondata):
        self.jsondata = jsondata

    def json(self):
        """To json function"""
        return self.jsondata

    def validate(self):
        """Validate required fields and throw exception on error"""
        assert self.jsondata['collection'] in collections
