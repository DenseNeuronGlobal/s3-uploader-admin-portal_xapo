# S3 Upload Admin Portal

## Installation instructions


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


5. Navigate to the file /src/configs/aws.ts, and provide the required settings for:
REGION
IDENTITY_POOL_ID
USER_POOL_ID
APP_CLIENT_ID (Set this to your client ID you generated in the previous step.)
S3_BUCKET
CUSTOM_LOGIC.endpoint
CUSTOM_LOGIC.eu-central-1

You can find the settins in your S3 Uploader Project under src/aws-exports.js

aws_project_region (Set your REGION to this value)
aws_cognito_identity_pool_id (Set your IDENTITY_POOL_ID to this value)
aws_user_pools_id (Set your USER_POOL_ID to this value)
aws_userfiles_s3_bucket (Set your S3_BUCKET to this value)
aws_cloud_logic_custom.endpoint (Set your CUSTOM_LOGIC.endpoint to this value)
aws_cloud_logic_custom.eu-central-1 (Set your CUSTOM_LOGIC.eu-central-1
 to this value)

Once you have completed this. You will need to navigate to your AWS Cognito User Pool for your S3 Uploader, as created in step 5.

6. Now you may install of the components required to build the JavaScript application.
```sh
yarn install
```

7. Now you may allow Amplify to push your configuration to AWS.
```sh
amplify push
```

8. Finally publish your Administration Portal

```sh
amplify publish
```

9. Now try to login to your Admin Portal, using the URL provided in the terminal.




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
