"""Job"""

from models.base import Base

class Job(Base):
    """Job Model"""

    def initialize(self, data=None):
        self.data = data

    def transition_to(self, other):
        print("transitioning from: " + str(self.__class__))
        pass

    def transition_from(self, other):
        print("transitioning to: " + str(other.__class__))
        pass

    def decomission(self):
        print("decomissioning self: " + str(self.__class__))
        pass

    def validate(self):
        """Validate required fields and throw exception on error"""
        pass

