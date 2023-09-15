# useful commands for running and testing the app

build:
	./build.sh 

docker_run: build
	docker-compose down
	docker-compose build
	docker-compose up -d

run: build
	./run.sh

backend_test:
	cd backend && \
		python3 manage.py makemigrations && \
		python3 manage.py migrate && \
		python3 manage.py test