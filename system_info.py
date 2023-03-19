"""
This file is a wrapper for interacting with the local_build_config.json storage file
It will be up to the user of this env file to manage its information. 
YOU CAN CHOOSE TO NOT USE THIS FILE, it is here to make lives easier though.

Files that will depend on the information stored in the json are:
    - run.py
    - run_frontend_local.py
    - run_backend_local.py


NOTE: It may be necessary to build out a better storage system than what we are using now, but for our purposes 
      it's easier to have one place to dump env info for now to keep the number of files low.

NOTE: This file is auto-generated, 
      be careful making edits to the json file directly or dependants on the information stored in this file might break
      Also be careful not to expose the information in this file, some of it may be 
      The json file SHOULD be ignored by github inside the .gitignore
"""

import json
import os
import sys
from InquirerPy import inquirer

PROJ_ROOT_PATH = os.path.dirname(os.path.abspath(__file__)) 

# here is a labeled outline describing the purpose of each of the sections
config_template = {
    "REGISTERED_AWS_CREDS": {
        "default cred id": None,   # each cred will be identified by account_id, default's value will be the chosen set of credentials

        # list credentials here
        # e.g.
        # "219555571562": {
        #   "Username": "<val>",
        #   "Account ID": "<val>",
        #   "Access key ID": "<val>",
        #   "Secret Access Key": "<val>" 
        #   "Password": "<val>"
        # }
    },
    # for storing information related to the backend
    "BACKEND_INFO": {
        "SECRET_KEY": "", 
        "LOCAL": {
            "default port": 8000,
            "defined local endpoint": "http://localhost:8000"
        },
        "REMOTE": {
            "defined endpoint": None
        }
    },
    "FRONTEND_INFO": {
        "LOCAL": {
            "default port": 3000,
            "defined local endpoint": "http://localhost:3000"
        },
        "REMOTE": {
            "defined endpoint": None
        }
    },
    "DATABASE": {
        "LOCAL": {
            "default port": 5432
        },
        "REMOTE": {
            "RDS_DB_NAME": "postgres",
            "RDS_HOSTNAME": "biopath-db.covgnwx3ckfu.us-west-2.rds.amazonaws.com",
            "RDS_PORT": 5432,
            "RDS_USERNAME": "biopath_admin",
            "RDS_PASSWORD": "WsatnbBqr7get9A",
        }
    }
}

def print_base_usage_info():
    print("""
    This file is a wrapper for interacting with the system_info.json storage file.
    This information will be used in the run and deploy tools that are provided in:
        - run.py
        - run_frontend_local.py
        - run_backend_local.py

    YOU DONT HAVE TO USE THESE COMMANDS IN GENERAL but it is here to make it easier
    to manage the growing amount of information and commands that need to be kept 
    track of. It will be up to the user of this env file to manage its information 
    and keep it up to date. 
    
    Possbile argument options you can run from this file are:
        - AWS
        - backend
        - frontend
        - database

    AWS - takes you through a prompt to edit or add to your AWS credentials

    backend, frontend, and database - takes you through a prompt where to can edit 
                                      your local and remote config info for its 
                                      respective section.

    an example run from the folder which contains this file would be:
        python3 system_info.py AWS
    """)

def open_system_json_file(mode: str = "r"):
    file_path = PROJ_ROOT_PATH + "/system_info.json"
    return open(file_path, )

def setup_config_json():
    file_path = "system_info.json"

    # Check if the file exists
    if not os.path.isfile(file_path):
        print("Looks like you dont have a config file setup for your enviornment, lets set that up for you.")

        with open(file_path, "w") as f:
            json.dump(config_template, f, indent=4)

def setup_database():
    sections_to_change = inquirer.checkbox(
        message="Select which database sections you want to edit (space to select, enter to confirm)",
        choices=["local configuration", "remote configuration"]
    ).execute()

    if "local configuration" in sections_to_change:
        print("Here is you current local definition:\n", )

def setup_backend():
    pass

def setup_frontend():
    pass

def setup_AWS():
    will_add_creds = inquirer.select(
        message="Would you like to add AWS to your system credentials",
        choices=["Yes", "No"]
    ).execute()

    if will_add_creds == "Yes":
        pass

if __name__=="__main__":
    # setup_config_json()

    if len(sys.argv) == 1: # no additional commands entered, print the usage info
        print_base_usage_info()

    if len(sys.argv) > 1:
        setup_config_json()

        if sys.argv[1] == "AWS":
            setup_AWS()
        elif sys.argv[1] == "backend":
            setup_backend()
        elif sys.argv[1] == "frontend":
            setup_frontend()
        elif sys.argv[1] == "database":
            setup_database()
        else:
            print(f"Invalid argument {sys.argv[1]} entered")