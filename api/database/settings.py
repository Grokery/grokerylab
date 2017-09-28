"""Settings.py"""

import os
from os.path import join, dirname
from dotenv import load_dotenv

load_dotenv(join(dirname(__file__), '.env'))

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')

DATABASE = os.environ.get('DATABASE')

MONGODB_HOST = os.environ.get('MONGODB_HOST')
MONGODB_DB_NAME = os.environ.get('MONGODB_DB_NAME')




