export const COGNITO = {
  REGION: process.env.REACT_APP_AWS_REGION || '',
  USER_POOL_ID: process.env.REACT_APP_AWS_USER_POOL_ID || '',
  IDENTITY_POOL_ID: process.env.REACT_APP_AWS_IDENTITY_POOL_ID || '',
  APP_CLIENT_ID: process.env.REACT_APP_AWS_APP_CLIENT_ID || '',
  S3_BUCKET: process.env.REACT_APP_AWS_S3_BUCKET || '',
  CUSTOM_LOGIC: process.env.REACT_APP_AWS_CUSTOM_LOGIC ? JSON.parse(process.env.REACT_APP_AWS_CUSTOM_LOGIC) : [],
};
