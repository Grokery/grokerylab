"""Common definitions.
    These are made available as json lookup data via the API as the lengua franca of common types etc.
"""

from enum import Enum

class ResourceTypes(Enum):
    JOBS = 'jobs'
    SOURCES = 'datasources'
    CHARTS = 'charts'
    BOARDS = 'dashboards'
    RUNS = 'jobruns'
    USERS = 'users'
    EVENTS = 'events'
    COMMENTS = 'comments'
    LOGS = "logs"
    LOGLINES = "loglines"

class JobTypes(Enum):
    AWS_KINESIS = "AWS Kinesis"
    AWS_LAMBDA = "AWS Lambda"
    AWS_DATAPIPELINE = "AWS DataPipeline"
    AZURE_DATAFACTURY = "Azure DataFactury"
    AZURE_DATALAKE_USQL = "Azure DataLake USQL"
    GOOGLE_BIGQUERYSPROC = "Google BigQuery Sproc"

class SourceTypes(Enum):
    MYSQL = "MySQL Table"
    MONGODB = "MongoDB Collection"
    AWS_S3 = "AWS S3 Folder"
    AWS_DYNAMODB = "AWS DynamoDB"
    AWS_REDSHIFT = "AWS RedShift"
    AZURE_DATALAKE_STORE = "Azure DataLake Store"

class CloudTypes(Enum):
    LOCAL = "Local"
    AWS = "AWS"
    AZURE = "Azure"
    GOOGLE = "Google"
