#! /bin/bash

# requires command line arguement for where frontend should 
#   point its backend requests to

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
if [[ -d ./backend/frontend/static ]]; then
    rm -r ./backend/frontend/static
fi
if [[ -f ./backend/frontend/templates/frontend/index.html ]]; then
    rm ./backend/frontend/templates/frontend/index.html
fi
echo Copying files...
cp -r ./frontend/build/static ./backend/frontend/static
cp ./frontend/build/asset-manifest.json ./backend/frontend/static/asset-manifest.json
cp ./frontend/build/index.html ./backend/frontend/templates/frontend/index.html