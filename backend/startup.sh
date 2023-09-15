#!/bin/bash

echo "Migrating and loading..."
python manage.py makemigrations
python manage.py migrate
# python manage.py load_data

echo "Starting Gunicorn..."
gunicorn biopath.wsgi:application --log-file=/dev/stdout --bind 127.0.0.1:8000 &

echo "Starting nginx..."
exec nginx -g 'daemon off;'

echo "Done." # this should never print