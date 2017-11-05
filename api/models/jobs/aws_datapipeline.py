
"""Logic for AWS DataPipeline"""

import time
import boto3
import logging

from models.jobs.job import Job
from common import JobTypes, overrides

class AWS_DataPipelineJob(Job):
    """Handles logic for AWS Datapipeline jobs"""

    # @overrides(Job)
    # def initialize(self, data=None):
    #     super(AWS_DataPipelineJob, self).initialize(data)

    # @overrides(Job)
    # def transition_to(self, other):
    #     super(AWS_DataPipelineJob, self).transition_to(other)

    # @overrides(Job)
    # def transition_from(self, other):
    #     super(AWS_DataPipelineJob, self).transition_from(other)

    # @overrides(Job)
    # def decomission(self):
    #     super(AWS_DataPipelineJob, self).decomission()

    def handle_create(self, event, response=None):
        """Create datapipeline in AWS. Put definition if provided. Returns pipeline id"""
        if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
            return

        # TODO add logic to create datapipline in aws when created locally
        logging.debug("create aws datapipleine")

        logging.debug(event['model'].data)

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

        logging.debug(client)
        logging.debug(name)
        logging.debug(unique_id)

        # result = client.create_pipeline(
        #     name=name,
        #     uniqueId=unique_id
        # )
        # pipeline_id = result['pipelineId']

        # if pipline_def:
        #     put_response = put_definition(pipeline_id, pipline_def, client)

        # update obj in db with pipeline id
        # {"pipeline_id": pipeline_id, "put_response": put_response}

    def handle_update(self, event, response=None):
        """Update pipeline in aws"""
        if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
            return

        # TODO add logic to update datapipline in aws when updated locally
        logging.debug("updateing datapipline")

        logging.debug(event['model'].data)

        # pipeline_id = ""
        # pipeline_def = ""

        # client.put_pipeline_definition(
        #     pipelineId=pipeline_id,
        #     pipelineObjects=pipline_def,
        #     parameterValues={}
        # )

    def handle_delete(self, event, response=None):
        """Delete pipeline in aws"""
        if event['model'].get_type() != JobTypes.AWS_DATAPIPELINE.name:
            return

        # TODO add logic to delete datapipline in aws when deleted locally
        logging.debug("deleting datapipline")

    def activate(self, pipeline_id, client=None):
        """Activate pipeline"""
        if not client:
            client = boto3.client('datapipeline')
        return client.activate_pipeline(pipelineId=pipeline_id)

    def list_pipelines(self, marker='', client=None):
        """Get list of pipelines"""
        if not client:
            client = boto3.client('datapipeline')
        return client.list_pipelines(marker=marker)
