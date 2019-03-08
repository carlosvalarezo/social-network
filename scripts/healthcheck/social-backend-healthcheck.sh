#!/bin/bash

backendStatus=$(curl http://localhost:5000/api/users/test | jq -r '.ok')
if [ $backendStatus = true ]; then
    exit 0
fi
exit 1