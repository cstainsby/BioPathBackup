# GU BioPath web app

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
│       │   
|       └───components
|       |   |   $ React components in js/css pairs
|       |   |   Component.js
|       |   |   Component.css
│   
└───backend
    │   Dockerfile
    │   check_db.py
    |   manage.py
    |   requirements.txt
    |   settings.ini
    |
    └───djangoApp
    |   |   admin.py
    |   |   apps.py
    |   |   models.py
    |   |   tests.py
    |   |   views.py
    |   │   
    |   └───migrations
    |   |   |   $ Neccesary migration files
    |   
    └───djangoSettings
        │   asgi.py
        │   settings.py
        │   urls.py
        │   wsgi.py
```
