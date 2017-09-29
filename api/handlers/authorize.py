import os
import jwt
import datetime
import simplejson as json
from passlib.hash import pbkdf2_sha256


def authorize(event, context):
    """Authorize requests"""
    try:
        jwt.decode(event["authorizationToken"], os.environ.get('JWT_SECRET_KEY'))
        # TODO Logic to check if user is allowed to access specific requested endpoint/method
        # (for example, user may be allowed to GET but not PUT)
        response = {
            "policyDocument": {
                "Statement": [{
                    "Effect": "Allow",
                    "Resource": event['endpoint_method']
                }]
                }
        }
        return response
    except jwt.InvalidTokenError as err:
        response = {
            "policyDocument": {
                "Statement": [{
                    "Effect":"Deny",
                    "Resource":event['endpoint_method']
                }]
            }
        }
        return response


def authenticate(event, context):
    """Authenticate user"""
    body = json.loads(event['body'])

    # user = admin, password = admin
    # TODO: Get user info from db
    user = {
        "username":"admin@fakedomain.com",
        "name":"admin",
        "password":"$pbkdf2-sha256$29000$WSsF4FyLkfJeCwGA8N47xw$mmWO01EaKq6PGcJRbAcpApD3qV2bVRUmz0CI4vyvzkw",
        "permissions":{

        },
        "clouds": {
            "local": {
                "name": "Localhost",
                "id": "local",
                "type": "local",
                "url": "http://localhost:5000"
            }
        }
    }

    if pbkdf2_sha256.verify(body['password'], user['password']):
        del user['password']

        accountId = "*"
        apiId = "*"
        stage = "*"
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8),
            'iss': 'localhost',
            'sub': user['username'],
            'scopes': [
                {
                    'Effect': 'Allow',
                }
            ]
        }

        user['token'] = jwt.encode(payload, os.environ.get('JWT_SECRET_KEY'), algorithm='HS256')
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin" : "*"},
            "body": json.dumps(user)
        }
    else:
        return {
            "statusCode": 404,
            "headers": {"Access-Control-Allow-Origin" : "*"},
            "body": ""
        }
