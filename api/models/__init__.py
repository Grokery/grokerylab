import logging

from models.base import Base
from models.source import Source
from models import jobs
from common.definitions import ResourceTypes


def get_model(collection, subtype='', jsondata={}):
    """Use collection to instiate proper object type"""
    logging.debug("Get model for collection: " + collection + ", subtype: " + subtype)
    return {
        ResourceTypes.JOBS.name: jobs.get_job_model(subtype),
        ResourceTypes.DATASOURCES.name: Source
    }.get(collection, Base)(jsondata)
