
from models.jobs.job import Job
from models.jobs.aws_datapipeline import AWS_DataPipelineJob
from common.definitions import JobTypes


def get_job_model(subtype):
    """Use subtype to select proper object class or use generic Job"""
    print("init job model for subtype: " + subtype)
    print("JobTypes.AWS_DATAPIPELINE.name == subtype")
    print(JobTypes.AWS_DATAPIPELINE.name == subtype)
    return {
        JobTypes.AWS_DATAPIPELINE.name: AWS_DataPipelineJob,
    }.get(subtype, Job)
