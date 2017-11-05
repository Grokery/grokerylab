"""Job"""

import logging
from common import overrides
from models.base import Base

class Job(Base):
    """Job Model"""

    @overrides(Base)
    def initialize(self, data=None):
        super(Job, self).initialize(data)

    @overrides(Base)
    def transition_to(self, other):
        super(Job, self).transition_to(other)

    @overrides(Base)
    def transition_from(self, other):
        super(Job, self).transition_from(other)

    @overrides(Base)
    def decomission(self):
        super(Job, self).decomission()

    @overrides(Base)
    def validate(self):
        """Validate required fields and throw exception on error"""
        super(Job, self).validate()
        logging.debug("Validating required Job fields")
