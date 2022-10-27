# BioPath
## Documentation for Specefic Components can be found in READMEs for the subdirectories (ie more information for backend found in backend/README.md)

### GU BioPath web app

To run:
Install Docker Desktop
From the directory containing docker-compose.yaml:
    ```$ docker-compose build```

This will build the docker containers (it might take a while the first time)

Then to start the applications:
   ```$ docker-compose up -d```

The -d stands for detached mode

To check he status of your Docker containers either
    1. Look at Docker Desktop
    2. run ```$ docker-compose ps -a```

To stop the app:
    ```$ docker-compose down```



### Filesystem
```
BioPath
│   README.md
│   docker-compose.yaml 
│
└───frontend
│   │   Dockerfile
│   │   package.json
|   |   package-lock.json
│   │
│   └───public
|   |   |   $ Any assets the front end might need
│   |   │   manifest.json $ Manifest of assets
|   └───src
|       |   App.js $ Core React component
|       |   App.css
|       |   index.js
|       |   index.css
|       |   logo.svg
|       |   reportWebVitals.js
|       └───views
|       |   |   $ Upper level page views
|       |   |   PathwayView.js
|       |   |   PathwayView.css
|       └───components
|       |   |   $ React components in js/css pairs
|       |   |   Component.js
|       |   |   Component.css
│   
└───backend
    │   Dockerfile
    |   manage.py
    |   requirements.txt
    |   settings.ini
    |
    └───api $ this is the django app that defines the functionality for the api
    |   |   admin.py
    |   |   apps.py
    |   |   models.py
    |   |   tests.py
    |   |   views.py
    |   │   
    |   └───migrations
    |   |   |   $ Neccesary migration files
    |   
    └───biopath $ this is the django project that contains the api app
        │   asgi.py
        │   settings.py
        │   urls.py
        │   wsgi.py
```

### Useful commands
- View the data tables Django created in our postgres container
    1. `docker exec -it postgres bash` this will attach a shell to the postgres container
    1. `psql --user=username BioPath` this starts the CLI for the BioPath database
    1. `\dt` display tables: lists the tables in the current database
        - You should see the various tables defined in backend/api/models.py
        - Django created this tables for us; no sql required!


