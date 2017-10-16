"""Lookup data"""

import simplejson as json
from common import enum_2_json
from common.clouds import Clouds


def main(event, context):
    """Lookup data handler"""

    result = {
        'cloudtypes': enum_2_json(Clouds),
    }[event['pathParameters']['collection']]

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps(result)
        }
