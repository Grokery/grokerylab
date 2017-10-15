
"""Logic for AWS DataPipeline"""

from connectors import register
from common.actions import DID_CREATE, DID_UPDATE, DID_DELETE
from common.resource_types import AWS_DATAPIPELINE

register(handle_create, DID_CREATE)
register(handle_update, DID_UPDATE)
register(handle_delete, DID_DELETE)


def handle_create(event, result):
    """Create pipeline in aws"""
    if event['item'].get_type() != AWS_DATAPIPELINE:
        return

    # TODO add logic to create datapipline in aws when created locally
    print("create aws datapipleine")


def handle_update(event, result):
    """Update pipeline in aws"""
    if event['item'].get_type() != AWS_DATAPIPELINE:
        return

    # TODO add logic to update datapipline in aws when updated locally
    print("updateing datapipline")


def handle_delete(event, result):
    """Delete pipeline in aws"""
    if event['item'].get_type() != AWS_DATAPIPELINE:
        return

    # TODO add logic to delete datapipline in aws when deleted locally
    print("deleting datapipline")
