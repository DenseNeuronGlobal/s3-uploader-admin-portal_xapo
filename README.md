# S3 Upload Admin Portal

## Installation instructions

Before starting make sure that you have enabled AdministrationQueries to do this:
Go to your AWS Cognito and add a new group named "Admin". Then using the following command from that project folder
```sh
amplify add auth
```
For the question "Do you want to add an admin queries API?" select Yes.
For the question "Do you want to restrict access to a specific Group" select Yes.
Select "Admin" from the list.

Now push those settings to AWS.
```sh
amplify push
```


The installation instructions assume that you have already installed the S3 Upload Portal from the same machine and have AWS Amplify Installed as well as NPM ad Yarn.

1. Download the code base
```sh
git clone https://github.com/DenseNeuronGlobal/s3-uploader-admin-portal_xapo.git
```
2. cd into the GitHub Project folder:
```sh
cd s3-uploader-admin-portal_xapo
```

3. Perform Amplify Init
```sh
amplify init
```
Adjust the Project settings so that the Build command is "yarn build" and the run/start command is "yarn start"

4. Now add hosting via amplify
```sh
amplify add hosting
```
Select  Amazon CloudFront and S3 and set the name of the bucket that you want to host the application from.

5. Create a Client ID in your AWS Cognito User Pool, and take a note of the ID Generated you will need it for the next step.

When creating the Client ID enable the following Authentication Flows:
- ALLOW_REFRESH_TOKEN_AUTH
- ALLOW_CUSTOM_AUTH
- ALLOW_USER_SRP_AUTH

6. Navigate to the file /src/configs/aws.ts, and provide the required settings for:
REGION
IDENTITY_POOL_ID
USER_POOL_ID
APP_CLIENT_ID (Set this to your client ID you generated in the previous step.)
S3_BUCKET

You can find the settins in your S3 Uploader Project under src/aws-exports.js

aws_project_region (Set your REGION to this value)
aws_cognito_identity_pool_id (Set your IDENTITY_POOL_ID to this value)
aws_user_pools_id (Set your USER_POOL_ID to this value)
aws_content_delivery_bucket (Set your S3_BUCKET to this value)

Once you have completed this. You will need to navigate to your AWS Cognito User Pool for your S3 Uploader, as created in step 5.

6. Now you may allow Amplify to push your configuration to AWS.
```sh
amplify push
```

7. Go to your AWS Cognito User Pool and add a new group named "Admin".  
Now add your administrators to this group.  

