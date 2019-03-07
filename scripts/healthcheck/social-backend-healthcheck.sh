#!/bin/bash
# mkdir lorenxo
backendStatus=$(curl http://localhost:5000/api/users/test | jq -r '.ok')
echo $backendStatus
if [ $backendStatus = true ]; then
    exit 0
fi
exit 1