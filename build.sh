#!/bin/bash
cd ./frontend
npm i

# default to local endpoint if in
if [ "$1" = "remote_backend" ]; then
    echo Building frontend for remote backend access
    npm run build-remote
elif [ "$1" = "local_backend" ]; then 
    echo Building frontend for local backend access
    npm run build-local
else 
    echo "ERROR: invalid command line arg passed"
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "ERROR: NPM failed to build. Exiting."
    exit 1
fi

cd .. 
echo Removing old files...
rm -rf ./backend/frontend/*
echo Copying in new files...
cp -r ./frontend/build/* ./backend/frontend/