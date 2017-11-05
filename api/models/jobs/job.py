"""Job"""

import logging
from common import overrides
from models.base import Base

class Job(Base):
    """Job Model"""

    @overrides(Base)
    def validate(self):
        """Validate required fields and throw exception on error"""
        super(Job, self).validate()

