# Installation Project

## Clone project
`git clone https://github.com/DenseNeuronGlobal/s3-uploader-admin-portal_xapo.git`

## Prerequisites
- `s3uploader` app (check `https://github.com/DenseNeuronGlobal/s3-uploader-ui_xapo.git`)
- Create a new Cloud9 server
- Follow up the url to setup and install dependencies
  https://aws.amazon.com/blogs/storage/allowing-external-users-to-securely-and-directly-upload-files-to-amazon-s3/

## Create a New app under AWS Amplify
https://prnt.sc/cWHVCoUmO6wn
On the top right corner,  create a new app and selecte backend

## Install dependencies
`npm install`

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

Linking with `s3uploader` app

## Using same environment for Auth, Storage, etc
- Create `.env` file from `.env.example`
- Add `aws-exports` variables from `s3uploader` app in created `.env` file

## Publish
`amplify publish`