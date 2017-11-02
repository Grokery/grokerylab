"""TODO"""

from models.base import Base
from models.source import Source
from models import jobs
from common.definitions import ResourceTypes


def get_model(collection, subtype='', jsondata={}):
    """Use collection to instiate proper object type"""
    print("init model for: " + collection + " : " + subtype)
    print("ResourceTypes.JOBS.name == collection")
    print(ResourceTypes.JOBS.value)
    print(ResourceTypes.JOBS.value == collection)
    return {
        ResourceTypes.JOBS.value: jobs.get_job_model(subtype),
        ResourceTypes.SOURCES.value: Source
    }.get(collection, Base)(jsondata)
