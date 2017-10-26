
"""Logic for AWS DataPipeline"""

import time
import boto3

from models.jobs.job import Job
from common import JobTypes

class AWS_DataPipelineJob(Job):
    """TODO"""

    def handle_create(event, response=None):
        """Create datapipeline in AWS. Put definition if provided. Returns pipeline id"""
        if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
            return

        # TODO add logic to create datapipline in aws when created locally
        print("create aws datapipleine")

        print(event['model'].data)

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

        print(client)
        print(name)
        print(unique_id)

        # result = client.create_pipeline(
        #     name=name,
        #     uniqueId=unique_id
        # )
        # pipeline_id = result['pipelineId']

        # if pipline_def:
        #     put_response = put_definition(pipeline_id, pipline_def, client)

        # update obj in db with pipeline id
        # {"pipeline_id": pipeline_id, "put_response": put_response}

    def handle_update(event, response=None):
        """Update pipeline in aws"""
        if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
            return

        # TODO add logic to update datapipline in aws when updated locally
        print("updateing datapipline")

        print(event['model'].data)

        # pipeline_id = ""
        # pipeline_def = ""

        # client.put_pipeline_definition(
        #     pipelineId=pipeline_id,
        #     pipelineObjects=pipline_def,
        #     parameterValues={}
        # )

    def handle_delete(event, response=None):
        """Delete pipeline in aws"""
        if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
            return

        # TODO add logic to delete datapipline in aws when deleted locally
        print("deleting datapipline")

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
