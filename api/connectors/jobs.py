

import simplejson as json
from pubsub import pub

from common import actions
from __init__ import register


def hello(request, result):
    print(json.dumps(request))
    print(json.dumps(result))


register(hello, actions.DID_CREATE)
register(hello, actions.DID_UPDATE)
register(hello, actions.DID_DELETE)
