#!/usr/bin/env bash

# This script will walk you through creating a new account.

echo "Please enter apiUrl (default: http://localhost:8000/api/v0):"
read apiUrl
apiUrl=${apiUrl:-"http://localhost:8000/api/v0"}

echo "Please enter superadmin username:"
read superAdminUsername
superAdminUsername=${superAdminUsername:-"superAdminTest@email.com"}

echo "Please enter superadmin password:"
read -s superAdminPass
superAdminPass=${superAdminPass:-"superadmin123"}

echo "Authorizing..."
echo "Auth response:"
curl -X POST \
  "$apiUrl/users/authenticate" \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{ 
	"username": "'"$superAdminUsername"'",
	"password": "'"$superAdminPass"'"
}'
echo

printf "\n\nPlease enter account token from response if auth successful:"
read token

curl -X POST \
  "$apiUrl/accounts" \
  -H 'Authorization: '$token \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
    "type":"BASIC"
}'
echo

echo "Please enter the new accountId from the response:"
read accountId

echo "Please enter a username (email) for an admin user on the new account:"
read adminUsername
adminUsername=${adminUsername:-"adminTest@email.com"}

echo "Please enter password for new admin user:"
read -s adminPass
adminPass=${adminPass:-"admin123"}

echo "Please enter name for new admin user:"
read adminName
adminName=${adminName:-"Admin User"}

curl -X POST \
  "$apiUrl/users" \
  -H 'Authorization: '$token \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "'"$adminUsername"'",
    "password": "'"$adminPass"'",
    "name": "'"$adminName"'",
    "accountId": "'"$accountId"'",
    "accountRole":"ADMIN",
    "clouds": {}
}'
echo
