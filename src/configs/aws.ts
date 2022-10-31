export const COGNITO = {
  REGION: process.env.REACT_APP_AWS_REGION || '',
  USER_POOL_ID: process.env.REACT_APP_AWS_USER_POOL_ID || '',
  APP_CLIENT_ID: process.env.REACT_APP_AWS_APP_CLIENT_ID || '',
  ACCESS_KEY_ID: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
  SECRETE_ACCESS_KEY: process.env.REACT_APP_AWS_SECRETE_ACCESS_KEY || '',
  S3_BUCKET: process.env.REACT_APP_AWS_S3_BUCKET || ''
};
