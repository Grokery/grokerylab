#!/usr/bin/env bash

echo "Please enter apiUrl (default: http://localhost:8000/api/v0):"
read apiUrl
apiUrl=${apiUrl:-"http://localhost:8000/api/v0"}

echo "Please enter superadmin username:"
read superAdminUsername
superAdminUsername=${superAdminUsername:-"superAdminTest@email.com"}

echo "Please enter superadmin password:"
read -s superAdminPass
superAdminPass=${superAdminPass:-superadmin123}

echo "Please enter superadmin name (default: 'Super Admin'):"
read superadminName
superadminName=${superadminName:-"Super Admin"}

curl -X POST \
  "$apiUrl/users" \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"'"$superAdminUsername"'",
    "password":"'"$superAdminPass"'",
    "name":"'"$superadminName"'",
    "accountRole":"SUPERADMIN"
}'

echo "Created Superuser: "$superadminName