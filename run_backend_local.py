import os
import json
import subprocess
from InquirerPy import inquirer


PROJECT_ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
BACKEND_ROOT_PATH = os.path.dirname(os.path.abspath(__file__)) + "/backend"


def get_rds_vars():
    rds_env_vars = {}
    with open(PROJECT_ROOT_PATH + "/system_info.json", 'r') as f:
        data = json.load(f)
        rds_env_vars = data["DATABASE"]["REMOTE"]
    return rds_env_vars

def run_backend(backend_setup_pckg):
    database_location = backend_setup_pckg["db_loc"]

    if database_location == "local":
        # initilize local database
        pass

    elif database_location == "AWS":
        # connect to RDS
        image_name = "local_rds_backend"
        dockerfile_filename = BACKEND_ROOT_PATH + "/Dockerfile"
        dockerfile_path = BACKEND_ROOT_PATH + "/."

        rds_env_vars = get_rds_vars()
        if not rds_env_vars:
            print("Error: import error when trying to get rds info")
            return
        else:
            env_vars = rds_env_vars

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