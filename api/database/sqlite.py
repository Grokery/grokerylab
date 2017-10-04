"""SQLite"""


def create(item):
    """Create new object in db"""
    raise NotImplementedError()


def retrieve_multiple(collection, fields=None, query=None):
    """Read items from db"""
    raise NotImplementedError()


def retrieve(collection, item_id, fields=None):
    """Read single item from db"""
    raise NotImplementedError()


def update(item):
    """Update item in db"""
    raise NotImplementedError()


def delete(collection, item_id):
    """Delete item from db"""
    raise NotImplementedError()
