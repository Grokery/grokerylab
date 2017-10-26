"""TODO"""

from models import jobs
from models.base import Base
from models.source import Source
from common.definitions import *


def get_model(collection, jsondata={}):
    """Use collection to instiate proper object type"""

    return {
        ResourceTypes.JOBS.value: jobs.get_job_model(jsondata.get('type','')),
        ResourceTypes.SOURCES.value: Source
    }.get(collection, Base)(jsondata)
