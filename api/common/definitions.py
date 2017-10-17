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
    AWS_DATAPIPELINE = "AWS DataPipeline"
    AZURE_DATAFACTURY = "Azure DataFactury"
    GOOGLE_BIGQUERYSPROC = "Google BigQuery Sproc"

class SourceTypes(Enum):
    AWS_S3 = "AWS S3"

class CloudTypes(Enum):
    LOCAL = "Local"
    AWS = "AWS"
    AZURE = "Azure"
    GOOGLE = "Google"
