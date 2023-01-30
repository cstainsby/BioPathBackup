
# Our AWS setup 
This README will give you a general idea of how our project is setup within AWS.

## Important Links
Here is a link to [copilot installation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Copilot.html)instructions.

Link to documentation on the [copilot tool and basic AWS concepts](https://aws.github.io/copilot-cli/docs/overview/)

## File Overivew
Within this directory we have 
1. **copilot dir** which is an auto-generated directory for aws copilot which is a tool which will be needed for more direct AWS infrastructure work. 
1. **local_deploy.py** a deploy script which will send your docker images to ECR. **NOTE**: This is not the preffered method of uploading the containers and should only be used if you need to force changes up. 
1. **aws_credentials.csv** a file which should contain your personal aws login information.

## IAM Roles


## Infrastructure Overview
Please read the tool and concepts documentation linked above to understand the basics before proceeding.

### Application
Within AWS, our app is called biopath. This app is a collection of services. In our case our two services will include a frontend

### Enviornment
Enviornments in copilot are areas where builds (services) can be running. For now we only have production as we don't necessarily need a test enviornment seeing as we don't yet have any users. This can be a consideration for future development once such a thing becomes necessary.

### Services
As mentioned in the Enviornment section, we will have a frontend and backend service. Both of these will be induvidually linked to their respective dockerfiles within frontend/ and backend/

## CI/CD Pipeline

## Setup 
**Important**: When creating AWS accounts, keep track of your:
1. User Name
1. Account ID
1. Access Key ID
1. Secret Access Key
1. Password
You should store this information in an *aws_credentials.csv* file within this directory.


