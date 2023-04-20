#!/bin/bash

# busy wait until port 5432 is open so that we can succesfully connect to db
echo "Waiting for database..."
while !</dev/tcp/db/5432; do
    sleep 0.1
done

echo "Migrating and loading..."
python manage.py makemigrations
python manage.py migrate
# python manage.py load_data

echo "Starting Gunicorn..."
gunicorn biopath.wsgi:application --log-file=/dev/stdout --bind 127.0.0.1:8000 &

echo "Starting nginx..."
exec nginx -g 'daemon off;'

echo "Done." # this should never print