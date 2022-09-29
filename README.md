### BioPath
# Run Instructions
1. Build images
    - `docker-compose build`
1. Start containers
    - `docker-compose up`

# Useful commands
- View the data tables Django created in our postgres container
    1. `docker exec -it postgres bash` this will attach a shell to the postgres container
    1. `psql --user=username BioPath` this starts the CLI for the BioPath database
    1. `\dt` display tables: lists the tables in the current database
        - You should see the various tables defined in backend/api/models.py
        - Django created this tables for us; no sql required!