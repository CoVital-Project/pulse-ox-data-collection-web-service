#*/usr/bin/env bash

# exit on error. add "|| true" to commands that you allow to fail.
set -o errexit

#Config: 
. ./config.sh

# Get self dir:
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )";

mongo_auth=false

read -p "Does your mongo instance have authentication already? (y/n)" -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]; then
    mongo_auth=true
    echo -n Mongo ADMIN username: 
    read username
    echo -n Mongo ADMIN password: 
    read -s password
    echo
else
  echo
fi

echo -n Mongo new BACKEND username: 
read backenduser
echo -n Mongo new BACKEND password: 
read -s backendpassword
echo

echo -e "\n\n#### Connecting to mongo: Setting up auth and database"
if [ "$mongo_auth" = "true" ]; then
sed s/backenduser/"${backenduser}"/g mongo-db-setup.js | \
sed s/backendpassword/"${backendpassword}"/g | \
sed s/instancename/"${INSTANCE_NAME}"/g | \
mongo --host $INSTANCE_HOST -u "${username}" -p "${password}" --authenticationDatabase "admin" "admin";
else
sed s/backenduser/"${backenduser}"/g mongo-db-setup.js | \
sed s/backendpassword/"${backendpassword}"/g | \
sed s/instancename/"${INSTANCE_NAME}"/g | \
mongo --host $INSTANCE_HOST "admin"
fi

echo -e "\n\n#### Testing Auth: Finding init record."
if [ "$mongo_auth" = "true" ]; then
mongo --host $INSTANCE_HOST -u "${username}" -p "${password}" --authenticationDatabase "admin" "${INSTANCE_NAME}" --eval "db.init.find()"
else
mongo --host $INSTANCE_HOST "${INSTANCE_NAME}" --eval "db.init.find()"
fi

echo -e "Done!"

