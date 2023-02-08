
# Our AWS setup 
This README will give you a general idea of how our project is setup within AWS.

## Important Links
Here is a link to [copilot installation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Copilot.html)instructions.

Link to documentation on the [copilot tool and basic AWS concepts](https://aws.github.io/copilot-cli/docs/overview/)

## Important Commands
copilot has really good explanations how to use their commands 

Run: *copilot* to get a quick explanation of where to start

The following commands I found to be super helpful when getting a nice description of whats going in each section of the AWS project
- *copilot app show*
- *copilot svc show*
- *copilot env show*
- *copilot pipeline show*


## File Overivew
Within this directory we have 
1. **copilot dir** which is an auto-generated directory for aws copilot which is a tool which will be needed for more direct AWS infrastructure work. 
1. **local_deploy.py** a deploy script which will send your docker images to ECR. **NOTE**: This is not the preffered method of uploading the containers and should only be used if you need to force changes up. 
1. **aws_credentials.csv** a file which should contain your personal aws login information.

## IAM Roles
*Identity and Access Manegment*
[Link](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) to IAM user guide. 



## Infrastructure Overview
Please read the tool and concepts documentation linked above to understand the basics before proceeding.

### Application
Within AWS, our app is called biopath. This app is a collection of services. In our case our two services will include a frontend

### Enviornment
Enviornments in copilot are areas where builds (services) can be running. For now we only have production as we don't necessarily need a test enviornment seeing as we don't yet have any users. This can be a consideration for future development once such a thing becomes necessary.

### Services
As mentioned in the Enviornment section, we will have a frontend and backend service. Both of these will be induvidually linked to their respective dockerfiles within frontend/ and backend/


## Setup 
**Important**: When creating AWS accounts, keep track of your:
1. User Name
1. Account ID
1. Access Key ID
1. Secret Access Key
1. Password
You should store this information in an *aws_credentials.csv* file within this directory.

**You need to use you own sign in info when using github copilot**
AWS has a strict policy which doesn't allow the root user to push its own infrastructure. You have to do it through a team managed role which you set up for yourself. I would recommend using the root sign in when using the online AWS console so you can ensure you have the ability to make edits. You should use your own account for everything else.


# How to navigate AWS Console 

In the Serach bar important pages you will visit frequently will be 
1. ECS
2. ECR
3. IAM 
4. Cloudformation 


### Brief Description Of Each
1. ECS contains all of our clusters, services, and task definitions that we have created. Go here to see what is currently running.
2. ECR is the repository for our dockerfiles, any containers we push up should appear here 
3. IAM, as mentioned above, this is where you manage your teams access to AWS resources.
4. Cloudformation, because we are using copilot, by default our infrastructure schema is uploaded by default. **Here you can view the our infrastructure porgress and any errors that may occur**
