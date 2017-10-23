
"""Logic for AWS DataPipeline"""

import time
import boto3

from connectors import register
from common import ActionTypes
from common import JobTypes

def handle_create(event, response):
    """Create datapipeline in AWS. Put definition if provided. Returns pipeline id"""
    if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
        return

    # TODO add logic to create datapipline in aws when created locally
    print("create aws datapipleine")

    client=None
    name=None
    unique_id=None
    pipline_def=None

    if not client:
        client = boto3.client('datapipeline')
    if not name:
        name = "New Pipeline"
    if not unique_id:
        unique_id = str(int(time.time()))

    result = client.create_pipeline(
        name=name,
        uniqueId=unique_id
    )
    pipeline_id = result['pipelineId']

    if pipline_def:
        put_response = put_definition(pipeline_id, pipline_def, client)

    # update obj in db with pipeline id
    # {"pipeline_id": pipeline_id, "put_response": put_response}


def handle_read(event, response):
    """Update local pipeline info"""
    if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
        return

    # TODO add logic to update local datapipline info
    print("updateing local datapipline info")


def handle_update(event, response):
    """Update pipeline in aws"""
    if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
        return

    # TODO add logic to update datapipline in aws when updated locally
    print("updateing datapipline")

    pipeline_id = ""
    pipeline_def = ""

    client.put_pipeline_definition(
        pipelineId=pipeline_id,
        pipelineObjects=pipline_def,
        parameterValues={}
    )


def handle_delete(event, response):
    """Delete pipeline in aws"""
    if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
        return

    # TODO add logic to delete datapipline in aws when deleted locally
    print("deleting datapipline")


register(handle_create, ActionTypes.DID_CREATE.name)
register(handle_read, ActionTypes.WILL_READ.name)
register(handle_update, ActionTypes.DID_UPDATE.name)
register(handle_delete, ActionTypes.DID_DELETE.name)


def activate(pipeline_id, client=None):
    """Activate pipeline"""
    if not client:
        client = boto3.client('datapipeline')
    return client.activate_pipeline(pipelineId=pipeline_id)


def list_pipelines(marker='', client=None):
    """Get list of pipelines"""
    if not client:
        client = boto3.client('datapipeline')
    return client.list_pipelines(marker=marker)
