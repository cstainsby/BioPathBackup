import os
import subprocess

BACKEND_ROOT_PATH = os.path.dirname(__file__)

def run_backend(backend_setup_pckg):
    run_location = backend_setup_pckg["run_loc"]
    options = backend_setup_pckg["options"]

    if run_location == "local":
        database_location = options["db_loc"]

        if database_location == "local":
            # initilize local database
            pass

        elif database_location == "AWS":
            # connect to RDS
            image_name = "local_rds_backend"
            dockerfile_filename = BACKEND_ROOT_PATH + "/Dockerfile.prod"
            dockerfile_path = BACKEND_ROOT_PATH + "/."
            env_vars = {
                "RDS_DB_NAME": "postgres",
                "RDS_HOSTNAME": "biopath-db.covgnwx3ckfu.us-west-2.rds.amazonaws.com",
                "RDS_PORT": 5432,
                "RDS_USERNAME": "biopath_admin",
                "RDS_PASSWORD": "WsatnbBqr7get9A",
            }

            # Build the Docker image with environment variables
            env_flags = " ".join([f"--build-arg {key}={value}" for key, value in env_vars.items()])
            build_cmd = f"docker build -t {image_name} {env_flags} -f {dockerfile_filename} {dockerfile_path}"
            subprocess.run(build_cmd, shell=True, check=True)

            # Run the docker Container
            env_flags = " ".join([f"-e {key}={value}" for key, value in env_vars.items()])
            run_cmd = f"docker run -p 8000:8000 {env_flags}  {image_name}"
            subprocess.run(run_cmd, shell=True, check=True)



    # elif run_location == "AWS":

    

if __name__=="__main__":
    run_backend({
        "run_loc": "local",
        "options": {
            "db_loc": "AWS"
        } 
    })