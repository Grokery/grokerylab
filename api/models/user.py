"""User"""

from models.base import Base

class User(Base):
    """User Model"""

    def validate(self):
        """Validate required fields and throw exception on error"""
        pass
