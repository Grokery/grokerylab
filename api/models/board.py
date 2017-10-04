"""Board Model"""

import logging

logger = logging.getLogger()

class Board():
    """Represents a dashboard as a collection of charts"""
    collection = "board"
    id = ""
    title = ""
    description = ""
    upstream = []
    downstream = []
    x = 0
    y = 0

    def __init__(self, data=None):
        if type(data) is dict:
            self.id = data.get("id", "0")

    def getFieldorDefault(self, key, data, default):
        """Get value from json input data or default"""
        try:
            return data[key]
        except KeyError as ex:
            logger.debug(ex.args)
            return default
