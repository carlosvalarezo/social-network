#!/bin/bash
mongoStatus=$(mongo --quiet "localhost/social-db" --eval "db.stats().ok")
if (($mongoStatus=="1"))
then
    exit 0
fi
exit 1