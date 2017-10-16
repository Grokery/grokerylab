"""TODO"""

from models.base import Base
from models.board import Board
from models.chart import Chart
from models.event import Event
from models.flow import Flow
from models.job import Job 
from models.run import Run 
from models.source import Source 
from models.user import User 


def get_model(collection, jsondata):
    """TODO use collection to instiate proper object type"""
    return Base(jsondata)
