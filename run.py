# ------------------------------------------------------------------------------------
# NAME: run.py
# DESC: The purpose of this file is to create a simple interface for running 
#       any configuration of the file 
# Motivation:
#   While working on this project, we have found it a lot more convenient to 
#   run the project in a multitude of ways 
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
from InquirerPy import inquirer
from pygit2 import Repository


PROJ_ROOT_PATH = os.getcwd()

# define which branchs are allowed to push to AWS
AWS_ALLOWABLE_BRANCHES = [
  "main",
  "dev",
  "cole_aws_push"
]

def parse_yes_or_no(input: str):
  """parses a string for a (y/N) and returns a boolean, can return None for bad input"""
  if len(input) > 0:
    if input[0].lower() == 'y':
      return True 
    elif input[0] == 'n':
      return False
  return None


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
      choices=["NPM", "docker"],
    ).execute()
    frontend_package["options"]["type"] = local_run_type
  elif run_loc == "AWS":
    aws_push_confirm = inquirer.confirm(
      message="Are you sure you want to push to AWS, this will replace the current images stored within ECR"
    ).execute()

    # if aws_push_confirm:
    #   os.system(PROJ_ROOT_PATH + "")



def run_setup(setup_package: dict):
  return

      

def run():
  # configure frontend
  print()
  print("-------------------------------------------")
  run_frontend = parse_yes_or_no(input("do you want to run the frontend(y/N):"))
  if run_frontend: setup_frontend()


  # configure backend
  print()
  print("-------------------------------------------")
  run_backend = parse_yes_or_no(input("do you want to run the backend(y/N):"))


  # configure database

  pass 

if __name__ == "__main__":
    run()