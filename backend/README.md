# BioPath Backend
## General Information
All of the code and relevant information for the backend can be found in this directory with basic initialization commands stored in docker-compose.yaml of the root directory. We are using Django + Django-REST-Framework (DRF) connected to a Postges database. Django manages all of the database interraction for us so, beyond initialization and opening the necessary ports, we don't directly touch Postgres. Note that, when using docker-compose for running everything, the Postgres database is mounted to the root directory for data persistence while containers are shutdown, but that this directory is ignored by git as this is for development only and in the deployed environment our Postgres container is unused in favor of a prebuilt AWS Postgres solution. As such we have to keep an eye on the ports, urls, etc as they will need to be configured differently for deployment.

Note that for dev, using the Django development server is preferred as it will automatically update as you make changes to the source code. However, for prod, this server is not adequate; as such we are using Gunicorn to handle WSGI and Nginx for serving static files and proxying to Gunicorn. As such the Docker container uses this more complex server setup so that you can ensure everything is working on your computer before deploying. You shouldn't have to mess with the server configuration too much, but it's worth having someone learn the basics so that you're not screwed when something goes wrong. Check out the Dockerfile, nginx.conf, and startup.sh to see what's going on behind the scenes.

This is the architecture we are using.  
![Architecture Diagram](../architecture-diagram.png)


Checkout this [Django course](https://www.youtube.com/watch?v=c708Nf0cHrs). It's really long but super useful and he has timestamps so you can just skip to the section you are confused on. I also recommend that you go through the process of building you're own very basic Django/DRF api before working on this. Just spend an hour or two following some quick tutorial so you have a basic understanding of what all is happening before you start messing with this code.

## File Structure
This does not contain every file or directory, just the one's that are most critical for you to understand what's going. Django creates a bunch of files and directories that are necessary for everything to work, but aren't necessary for you the developer to mess with or fully understand. These are the files that we have found useful/written code in so far, but please expand this as you inevitably end up modifying or adding other files. Also read [this](https://techvidvan.com/tutorials/django-project-structure-layout/) to better understand the files that Django creates and what they do.

```
Backend
|   Dockerfile $ Dockerfile for backend container. [Dockerfile](https://www.cloudbees.com/blog/what-is-a-dockerfile).  
|---api $ Currently the only app within the project biopath.  
|   |   models.py $ Declares models for api. Django automatically modifies database to match this when migrated.  
|   |   serializers.py $ Uses DRF to serialize models into more basic data types like JSON so that views.py doesn't have to. [Serializers](https://www.django-rest-framework.org/api-guide/serializers/).  
|   |   tests.py $ Don't be like me. Test your code. [Django testing](https://docs.djangoproject.com/en/4.1/topics/testing/overview/) makes it easy.  
|   |   urls.py $ Routes urls to the views in views.py. Using [DRF's routers](https://www.django-rest-framework.org/api-guide/routers/) makes this a breeze and ensures consistency.  
|   |   views.py $ Declares functions that return the json response when a specefic endpoint is reached. DRF's [ViewSets](https://www.django-rest-framework.org/api-guide/viewsets/) make this easy.  
|---biopath $ The Django project that holds our api.  
|   |   settings.py $ Settings for the project (such as how to connect to the database).  
|   |   urls.py $ Routes url routes to views or url prefix patterns to an app's urls.py.  
|   manage.py $ CLI tool for managing the Django project. `python manage.py help`  
|   requirements.txt $ Package requirements to be pip installed on container initialization.  
|   startup.sh $ Startup commands to get Django up and running after container starts.  
|---frontend $ The directory that stores the static files for the frontend.  
|   nginx.conf $ The nginx configuration settings for prod/local docker.  
```

## API
This is a RESTful API so an understanding of the REST architectural constraints, and especially [CRUD](https://www.codecademy.com/article/what-is-crud) will make understanding and using the interface very easy. We also suggest playing with the [web interface](http://localhost:8000/api) to learn the endpoints and http methods.
So far the available resources are located at...
* /api/enzymes/
* /api/substrates/
* /api/pathways/
* /api/users/ *
* /api/groups/ *

## Database
### Schema
The database has the following tables...
* Enzymes(*name*, reversible, image)
* Substrates(*name*, image)
* PathwayConnections(*pathway, **enzyme_from**, **enzyme_to***, **substrate**)
* EnzymeSubstrates(***enzyme**, **substrate***, substrate_type, focus)

Note that this list is not complete and not exactly correct. It is useful for understanding how we are conceptually modeling our data, but not an exact representation of the actual DB as Django builds these tables procedurally from the models. As such, in most cases you will likely benefit more from directing your focus to models.py then the actual specefics of how they're stored in the DB.

If you need to know the specefics of how these tables look you're gonna have to exec into the Postgres container and look at it yourself (look at instructions below). One important thing to note is that Django doesn't allow for mulit-field primary keys so they actually have an id field as the primary key and a restriction enforcing uniqueness of the two (or more) fields combined.

### CLI for Postgres from within container
To open a cli for the database...
1. exec into database container (recommend using docker desktop or vscode extension, but a simple `docker exec -it postgres bash` should work)
1. `psql BioPath username`
1. Read [this](https://tomcam.github.io/postgres/#getting-information-about-databases) to see how to submit queries, display tables, etc.

## Django Admin
To create an admin account just startup the containers per usual and then...
1. exec into backend container (recommend using docker desktop or vscode extension, but a simple `docker exec -it backend bash` should work)
1. `python manage.py createsuperuser`
1. Fill in username and password. I've been using root root but y'all can use whatever in dev.
1. Go to [http://localhost:8000/admin](http://localhost:8000/admin)
1. You should be able to login with the user info you supplied. Now you can administer to your hearts content!

## Tests
The philosophy for testing your views is the same as for testing your
models; you need to test anything that you've coded or your design 
specifies, but not the behavior of the underlying framework and other 
third party libraries.  
To run tests just run python3 manage.py test

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Testing

## Install Requirements
If you'd like to run the backend without Docker (heavily recommended if you are modifying the API or other backend code), all you need to do is install Django, `pip3 install requirements.txt`, `python3 manage.py runserver`. In this case you will probably still want to use the Postgres container (`docker-compose up db`), but you can also run postgres on bare metal if you so wish. In general, if you run into issues, checkout the Dockerfiles as they are essentially just a list of commands that must be ran in order to get everything up and running from scratch. Note though that our backend container is using a production type server configuration (using Gunicorn & Nginx instead of Django dev. server). For development the Django development server (which starts when you run python3 manage.py runserver) is preferred.
