# Denseneuron Test Project

This is the purpose of evaluating skills of React and AWS experiences.

## Requirements of Test

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
            Need to create a folder with the username in S3 bucket
            Delete any User (Individual Deletion, Bulk Deletion
            Need to delete the S3 bucket folder which has the same name as username of the selected User
        Edit User
            Need to rename the S3 bucket folder name whenever renaming the selected user.
            UserName field should be unique, so there should be validation to check unique of username

    File Management
        List Folders of S3 bucket
        Go to folder details page
        List Files under selected Folder
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
