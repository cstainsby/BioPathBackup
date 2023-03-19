import os
import subprocess
from InquirerPy import inquirer

BACKEND_ROOT_PATH = os.path.dirname(os.path.abspath(__file__)) + "/backend"

def run_backend(backend_setup_pckg):
    database_location = backend_setup_pckg["db_loc"]

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


def ask_for_backend_build_settings():
    backend_pckg = {
        "db_loc": None
    }

    database_location = inquirer.select(
        message="Where will the database be located?",
        choices=["local", "AWS"]
    ).execute()
    backend_pckg["db_loc"] = database_location

    return backend_pckg


if __name__=="__main__":
    """Driver for backend only
    """
    backend_pckg = ask_for_backend_build_settings()
    run_backend(backend_setup_pckg=backend_pckg)