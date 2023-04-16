#!/bin/bash
cd ./frontend
npm i
npm run build-remote

if [ $? -ne 0 ]; then
    echo "ERROR: NPM failed to build. Exiting."
    exit 1
fi

cd .. 
echo Removing files...
rm -rf ./backend/frontend/*
echo Copying files...
cp -r ./frontend/build/* ./backend/frontend/