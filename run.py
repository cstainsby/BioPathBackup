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
from pygit2 import Repository


PROJ_ROOT_PATH = os.path.dirname(__file__)

# define which branchs are allowed to push to AWS
AWS_ALLOWABLE_BRANCHES = [
    "main",
    "dev",
    "cole_aws_push"
]

# def parse_yes_or_no(input: str):
#   """parses a string for a (y/N) and returns a boolean, can return None for bad input"""
#   if len(input) > 0:
#     if input[0].lower() == 'y':
#       return True 
#     elif input[0] == 'n':
#       return False
#   return None

def print_header(msg: str):
    print()
    print("-------------------------------------------")
    print("\t{}".format(msg))
    print("-------------------------------------------")


def setup_frontend():
    frontend_package = {
        "run_loc": "",
        "options": {
        
        }
    }

    current_checked_branch = Repository('.').head.shorthand
    is_AWS_allowed = current_checked_branch in AWS_ALLOWABLE_BRANCHES

    if is_AWS_allowed:
        run_loc = inquirer.select(
        message="Where would you like to run your frontend:",
        choices=["AWS", "local"]
        ).execute()
        frontend_package["run_loc"] = run_loc

    else:
        print("Pushes to AWS not allowed within this branch, defaulting to local")
        frontend_package["run_loc"] = "local"

    if run_loc == "local":
        local_run_type = inquirer.select(
        message="How would you like to run it",
        choices=["NPM", "docker container"],
        ).execute()
        frontend_package["options"]["type"] = local_run_type

    elif run_loc == "AWS":
        aws_push_confirm = inquirer.confirm(
        message="Are you sure you want to push to AWS, this will replace the current images stored within ECR"
        ).execute()

        # if aws_push_confirm:
        #   os.system(PROJ_ROOT_PATH + "")

def setup_backend():
    # os.environ[]

    # configure db here - db and backend depend on each other
    pass


def run_setup(setup_pckg: dict):
    """Based on the returned contents of the frontend and backend setup functions, 
        the pckg dictionary will be parsed and will start """
    return


if __name__ == "__main__":
    run_everything = inquirer.select(
        message="Would you like to run everything in tandem with docker-compose locally",
        choices=["Yes", "No, I want to configure my own build"]
    ).execute()

    if run_everything != "Yes":
        # configure frontend
        print_header("FRONTEND SETUP")
        run_frontend = inquirer.select(
            message="Do you want to run the frontend",
            choices=["Yes", "No"]
        ).execute()
        
        if run_frontend == "Yes": 
            frontend_pckg = setup_frontend()


        # configure backend
        print_header("BACKEND SETUP")
        run_backend = inquirer.select(
            message="Do you want to run the backend",
            choices=["Yes", "No"]
        ).execute()
        
        if run_backend == "Yes": 
            backend_pckg = setup_backend()
    
    else:
        # check if BIOPATH_ROOT_PATH is defined 
        if "BIOPATH_ROOT_PATH" not in os.environ:
            subprocess.run(["export", f"PROJ_ROOT_PATH={PROJ_ROOT_PATH}"])
        # run docker-compose commands
        subprocess.run(["docker-compose", "build"])
        subprocess.run(["docker-compose", "up", "-d"])

    # begin running defined setup
    print_header("SETTING UP ENVIORNMENT")