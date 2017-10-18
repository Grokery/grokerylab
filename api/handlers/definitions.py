"""Lookup data"""

import simplejson as json
from common import enum2json
from common import definitions


def main(event, context):
    """Lookup data handler"""

    lookups = {
        'cloudtypes': enum2json(definitions.CloudTypes),
        'resourcetypes': enum2json(definitions.ResourceTypes),
        'jobtypes': enum2json(definitions.JobTypes),
        'sourcetypes': enum2json(definitions.SourceTypes)
    }

    if 'definitiontype' not in event['pathParameters']:
        result = lookups
    else:
        result = lookups.get(event['pathParameters']['definitiontype'])

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps(result)
    }
