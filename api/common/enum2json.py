"""Accept python enum and return a dict of name value pairs"""

def enum2json(enum):
    """Enum to json"""
    items = []
    for k, obj in enum.__members__.iteritems():
        items.append({"name":k, "description":obj.value})
    return items
