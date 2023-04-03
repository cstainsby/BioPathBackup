#!/bin/bash
echo "Checking database status..."
	
if pg_ctl status ; then echo "Database is running."
else
    echo "Starting database."
    pg_ctl start
fi

echo "Starting Django server..."
python3 backend/manage.py makemigrations
python3 backend/manage.py migrate
python3 backend/manage.py runserver