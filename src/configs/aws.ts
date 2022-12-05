export const COGNITO = {
  REGION: process.env.REACT_APP_AWS_REGION || 'eu-central-1',
  USER_POOL_ID: process.env.REACT_APP_AWS_USER_POOL_ID || 'eu-central-1_jDRTQjzF8',
  IDENTITY_POOL_ID: process.env.REACT_APP_AWS_IDENTITY_POOL_ID || 'eu-central-1:a95885ad-4f0e-46fc-b881-4d15fe76897f',
  APP_CLIENT_ID: process.env.REACT_APP_AWS_APP_CLIENT_ID || '2k0j37ugeftb0fk72iqjako13f',
  S3_BUCKET: process.env.REACT_APP_AWS_S3_BUCKET || 'devs3uploaderuixapoa3da9867963f4fabb4baaeb83c58191928-dev',
  CUSTOM_LOGIC: process.env.REACT_APP_AWS_CUSTOM_LOGIC ? JSON.parse(process.env.REACT_APP_AWS_CUSTOM_LOGIC) : [
        {
            "name": "AdminQueries",
            "endpoint": "https://vzcwk1il1a.execute-api.eu-central-1.amazonaws.com/dev",
            "region": "eu-central-1"
        }
    ],
  ALLOW_ADD_TO_GROUP: process.env.REACT_APP_AWS_ALLOW_ADD_TO_GROUP !== undefined ? process.env.REACT_APP_AWS_ALLOW_ADD_TO_GROUP : true,
  DEFAULT_USER_GROUP: process.env.REACT_APP_AWS_DEFAULT_USER_GROUP || "Admin"
};
