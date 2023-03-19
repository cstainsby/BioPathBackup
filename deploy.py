import subprocess
from InquirerPy import inquirer
from pygit2 import Repository

# define which branchs are allowed to push to AWS
AWS_ALLOWABLE_BRANCHES = [
    "main",
    "dev",
    "cole_aws_push"
]

def deploy_frontend():
    # throw another validation message just to be sure that the dev wants to deploy
        confirm_AWS = None 
        while confirm_AWS != "deploy" or confirm_AWS != "exit":
            confirm_AWS = inquirer.text(
                message="""ARE YOU SURE, This will replace the currently running frontend version on AWS. \n
                        Type 'deploy' to push frontend to aws or 'exit' to escape""",
                validate=lambda result: result == "deploy",
                invalid_message="Unexpected input try again or type 'exit' to escape"
            ).execute()
        
        if confirm_AWS and confirm_AWS == "deploy":
            subprocess.run(["copilot", "svc", "deploy"])