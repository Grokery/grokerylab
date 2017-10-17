"""Action Types"""

from enum import Enum

class ActionTypes(Enum):
    DID_CREATE = "did-create"
    WILL_READ = "will-read"
    DID_UPDATE = "did-update"
    DID_DELETE = "did-delete"
