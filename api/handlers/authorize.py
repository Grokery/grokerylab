import jwt
from jwt import InvalidTokenError
import simplejson as json
from common import settings

def authorize(event, context):
    """Authorize requests"""
    try:
        decoded = jwt.decode(event["authorizationToken"], settings.JWT_SECRET_KEY)
        response = {
            "principalId": decoded['sub'],
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [{
                    "Action": "execute-api:Invoke",
                    "Effect": "Allow",
                    "Resource": "arn:aws:execute-api:*:*:*/*/*"
                }]
            }
        }
        return response
    except InvalidTokenError as err:
        response = {
            "principalId": "chmod740@gmail.com",
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [{
                    "Action":"execute-api:Invoke",
                    "Effect":"Deny",
                    "Resource":event['methodArn']
                }]
            }
        }
        return response

