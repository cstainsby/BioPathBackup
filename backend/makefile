say_hello:
	echo "Hello World"

docker_run:
	pg_ctl stop
	docker-compose down
	docker-compose build
	docker-compose up

# docker_test:
# 	pg_ctl stop
# 	docker-compose down
# 	docker-compose build
# 	docker-compose up



local_run:
	docker-compose down
	pg_ctl stop
	export POSTGRES_DB=postgres
	export POSTGRES_DB_HOST=localhost
	export POSTGRES_USER=joshuaschmitz
	export POSTGRES_PASSWORD=Icui4cu8
	pg_ctl start
	python3 manage.py makemigrations
	python3 manage.py migrate
	python3 manage.py runserver

local_test:
	docker-compose down
	pg_ctl stop
	pg_ctl start
	python3 manage.py makemigrations
	python3 manage.py migrate
	python3 manage.py test

teardown:
	docker-compose down
	pg_ctl stop