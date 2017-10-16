"""Common definitions"""

def enum_2_json(enum):
    """Enum to json"""
    items = {}
    for k, obj in enum.__members__.iteritems():
        items[k] = obj.value
    return items
