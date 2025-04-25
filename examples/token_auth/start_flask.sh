#!/bin/bash

pushd /home/tsadmin/auth
source venv/bin/activate
export FLASK_APP="gettoken"
echo "Starting flask app $FLASK_APP"
flask run
popd