8. Finally in IAM add the following permissions to your groups IAM Role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cognito-identity:GetOpenIdTokenForDeveloperIdentity",
                "cognito-identity:LookupDeveloperIdentity",
                "cognito-identity:MergeDeveloperIdentities",
                "cognito-identity:UnlinkDeveloperIdentity"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "s3-object-lambda:*"
            ],
            "Resource": "*"
        },
                    "Sid": "CLISDKCalls",
            "Effect": "Allow",
            "Action": [
                "appsync:GetIntrospectionSchema",
                "appsync:GraphQL",
                "appsync:UpdateApiKey",
                "appsync:ListApiKeys",
                "amplify:*",
                "amplifybackend:*",
                "amplifyuibuilder:*",
                "sts:AssumeRole",
                "mobiletargeting:*",
                "cognito-idp:AdminAddUserToGroup",
                "cognito-idp:AdminCreateUser",
                "cognito-idp:CreateGroup",
                "cognito-idp:DeleteGroup",
                "cognito-idp:DeleteUser",
                "cognito-idp:ListUsers",
                "cognito-idp:AdminGetUser",
                "cognito-idp:ListUsersInGroup",
                "cognito-idp:AdminDisableUser",
                "cognito-idp:AdminRemoveUserFromGroup",
                "cognito-idp:AdminResetUserPassword",
                "cognito-idp:AdminListGroupsForUser",
                "cognito-idp:ListGroups",
                "cognito-idp:AdminListUserAuthEvents",
                "cognito-idp:AdminDeleteUser",
                "cognito-idp:AdminConfirmSignUp",
                "cognito-idp:AdminEnableUser",
                "cognito-idp:AdminUpdateUserAttributes",
                "cognito-idp:DescribeIdentityProvider",
                "cognito-idp:DescribeUserPool",
                "cognito-idp:DeleteUserPool",
                "cognito-idp:DescribeUserPoolClient",
                "cognito-idp:CreateUserPool",
                "cognito-idp:CreateUserPoolClient",
                "cognito-idp:UpdateUserPool",
                "cognito-idp:AdminSetUserPassword",
                "cognito-idp:ListUserPools",
                "cognito-idp:ListUserPoolClients",
                "cognito-idp:ListIdentityProviders",
                "cognito-idp:GetUserPoolMfaConfig",
                "cognito-identity:GetIdentityPoolRoles",
                "cognito-identity:SetIdentityPoolRoles",
                "cognito-identity:CreateIdentityPool",
                "cognito-identity:DeleteIdentityPool",
                "cognito-identity:ListIdentityPools",
                "cognito-identity:DescribeIdentityPool",
                "dynamodb:DescribeTable",
                "dynamodb:ListTables",
                "lambda:GetFunction",
                "lambda:CreateFunction",
                "lambda:AddPermission",
                "lambda:DeleteFunction",
                "lambda:DeleteLayerVersion",
                "lambda:InvokeFunction",
                "lambda:ListLayerVersions",
                "iam:PutRolePolicy",
                "iam:CreatePolicy",
                "iam:AttachRolePolicy",
                "iam:ListPolicyVersions",
                "iam:ListAttachedRolePolicies",
                "iam:CreateRole",
                "iam:PassRole",
                "iam:ListRolePolicies",
                "iam:DeleteRolePolicy",
                "iam:CreatePolicyVersion",
                "iam:DeletePolicyVersion",
                "iam:DeleteRole",
                "iam:DetachRolePolicy",
                "cloudformation:ListStacks",
                "sns:CreateSMSSandboxPhoneNumber",
                "sns:GetSMSSandboxAccountStatus",
                "sns:VerifySMSSandboxPhoneNumber",
                "sns:DeleteSMSSandboxPhoneNumber",
                "sns:ListSMSSandboxPhoneNumbers",
                "sns:ListOriginationNumbers",
                "rekognition:DescribeCollection",
                "logs:DescribeLogStreams",
                "logs:GetLogEvents",
                "lex:GetBot",
                "lex:GetBuiltinIntent",
                "lex:GetBuiltinIntents",
                "lex:GetBuiltinSlotTypes",
                "cloudformation:GetTemplateSummary",
                "codecommit:GitPull"
            ],
            "Resource": "*"
        },
               {
            "Effect": "Allow",
            "Action": [
                "cognito-identity:*",
                "cognito-idp:*",
                "cognito-sync:*",
                "iam:ListRoles",
                "iam:ListOpenIdConnectProviders",
                "iam:GetRole",
                "iam:ListSAMLProviders",
                "iam:GetSAMLProvider",
                "kinesis:ListStreams",
                "lambda:GetPolicy",
                "lambda:ListFunctions",
                "sns:GetSMSSandboxAccountStatus",
                "sns:ListPlatformApplications",
                "ses:ListIdentities",
                "ses:GetIdentityVerificationAttributes",
                "mobiletargeting:GetApps",
                "acm:ListCertificates"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:CreateServiceLinkedRole",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:AWSServiceName": [
                        "cognito-idp.amazonaws.com",
                        "email.cognito-idp.amazonaws.com"
                    ]
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:DeleteServiceLinkedRole",
                "iam:GetServiceLinkedRoleDeletionStatus"
            ],
            "Resource": [
                "arn:aws:iam::*:role/aws-service-role/cognito-idp.amazonaws.com/AWSServiceRoleForAmazonCognitoIdp*",
                "arn:aws:iam::*:role/aws-service-role/email.cognito-idp.amazonaws.com/AWSServiceRoleForAmazonCognitoIdpEmail*"
            ]
        }
    ]
}
```

9. You should not have to check your Congnito Group's, role's Trust Relationship.



10. Finally publish your Administration Portal

```sh
amplify publish
```

11. Now try to login to your Admin Portal.


To manage the modified project S3Uploader.

## Tech Stack

```aidl
- Tech stacks
  React
  Typescript
  Material UI
  Styled Components for style
  Global Project Configuration
  Prettier
  Husky
  Use Yarn instead of Npm

- Functional Logics
    Signin (using Aws Cognito)

    User Management
        List All Users (In Pagination)
        Create a New User
        Disable or Enable a User

    File Management
        Allow's listing Users files and downloading them for by Administrators
```

## Getting Started Without Docker

#### Install dependencies

run `yarn` in the root directory

#### Change configuration

`src/configs/aws.ts`

You can get the required info from you user pool. If you don't know how to setup aws cognito then please [read this first](https://dev.to/mubbashir10/implement-auth-in-react-easily-using-aws-cognito-5bhi)

#### Create an environment file `.env` from `.env.example`

`cp .env.example .env`

#### Start the app

run `yarn start` in the root directory

#### Build the app (for production)

run `yarn build` in the root directory

## Getting Started With Docker

### Build the Docker Image
`docker build -t denseneuron/react-aws .`

### Run the app
`docker run -d -p 80:80 denseneuron/react-aws`

## About AWS Cognito

AWS Cognito is a managed authentication service by AWS. To use it's APIs we use [AWS Amplify SDK](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js#create-authentication-service). AWS Amplify is the AWS counterpart of Google's Firebase.
