#! /bin/bash

cd ./frontend
npm i
npm run build
cd .. 
echo Removing files...
if [[ -d ./backend/frontend/static ]]; then
    rm -r ./backend/frontend/static
fi
if [[ -f ./backend/frontend/templates/frontend/index.html ]]; then
    rm ./backend/frontend/templates/frontend/index.html
fi
echo SUCCESS
echo Copying files...
cp -r ./frontend/build/static ./backend/frontend/static
cp ./frontend/build/asset-manifest.json ./backend/frontend/static/asset-manifest.json
cp ./frontend/build/index.html ./backend/frontend/templates/frontend/index.html
echo SUCCESS
