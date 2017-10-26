"""TODO"""

from connectors import register
from common import ActionTypes
from common import SourceTypes


def handle_create(event, response=None):
    """Create s3 data source in AWS"""
    if event['model'].get_type() != SourceTypes.AWS_S3.name:
        return

    # TODO add logic to create s3 datasource in aws when created locally
    print("create aws s3 data source")


def handle_read(event, response=None):
    """Update local info for s3 data source"""
    if event['model'].get_type() != SourceTypes.AWS_S3.name:
        return

    # TODO add logic to update local info for s3 datasource
    print("pudate local info for aws s3 data source")


def handle_update(event, response=None):
    """Create s3 data source in AWS"""
    if event['model'].get_type() != SourceTypes.AWS_S3.name:
        return

    # TODO add logic to create s3 datasource in aws when created locally
    print("create aws s3 data source")


def handle_delete(event, response=None):
    """Create s3 data source in AWS"""
    if event['model'].get_type() != SourceTypes.AWS_S3.name:
        return

    # TODO add logic to create s3 datasource in aws when created locally
    print("create aws s3 data source")


register(handle_create, ActionTypes.DID_CREATE.name)
register(handle_read, ActionTypes.WILL_READ.name)
register(handle_update, ActionTypes.DID_UPDATE.name)
register(handle_delete, ActionTypes.DID_DELETE.name)
