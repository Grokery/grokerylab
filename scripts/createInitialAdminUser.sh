#!/usr/bin/env bash

# This script creats an initial admin user in a newly installed api.
# It will fail with a 'Not Authorized' error if there are any users 
# already in the system. After initializing, you can log in to the
# UI to create additional users.

echo "Please enter apiUrl (default: http://localhost:8000/api/v0):"
read apiUrl
apiUrl=${apiUrl:-"http://localhost:8000/api/v0"}

echo "Please enter a username (email) for an admin user on the new account:"
read adminUsername
adminUsername=${adminUsername:-""}

echo "Please enter password for new admin user:"
read -s adminPass
adminPass=${adminPass:-""}

echo "Please enter name for new admin user:"
read adminName
adminName=${adminName:-""}

curl -X POST \
  "$apiUrl/users" \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "'"$adminUsername"'",
    "password": "'"$adminPass"'",
    "name": "'"$adminName"'",
    "accountRole":"ADMIN"
}'
echo
