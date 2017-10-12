
import jobs
import sources

from pubsub import pub

def notify(action, **args):
    pub.sendMessage(action, **args)

def register(handler, action):
    pub.subscribe(handler, action)
