#!/bin/bash
if mongo --quiet "localhost/social-db" --eval "db.stats().ok"=1; then
    exit 0
fi
exit 1