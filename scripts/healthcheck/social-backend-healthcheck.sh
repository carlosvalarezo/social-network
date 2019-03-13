#!/bin/bash

backendStatus=$(curl $ADDRESS:$PORT/api/users/test | jq -r '.ok')
if [ $backendStatus = true ]; then
    exit 0
fi
exit 1