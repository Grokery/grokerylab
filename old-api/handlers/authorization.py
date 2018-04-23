import os
import jwt
import datetime
import logging
import simplejson as json
from passlib.hash import pbkdf2_sha256
from database import db

logger = logging.getLogger()

def authorize(event, context):
    """Authorize requests"""

    global db

    if context and "db" in context:
        db = context['db']
    if context and "models" in context:
        models = context['models']
    if context and "logger" in context:
        logger = context['logger']

    try:
        decoded = jwt.decode(event["authorizationToken"], os.environ.get('JWT_SECRET_KEY'))
        # TODO Logic to check if user is allowed to access specific requested endpoint/method
        # (for example, user may be allowed to GET but not PUT)
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
    except jwt.InvalidTokenError as err:
        response = {
            "principalId": "chmod740@gmail.com",
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [{
                    "Action":"execute-api:Invoke",
                    "Effect":"Deny",
                    "Resource":"arn:aws:execute-api:*:*:*/*/*"
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
        # TODO: add permission scopes
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8),
            'iss': 'localhost',
            'sub': user['username'],
            'scopes': [
                {}
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
            "statusCode": 403,
            "headers": {"Access-Control-Allow-Origin" : "*"},
            "body": "Invalid credentials"
        }
