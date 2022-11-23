export const COGNITO = {
  REGION: process.env.REACT_APP_AWS_REGION || 'eu-west-2',
  USER_POOL_ID: process.env.REACT_APP_AWS_USER_POOL_ID || 'eu-west-2_WF3U6P6RL',
  IDENTITY_POOL_ID: process.env.REACT_APP_AWS_IDENTITY_POOL_ID || 'eu-west-2:99b19084-0ff8-4230-b3cf-f78424afed50',
  APP_CLIENT_ID: process.env.REACT_APP_AWS_APP_CLIENT_ID || '578hpjfu7qp6atv2ctn453c178',
  S3_BUCKET: process.env.REACT_APP_AWS_S3_BUCKET || 'finaltest71325-dev',
  CUSTOM_LOGIC: process.env.REACT_APP_AWS_CUSTOM_LOGIC ? JSON.parse(process.env.REACT_APP_AWS_CUSTOM_LOGIC) : [
        {
            "name": "AdminQueries",
            "endpoint": "https://ax3ml60zwe.execute-api.eu-west-2.amazonaws.com/dev",
            "region": "eu-west-2"
        }
    ],
};
