# BioPath
More detailed documentation for each componenet found in the README at...
* [Backend](https://github.com/SD-2022-CPSC-10/BioPath/tree/api/backend#biopath-backend)
* [Frontend](https://github.com/SD-2022-CPSC-10/BioPath/tree/api/frontend)

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
There are multiple ways the developer and users should be able to interact with the project. The project should be able to have:

### Build Configuration Types
- &rarr; *for points requests to*
- \+ *for showing built into - requests are still sent between components*


All build types explicitly listed
1. local npm frontend &rarr; local backend &rarr; local DB
2. local static frontend + local backend &rarr; local DB
3. local npm frontend &rarr; local backend &rarr; remote DB
4. local static frontend + local backend &rarr; remote DB 
5. local npm frontend &rarr; remote backend &rarr; remote DB
6. remote static frontend + remote backend &rarr; remote DB

Types 1-5 will be for development only, type 6 is for deployment only. 


### Frontend sub-build configurations
1. npm frontend &rarr; any backend
2. static frontend + local backend

**NOTE:** 2 will always be done when spinning up the backend so there will always be a static version that will be reachable when running the backend at the root of port 80. having an npm frontend running as well speeds up development significantly though.


## Environment Variables 

This is a list of all environment variables needed by each part of the project:

#### Backend 
1. DB_NAME
2. DB_HOSTNAME 
3. DB_PORT
4. DB_USERNAME 
5. DB_PASSWORD
6. DJANGO_SECRET_KEY
7. DJANGO_ENV - specifies "production" or "local"
8. DJANGO_ALLOWED_HOSTS - specifies allowed cors
9. DJANGO_ENDPOINT - endpoint backend is running on


#### Frontend 
1. REACT_APP_BACKEND_ENDPOINT - where requests for the backend will be forwarded to.

The environment variables will be injected into the running instances through.
 - *If remote*: aws secret manager
 - *If local*: a local .env file 

**NOTE:** The backend .env.db.remote files should **ALWAYS** be ignored by both docker and github. In order to locally run the backend, you need to get this information from another team member or advisor and create the file locally yourself.

### How to add more environment variables 

- To frontend 
    
    The frontend contains the files *.env.backend.local* and *.env.backend.remote*. The .local env file will be used when the frontend is built to reach a backend which is local, .remote env file for a remote backend. Add env kv pairs which you will need in either build here.

    **NOTE:** for a env var to be recognized by react, each variable needs to be prefixed by "REACT_APP_". You **shouldn't** pass sensitive into the react app, therefore it's ok to pass these .env files into source control.

- To Backend

    The backend contains the files *.env.db.local* and *.env.db.remote*. The .local env file will be used when the backend is built to reach a database which is local, .remote env file for a remote database. Add env kv pairs which you will need in either build here.

    **NOTE:** .env.db.remote will contain sensitve information and should **never** be checked into source control. To get the information to create this file locally, you should talk to your supervisor or teamates.

- To AWS 

    Use copilot documentation for [basic environment variables](https://aws.github.io/copilot-cli/docs/developing/environment-variables/) and [secrets](https://aws.github.io/copilot-cli/docs/developing/secrets/) for aws secrets manager. 

## How to Run
**What to Install:**
- Python^3.10
- Node^16
- docker
- docker-compose

**What To Create:**

For remote versions you will need to add file *.env.db.remote*. This file will be in the same backend/ folder alongside its *.env.db.remote*. You will need to copy in the environment information from your supervisor. It will need to match the form of the local env file.

**Referencing the Build Types from the System Build Section**

I will run through a list of common use cases.

### Use Cases
#### Frontend Development:

#### NPM development 
- With the ability to make edits to the backend
    
    See Backend development section, you should run its container locally first. Then run from the frontend root:

        npm i
        npm run start-local

    You will also need to spin up a backend if you are targeting a local backend, checkout the Backend Development section below.

- Using the remote backend

    Be careful using this, changes to the database from this run type will be reflected on the actual database. Normal backend security should be in place. Run from the frontend root:

        npm run start-remote

**NOTE:** you can change these scripts within package.json, we are using the node package env-cmd to dynamically bring in environment variables.

#### Static Build
In order to get a static build into the backend to run, run the build.sh file in the root of the project. Pass arguments into it to tell it where to expect the backend e.g.:

For local backend:

        ./build.sh local_backend
    
For remote backend:

        ./build.sh remote_backend

This will build a static directory in the backend/frontend/ folder where it can be served by the backend. You will need to follow the Backend development steps to work with this static build.

#### Backend Development:

**NOTE:** connections to the production database with a development backend **should** be prevented in order to prevent any data wipes.

#### Local Backend
We do this with docker-compose. If you want to change which database it is targeting, change the env file to the db you want to target.

Also if you want to use the docker-compose file you will want to run:

```export BIOPATH_ROOT_PATH=<Your absolute project root path>```

Run with this command:

    docker compose build
    docker compose up -d

Take it down with this command:

    docker compose down 

It is important to know that our backend will always have a statically built frontend version by default which will be running at the root of the localhost port. If you want to update this frontend version ./build.sh.

**Important:** You will need to manage the nginx.conf file's server name within the backend to make sure the built project is being exposed correctly. If being run locally, use "localhost section", remote use the link.

**Package for Remote Manually**

Run from the project root:

    ./build.sh remote_backend 

Then navigate to AWS/copilot folder 

    cd AWS/copilot

Then run:

    copilot deploy

