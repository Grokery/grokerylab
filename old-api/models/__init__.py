"""TODO"""

from models.base import Base


def get_model(collection, jsondata):
    """TODO use collection to instiate proper object type"""
    return Base(jsondata)
