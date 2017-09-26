import jwt
from jwt import InvalidTokenError
import simplejson as json
from common import settings

def authorize(event, context):
    """Authorize requests"""
    try:
        decoded = jwt.decode(event["authorizationToken"], settings.JWT_SECRET_KEY)
        
        # TODO Logic to check if user is allowed to access specific requested endpoint/method (for example, user may be allowed to GET but not PUT)
        
        response = {
            "policyDocument": {
                "Statement": [{
                    "Effect": "Allow",
                    "Resource": event['endpoint_method']
                }]
                }
        }
        return response
    except InvalidTokenError as err:
        response = {
            "policyDocument": {
                "Statement": [{
                    "Effect":"Deny",
                    "Resource":event['endpoint_method']
                }]
            }
        }
        return response

