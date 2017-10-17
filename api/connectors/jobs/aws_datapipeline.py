
"""Logic for AWS DataPipeline"""

from connectors import register
from common import ActionTypes
from common import JobTypes

def handle_create(event, response):
    """Create pipeline in aws"""
    if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
        return

    # TODO add logic to create datapipline in aws when created locally
    print("create aws datapipleine")


def handle_update(event, response):
    """Update pipeline in aws"""
    if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
        return

    # TODO add logic to update datapipline in aws when updated locally
    print("updateing datapipline")


def handle_delete(event, response):
    """Delete pipeline in aws"""
    if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
        return

    # TODO add logic to delete datapipline in aws when deleted locally
    print("deleting datapipline")


register(handle_create, ActionTypes.DID_CREATE.name)
register(handle_update, ActionTypes.DID_UPDATE.name)
register(handle_delete, ActionTypes.DID_DELETE.name)
