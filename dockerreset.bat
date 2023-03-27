docker-compose down
bash ./buildfrontend
docker-compose build
docker-compose up -d