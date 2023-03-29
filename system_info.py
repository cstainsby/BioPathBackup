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

NOTE: system_info.json is auto-generated, 
      be careful making edits to the json file directly or dependants on the information stored in this file might break
      Also be careful not to expose the information in this file, some of it may be 
      The json file SHOULD be ignored by github inside the .gitignore

NOTE: the way I'm storing this information is somewhat limited 
      right now I'm storing information in the way that we need it rather than how it might need to be used in the future
      for example, a user can have multiple access key pairs but for our needs we will only need one
"""

import json
import os
import sys
from InquirerPy import inquirer

PROJ_ROOT_PATH = os.path.dirname(os.path.abspath(__file__)) 
INFO_FILE_PATH = PROJ_ROOT_PATH + "/system_info.json"

# here is a labeled outline describing the purpose of each of the sections
config_template = {
    "CREDENTIALS": {
        "default aws cred id": None,   # each cred will be identified by account_id, default's value will be the chosen set of credentials

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
        "default port": 8000,
        "PREF_LOCAL_ENDPOINT": "http://localhost:8000",
        "PREF_REMOTE_ENDPOINT": None,
        "ALL_ENDPOINTS": [
            "http://localhost:8000"
        ]
    },

    # for storing info related to the frontend 
    "FRONTEND_INFO": {
        "default port": 3000,
        "PREF_LOCAL_ENDPOINT": "http://localhost:3000",
        "PREF_REMOTE_ENDPOINT": None,
        "ALL_ENDPOINTS": [
            "http://localhost:3000"
        ]
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

# ------------------------------------------------------------------------------------------
#       broad file functions
# ------------------------------------------------------------------------------------------
def setup_config_json():
    file_path = "system_info.json"

    # Check if the file exists
    if not os.path.isfile(file_path):
        print("Looks like you dont have a config file setup for your enviornment, lets set that up for you.")

        with open(file_path, "w") as f:
            json.dump(config_template, f, indent=4)


def read_in_info_file():
    with open(INFO_FILE_PATH, 'r') as json_file:
        data = json.load(json_file)
        return data

def write_to_info_file(json_data) -> None:
    with open(INFO_FILE_PATH, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)


# ------------------------------------------------------------------------------------------
#       print helper functions
# ------------------------------------------------------------------------------------------
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
        - creds
        - backend
        - frontend
        - database

    credentials - takes you through a prompt to edit or add to your stored credentials

    backend, frontend, and database - takes you through a prompt where to can edit 
                                      your local and remote config info for its 
                                      respective section.

    an example run from the folder which contains this file would be:
        python3 system_info.py creds
    """)

def print_setup_title(title: str, extra_msg: str = ""):

    print("---------------------------------------------")
    print(" "*4 + title)
    print("---------------------------------------------")
    if extra_msg != "":
        print(extra_msg)
        print("---------------------------------------------")
    print()


# ------------------------------------------------------------------------------------------
#       storage CRUD functions
# ------------------------------------------------------------------------------------------

#   --- credentials ---
def add_aws_credential(username: str, account_id: int, access_key_id: str, secret_key: str, password: str):
        # "{
        #   "Username": "<val>",
        #   "Account ID": "<val>",
        #   "Access key ID": "<val>",
        #   "Secret Access Key": "<val>" 
        #   "Password": "<val>"
        # }
    new_aws_cred = {
        "Username": username,
        "Account ID": str(account_id),
        "Access key ID": access_key_id,
        "Secret Access Key": secret_key,
        "Password": password
    }
    print("adding credential aws", new_aws_cred)
    add_credential("AWS", new_aws_cred)

def add_credential(cred_type: str, cred_info):
    new_cred = {
        "Type": cred_type
    }
    # .update(cred_info)

    print("adding credential", new_cred)

    data = read_in_info_file()
    data["CREDENTIAL_INFO"]["CREDENTIALS_DEF"].append(new_cred)
    write_to_info_file(data)


def update_credential(cred_type: str, username: str, account_id: int, access_key_id: str, secret_key: str, password: str):
    pass 

def delete_credential(identifier: str):
    data = read_in_info_file()
    all_credentials = data["CREDENTIAL_INFO"]["CREDENTIALS_DEF"]

    remaining_creds = []
    for cred in all_credentials:
        if cred["Type"] == "AWS" and "Account ID" != identifier:
            remaining_creds.append(cred)
    
    data["CREDENTIAL_INFO"]["CREDENTIALS_DEF"] = remaining_creds
    write_to_info_file(data)
    

