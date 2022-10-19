"""This script file will be used for deploying to AWS while our github actions are down
    
  To run this file: python3 local_deploy.py <options>
  
  Options include flags for what you want to be run:
    --images-to-ecr 
        will build, tag and push the projects images to ECR
    --deploy-infra 
        will deploy the AWS infrastructure stacks to AWS
    
  NOTE: The default run with no flags will run everything, if you include one flag
        only the specified job will be run"""


import os
import sys

# repository information 
# get updated info by command ""
# current info
#     "repository": {
#         "repositoryArn": "arn:aws:ecr:us-west-2:219085571562:repository/biopath-repo",
#         "registryId": "219085571562",
#         "repositoryName": "biopath-repo",
#         "repositoryUri": "219085571562.dkr.ecr.us-west-2.amazonaws.com/biopath-repo",
#         "createdAt": "2022-10-18T13:34:25-07:00",
#         "imageTagMutability": "MUTABLE",
#         "imageScanningConfiguration": {
#             "scanOnPush": false
#         },
#         "encryptionConfiguration": {
#             "encryptionType": "AES256"
#         }
#     }


# constants
REGION_NAME = "us-west-2"
ECR_REPO_URI = "219085571562.dkr.ecr.us-west-2.amazonaws.com/biopath-repo"
BACKEND_IMG_NAME = "biopath_backend"
BACKEND_TAG = "backend_latest" # TODO: change how we are doing tag versioning
FRONTEND_IMG_NAME = "biopath_frontend"
FRONTEND_TAG = "frontend_latest"

# file paths

#TODO: check if path to backend/frontend exist and can be reached
#TODO: path better
BACKEND_PATH = os.path.join("../", "../", "backend/")
FRONTEND_PATH = os.path.join("../", "../", "frontend/")
INFRA_PATH = os.path.join("../", "infrastructure/")

# credentials for deployment
# import credentials file from credentials_<name>.txt

AWS_ACCT_ID = 0

def console_job(job_title="", command="", desc=""):
  print("-----------------------------------------------------")
  print("     " + job_title)
  print("-----------------------------------------------------")

  os.system(command)

  if desc != "":
    print(desc)

  print("-----------------------done--------------------------", end="\n\n")




def login_to_aws():
  # login to AWS
  console_job("Logging Into AWS",
              f"""aws ecr get-login-password --region {REGION_NAME} \
                | docker login \
                  --username AWS \
                  --password-stdin {AWS_ACCT_ID}.dkr.ecr.{REGION_NAME}.amazonaws.com""",
              "Using information fielded from Credentials.txt, Logging you into AWS console")


def images_to_ecr():
  # build the frontend and backend images
  console_job(
    "Building Frontend Docker Image", 
    f"docker build -t {FRONTEND_IMG_NAME}:{FRONTEND_TAG} ../../frontend/"
  )
  console_job(
    "Building Backend Docker Image", 
    f"docker build -t {BACKEND_IMG_NAME}:{BACKEND_TAG} ../../backend/"
  )

  # tag the images 
  console_job(
    "Tagging Frontend Image",
    f"docker tag {FRONTEND_IMG_NAME}:{FRONTEND_TAG} {ECR_REPO_URI}:{FRONTEND_TAG}"
  )
  console_job( 
    "Tagging Backend Image",
    f"docker tag {BACKEND_IMG_NAME}:{BACKEND_TAG} {ECR_REPO_URI}:{BACKEND_TAG}"
  )

  # push the images to ECR
  console_job(
    "Push Frontend Image to ECR",
    f"docker push {ECR_REPO_URI}:{FRONTEND_TAG}"
  )
  console_job(
    "Push Backend Image to ECR",
    f"docker push {ECR_REPO_URI}:{BACKEND_TAG}"
  )

  #TODO: clean up locally built images
  console_job(
    "Clean up Locally Built Images",
    f"docker rmi {FRONTEND_TAG} {BACKEND_TAG}"
  )

def deploy_aws_infrastructure():
  # deploy VPC stack to AWS
  console_job(
    "Deploy VPC Stack to Console",
    f"aws cloudformation create-stack --stack-name vpc --template-body file://{INFRA_PATH}VPC.yaml"
  )

  # deploy the credentials (IAM-Roles) stack
  console_job(
    "Deploy IAM Roles Stack",
    f"aws cloudformation create-stack --stack-name iam --template-body file://{INFRA_PATH}IAM-Roles.yaml --capabilities CAPABILITY_IAM"
  )

  # deploy the cluster
  console_job(
    "Deploy Cluster Stack",
    f"aws cloudformation create-stack --stack-name cluster --template-body file://{INFRA_PATH}Cluster.yaml"
  )

  # deploy the container stack
  console_job(
    "Deploy Container Stack",
    f"aws cloudformation create-stack --stack-name containers --template-body file://{INFRA_PATH}Containers.yaml"
  )


def main():
  flags = []

  if len(sys.argv) - 1 > 0:
    # there are flags that need to be handled
    flags = sys.argv[1:]

  #TODO: might need to change where this is placed depending on job, for now everything requires that you be signed in
  login_to_aws()
  

  for flag in flags:
    if flag == "--images-to-ecr":
      images_to_ecr()
    elif flag == "--deploy-infra":
      deploy_aws_infrastructure()
    else:
      print("Error: unregcognized flag {}".format(flag))
      return -1



if __name__ == "__main__":
  main()