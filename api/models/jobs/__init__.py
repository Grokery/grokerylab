
from models.jobs import job
from models.jobs import aws_datapipeline
from common.definitions import *


def get_job_model(job_type=None):
    """Use job_type to instiate proper object type"""
    print("get_job_model for type: " + job_type)
    return {
        JobTypes.AWS_DATAPIPELINE.value: aws_datapipeline.AWS_DataPipelineJob,
    }.get(job_type, job.Job)
