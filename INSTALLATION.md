# Installation Project


## Prerequisites
- Clone and setup `s3uploader` app with amplify env(check `https://github.com/DenseNeuronGlobal/s3-uploader-ui_xapo.git`)
- Go to "s3-uploader-ui_xapo/src/aws-exports.js" on the Cloud9 server
- Copy content of this aws-exports.js

## Clone project
`git clone https://github.com/DenseNeuronGlobal/s3-uploader-admin-portal_xapo.git`

## Install dependencies
- Go to the project root, `cd s3-uploader-admin-portal`
- `npm install` to install all dependencies

## Setup Amplify Environment
`amplify init`

Then it will ask you:
`? Enter a name for the project: `, You can type `s3uploader-admin-portal`

Then it will display the project information as like
```
Project information
| Name: s3admin
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: react
| Source Directory Path: src
| Distribution Directory Path: build
| Build Command: npm run-script build
| Start Command: npm run-script start
```

Then it will ask `? Initialize the project with the above configuration?`
`Y` - Agree
`n` - Disagree

Usually we can go with this default configuration


As next it will ask to choose the authentication method
```
Using default provider  awscloudformation
? Select the authentication method you want to use: (Use arrow keys)
❯ AWS profile 
  AWS access keys 
```

We can choose AWS profile or AWS access keys
We prefer to go with `AWS profile`.

If we go with the option of 

## Add hosting of Amplify to App
`amplify hosting add`

## Using same environment for Auth, Storage, etc
- Create `.env` file from `.env.example`
- Open `aws-export.js` file of s3uploader portal app
- Open `.env` file of admin portal app
- Write down the values under `.env`
  - `REACT_APP_AWS_REGION: ${aws_project_region of aws-export.js}`
  - `REACT_APP_AWS_USER_POOL_ID: ${aws_user_pools_id of aws-export.js}`
  - `REACT_APP_AWS_IDENTITY_POOL_ID: ${aws_cognito_identity_pool_id of aws-export.js}`
  - `REACT_APP_AWS_APP_CLIENT_ID: ${aws_cognito_identity_pool_id of aws-export.js}`
  - `REACT_APP_AWS_S3_BUCKET: ${aws_user_files_s3_bucket of aws-export.js}`
  - `REACT_APP_AWS_CUSTOM_LOGIC: ${aws_cloud_logic_custom of aws-export.js}`
- After that, please run `npm run build`

## Publish
`amplify publish`
