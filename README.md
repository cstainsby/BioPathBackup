# GU BioPath web app

To run:
Install Docker Desktop
From the directory containing docker-compose.yaml: ```$ docker-compose build```

This will build the docker containers (it might take a while the first time)

Then to start the applications: ```$ docker-compose up -d```

The -d stands for detached mode

To check he status of your Docker containers either
1. Look at Docker Desktop
2. run ```$ docker-compose ps -a```

To stop the app: ```$ docker-compose down```


