docker-compose down
bash ./buildfrontend.sh
docker-compose build
docker-compose up -d