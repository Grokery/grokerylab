"""Common definitions.
    These are made available as json lookup data via the API
"""

from enum import Enum

class ResourceTypes(Enum):
    JOBS = 'Jobs'
    DATASOURCES = 'Datasources'
    CHARTS = 'Charts'
    DASHBOARDS = 'Dashboards'
    JOBRUNS = 'Jobruns'
    USERS = 'Users'
    EVENTS = 'Events'
    COMMENTS = 'Comments'
    LOGS = "Logs"
    LOGLINES = "Loglines"

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
