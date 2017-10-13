

import simplejson as json
from pubsub import pub

from common import actions, jobtypes
from __init__ import register


def handleAction(request, result):
    if request['pathParameters']['collection'] != 'jobs':
        return

    jobtype = request
    {
        jobtypes.AWS_DATAPIPELINE: aws_datapipeline,
    }[event[jobtype]](request, result)


register(handleAction, actions.DID_CREATE)
register(handleAction, actions.DID_UPDATE)
register(handleAction, actions.DID_DELETE)


def aws_datapipeline():
    print("aws_datapipleine called")
