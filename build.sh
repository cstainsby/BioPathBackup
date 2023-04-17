#!/bin/bash
cd ./frontend
npm i

# default to local endpoint if in
if [ "$1" = "remote_backend" ]; then
    npm run build-remote
elif [ "$1" = "local_backend" ]; then 
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
echo Removing files...
rm -rf ./backend/frontend/*
echo Copying files...
cp -r ./frontend/build/* ./backend/frontend/