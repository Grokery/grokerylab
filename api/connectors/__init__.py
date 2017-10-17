"""Connectors contain logic needed to interface with outside resources"""

from pubsub import pub

def notify(action, **args):
    """Send notification of action with relevant data to any listening connectors"""
    pub.sendMessage(action, **args)

def register(handler, action):
    """Register connector action handler"""
    pub.subscribe(handler, action)


from jobs import *
from sources import *
