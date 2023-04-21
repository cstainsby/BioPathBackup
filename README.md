# BioPath
More detailed documentation for each componenet found in the README at...
* [Backend](https://github.com/SD-2022-CPSC-10/BioPath/tree/api/backend#biopath-backend)
* [Frontend](https://github.com/SD-2022-CPSC-10/BioPath/tree/api/frontend)

### GU BioPath web app

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
└───backend: details in backend directories README
|   |   ...
```

## System Build
Problem
I have multiple ways I want the developer and users to interact with the project. The project should be able to have:

### Build Types
All build types explicitly listed
1. local frontend &rarr; local backend &rarr; local DB
2. local frontend &rarr; local backend &rarr; remote DB 
3. local frontend &rarr; remote backend &rarr; remote DB
4. remote frontend &rarr; remote backend &rarr; remote DB
5. local backend &rarr; local DB
6. local backend &rarr; remote DB

**NOTE:** Types 1, 2, and 3 will be for development only, type 4 is for deployment only. 

Within these build types the frontend developer is going to want to use npm start refreshes to make development not miserable
which necessitates two types of build configurations for build types 1, 2, and 3.

### Frontend sub-build configurations
1. npm frontend &rarr; any backend
2. static frontend &rarr; local backend

**NOTE:** 2 is necessary because this is how we are deploying the full application. It is necessary for testing purposes

### Backend sub-build
The backend will always be built using docker. But based on whether the frontend is being staically built into the backend will affect how the backend will be built.

## Environment Variables 

This is a list of all environment variables needed by each part of the project:

#### Backend 
1. DB_NAME
2. DB_HOSTNAME 
3. DB_PORT
4. DB_USERNAME 
5. DB_PASSWORD
6. DJANGO_SECRET_KEY
7. DJANGO_ENV - specifies "production" or "development"

#### Frontend 
1. REACT_APP_BACKEND_ENDPOINT - where requests for the backend will be forwarded to.

### Issues which informed the direction of our setup
**The first issue**, creating connections:

Each one of the four requires a different setup environment variables wise e.g. the frontend needs to know how to reach the backend. The backend needs to know how to reach the database.

**Our fix**:



**The second issue**, secrets: 

Due to the backend's env var 5 and 6 being critical to the app's security, they will be loaded in from either:

*If remote*: aws secret manager

*If local*: a local .env file

NOTE: The backend .env files should **ALWAYS** be ignored by both docker and github. In order to locally run the backend, you need to get this information from another team member or advisor and create the file locally yourself.

### How to add more environment variables 

- To frontend 
    
    The frontend contains the files *.env.backend.local* and *.env.backend.remote*. The .local file will be used when the frontend is built to reach a backend which is local, .remote for remote backend. Add env kv pairs which you will need in either build here. 

    **NOTE:** for a env var to be recognized by react, each variable needs to be prefixed by "REACT_APP_". You **shouldn't** pass sensitive into the react app, therefore it's ok to pass these .env files into source control.

- To Backend

    The backend contains the files *.env.db.local* and *.env.db.remote*. The .local file will be used when the frontend is built to reach a backend which is local, .remote for remote backend. Add env kv pairs which you will need in either build here.

    **NOTE:** These files will contain sensitve information and should **never** be checked into source control.

- To AWS 

    Use [copilot documentation](https://aws.github.io/copilot-cli/docs/developing/secrets/) to add new env vars to aws secrets manager. 

## How to Run
**Referencing the Build Types from the System Build Section**

I will run through a list of common use cases.

**Frontend Development:**

- With the ability to make edits to the backend
    
    See Backend development section, you should run its container locally first. Then run from the frontend root:

        npm run start-local

- Using the remote backend

    Be careful using this, changes to the database from this run type will be reflected on the actual database. Normal backend security should be in place. Run from the frontend root:

        npm run start-remote


**Backend Development:**

With a local database.

**NOTE:** connections to the production database with a development backend should be prevented in order to prevent any data wipes.
Run with this command:

    docker compose --env-file ./backend/.env.db.local up

Take it down with this command:

    docker compose down 


**Test full build locally:**

In order to emulate the conditions which the final build will be in, the frontend will need to be statically built and placed in the backend. 

**NOTE:** the backend in this situation will default to connecting to the remote database.

Run from the project root:

    ./build.sh local_backend

Then run:

    docker compose --env-file ./backend/.env.db.local up

To take it down run:

    docker compose down

**Package for Remote Manually**

Run from the project root:

    ./build.sh remote_backend 

Then navigate to AWS/copilot folder 

    cd AWS/copilot

Then run:

    copilot deploy

