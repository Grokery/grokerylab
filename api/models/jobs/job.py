"""Job"""

from common import overrides
from models.base import Base

class Job(Base):
    """Job Model"""

    @overrides(Base)
    def __init__(self, data=None):
        if data is None:
            return
        self.initialize(data)

    @overrides(Base)
    def initialize(self, data=None):
        #super.initialize(data)
        print("initializeing self (Job): " + str(self.__class__))

    @overrides(Base)
    def transition_to(self, other):
        print("transitioning from: " + str(self.__class__))
        super.transition_to(other)

    @overrides(Base)
    def transition_from(self, other):
        print("transitioning to: " + str(other.__class__))
        super.transition_from(other)

    @overrides(Base)
    def decomission(self):
        print("decomissioning self: " + str(self.__class__))
        super().decomission()

    @overrides(Base)
    def validate(self):
        """Validate required fields and throw exception on error"""
        super().validate()

