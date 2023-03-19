import os
import subprocess
from InquirerPy import inquirer

FRONTEND_ROOT_PATH = os.path.dirname(os.path.abspath(__file__)) + "/frontend"

def run_frontend(frontend_setup_pckg):
    run_type = frontend_setup_pckg["run_type"]
    backend_endpoint = frontend_setup_pckg["backend_run_loc"]
    
    # for NPM run types
    if run_type == "NPM":
        # if there is a defined backend endpoint 
        #   add it to the envoirnment variables 
        if backend_endpoint:
            os.environ["BACKEND_ENDPOINT"] = backend_endpoint

        subprocess.run(["npm", "--prefix", f"{FRONTEND_ROOT_PATH}", "run", "start"])

    # for containerized run types
    elif run_type == "docker container":
        image_name = "local_rds_backend"
        dockerfile_filename = FRONTEND_ROOT_PATH + "/Dockerfile.prod"
        dockerfile_path = FRONTEND_ROOT_PATH + "/."
        env_vars = {
            "BACKEND_ENDPOINT": backend_endpoint
        }

        # Build the Docker image with environment variables
        env_flags = " ".join([f"--build-arg {key}={value}" for key, value in env_vars.items()])
        build_cmd = f"docker build -t {image_name} {env_flags} -f {dockerfile_filename} {dockerfile_path}"
        subprocess.run(build_cmd, shell=True, check=True)

        # Run the docker Container
        env_flags = " ".join([f"-e {key}={value}" for key, value in env_vars.items()])
        run_cmd = f"docker run -p 3000:3000 {env_flags}  {image_name}"
        subprocess.run(run_cmd, shell=True, check=True)



def ask_for_frontend_build_settings():
    """Asks the user for details on how to run the frontend"""
    frontend_pckg = {
        "run_type": None,
        "run_alone": None,
        "backend_run_loc": None
    }

    # determine which way the developer would like to run locally 
    local_run_type = inquirer.select(
        message="How would you like to run it",
        choices=["NPM", "docker container"]
    ).execute()
    frontend_pckg["run_type"] = local_run_type

    # ask if the user will be running the frontend without the backend
    is_run_alone = inquirer.select(
        message="Will you be running the frontend without the backend?",
        choices=["Yes", "No"]
    ).execute()
    frontend_pckg["run_alone"] = is_run_alone

    # if the user is running the frontend with the backend, determine 
    #      where the backend can be accessed from 
    if is_run_alone == "No":
        backend_run_loc = inquirer.select(
            message="Where is the backend you will accessing",
            choices=[
                "localhost:8000", 
                "http://6umnppgwmc.us-west-2.awsapprunner.com/",
                "other"]
        ).execute()

        if backend_run_loc == "other":
            backend_run_loc = inquirer.text(
                message="Enter you chosen endpoint",
            ).execute()
        frontend_pckg["backend_run_loc"] = backend_run_loc

    return frontend_pckg 

if __name__ == "__main__":
    """Driver for frontend only
    """
    frontend_pckg = ask_for_frontend_build_settings()
    run_frontend(frontend_setup_pckg=frontend_pckg)