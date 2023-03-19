# ------------------------------------------------------------------------------------
# NAME: run.py
# DESC: The purpose of this file is to create a simple interface for running 
#       any configuration of the file 
# Motivation:
#   While working on this project, we have found it a lot more convenient to 
#   run the project in a multitude of ways.
#
#   FRONTEND:
#     The frontend will be mainly run through docker, npm tools, and on AWS.
#     NPM is the preferable option for local development, you can see you changes 
#     immediatly which speeds up your workflow considerably. Docker is slower but 
#     it is the format we are pushing our changes on. It is always worth testing 
#     the frontend on it before a push.
#
#   BACKEND:
#     The 
# ------------------------------------------------------------------------------------

import os
import subprocess
from InquirerPy import inquirer


from run_frontend_local import run_frontend, ask_for_frontend_build_settings
from run_backend_local import run_backend, ask_for_backend_build_settings


PROJ_ROOT_PATH = os.path.dirname(__file__)

def print_header(msg: str):
    print()
    print("-------------------------------------------")
    print("\t{}".format(msg))
    print("-------------------------------------------")



if __name__ == "__main__":
    selected_parts = list(inquirer.checkbox(
        message="Choose What you want to run (space to select, enter to confirm)",
        choices=["frontend", "backend"]
    ).execute())

    if "frontend" in selected_parts and "backend" in selected_parts:
        run_docker_compose = inquirer.select(
            message="Would you like to run everything in tandem with docker-compose locally",
            choices=["Yes", "No"]
        ).execute()

    if run_docker_compose == "Yes": 
        # check if BIOPATH_ROOT_PATH is defined 
        if "BIOPATH_ROOT_PATH" not in os.environ:
            os.environ["PROJ_ROOT_PATH"] = PROJ_ROOT_PATH
        # run docker-compose commands
        subprocess.run(["docker-compose", "build"])
        subprocess.run(["docker-compose", "up", "-d"])

        print("Run 'docker-compose down' when you want to take down your containers")

    else:
        if "frontend" in selected_parts:
            print_header("CONFIGURE FRONTEND")
            frontend_pckg = ask_for_frontend_build_settings()
            run_frontend(frontend_pckg)

        if "backend" in selected_parts:
            print_header("CONFIGURE BACKEND")
            backend_pckg = ask_for_backend_build_settings()
            run_backend(backend_pckg)

        
