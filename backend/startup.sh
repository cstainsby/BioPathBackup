#!/bin/bash

while !</dev/tcp/db/5432
    do
        sleep 1
    done
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000