def get_credential_labels():
    data = read_in_info_file()
    
    all_credentials = data["CREDENTIAL_INFO"]["CREDENTIALS_DEF"]
    cred_identifiers = []

    if len(all_credentials) > 0:
        cred_identifiers = ["({type}) {username} - {account_id}".format(
                                type=cred_dict["Type"], 
                                username=cred_dict["Username"],
                                account_id=cred_dict["Account ID"]) 
                            for cred_dict in all_credentials]

        # get aws cred headers
        if "AWS_CREDS" in all_credentials:
            aws_credentials = all_credentials["AWS_CREDS"]
            cred_identifiers += ["(aws) " + aws_cred_dict["Username"] for aws_cred_dict in aws_credentials]

    return cred_identifiers

def get_credential(cred_type: str, identifier: str):
    """Identifiers can change based on type of credential
        AWS: uses account_id"""
    
    cred_data = read_in_info_file()["CREDENTIAL_INFO"]

    return [cred_dict for cred_dict in cred_data if "Account ID" in cred_dict and cred_dict["Account ID"] == identifier][0]


#   --- backend ---
def get_backend_endpoints():
    backend_endpoints = []
    with open("system_info.json", "r") as f:
        data = json.load(f)
        backend_endpoints = data["BACKEND_INFO"]["ALL_ENDPOINTS"]
    return backend_endpoints

def add_backend_endpoint(endpoint: str):
    with open("system_info.json", "r") as f:
        data = json.load(f)

    data["BACKEND_INFO"]["ALL_ENDPOINTS"].append(endpoint)

    with open("system_info.json", 'w') as f:
        json.dump(data, f, indent=4)


# ------------------------------------------------------------------------------------------
#       setup functions
# ------------------------------------------------------------------------------------------
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

def setup_credentials():
    print_setup_title("Setup Credentials")

    
    selected_cred_option_list = inquirer.select(
        message="Listed below are your registered credentials as well as other options",
        choices=
            ["edit - " + label for label in get_credential_labels()] +
            ["delete - " + label for label in get_credential_labels()] +
            [
                "add",
                "exit"
            ]
    ).execute().split()
    # NOTE: it is probably worth fixing this at some point but if it works it works

    selected_cred_option = selected_cred_option_list[0]

    if selected_cred_option == "add":
        identifier = ""

        selected_cred_type = inquirer.select(
            message="Choose credential type to add",
            choices=["AWS"]
        ).execute()

        if selected_cred_type == "AWS":
            identifier = inquirer.text(message="Account ID: ").execute()
            add_aws_credential(
                username=inquirer.text(message="Username: ").execute(),
                account_id=identifier,
                access_key_id=inquirer.text(message="Access Key ID: ").execute(),
                secret_key=inquirer.text(message="Secret Key: ").execute(),
                password=inquirer.text(message="Password: ").execute()
            )
        
        print("\n Added Credential:\n", get_credential(selected_cred_type, identifier), "\n")

    elif selected_cred_option == "delete":
        identifier = selected_cred_option_list[-1] # identifier is placed in the back of the label list

        delete_credential(identifier)
    
    elif selected_cred_option == "edit":
        cred_type = selected_cred_option_list[2]

        # convert label to dictionary understandable key
        if cred_type == "(aws)":
            cred_type = "AWS"
        else:
            cred_type = None 
        
        # if there is a matching label, update
        if cred_type:
            selected_credential_items_to_change = inquirer.checkbox(
                message="Select what you would like to change(space to select, enter to enter)",
                choices=["username", "Account ID", "Access Key ID", "Secret Key" "Password"]
            ).execute()

            

            update_credential(
                cred_type=cred_type,
                username=inquirer.text(message="Username: ").execute(),
                account_id=inquirer.text(message="Account ID: ").execute(),
                access_key_id=inquirer.text(message="Access Key ID: ").execute(),
                secret_key=inquirer.text(message="Secret Key: ").execute(),
                password=inquirer.text(message="Password: ").execute()
            )



if __name__=="__main__":
    """Driver for script, information on how to run this script at the top of this file"""

    if len(sys.argv) == 1: # no additional commands entered, print the usage info
        print_base_usage_info()
    
    setup_config_json()

    if len(sys.argv) > 1:
        info_sec_decl = sys.argv[1].lower()

        if info_sec_decl == "creds":
            setup_credentials()
        elif info_sec_decl == "backend":
            setup_backend()
        elif info_sec_decl == "frontend":
            setup_frontend()
        elif info_sec_decl == "database":
            setup_database()
        else:
            print(f"Invalid argument {info_sec_decl} entered")