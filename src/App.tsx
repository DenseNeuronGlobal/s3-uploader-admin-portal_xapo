import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Amplify, {Storage} from 'aws-amplify';
import Dashboard from './pages/Dashboard';
import {COGNITO} from './configs/aws';
import ProtectedRoute from './routes/ProtectedRoute';
import Signin from './pages/Login';
import ResetPassword from './pages/Forgot';
// import AWS from 'aws-sdk';

// Amplify.configure({
//   aws_project_region: COGNITO.REGION,
//   aws_cognito_region: COGNITO.REGION,
//   aws_user_pools_id: COGNITO.USER_POOL_ID,
//   aws_user_pools_web_client_id: COGNITO.APP_CLIENT_ID,
//   aws_user_files_s3_bucket: COGNITO.S3_BUCKET,
//   aws_user_files_s3_bucket_region: COGNITO.REGION,
// });

Amplify.configure({
    "aws_project_region": "eu-west-2",
    "aws_cognito_identity_pool_id": "eu-west-2:b208ddd5-e22f-4d20-8257-ced9f6c14168",
    "aws_cognito_region": "eu-west-2",
    "aws_user_pools_id": "eu-west-2_W2CN8YLTB",
    "aws_user_pools_web_client_id": "1d57rle28tabt21e49b4063iqp",
    "oauth": {},
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ],
    "aws_user_files_s3_bucket": "xapo-s3-client-uploads224232-dev",
    "aws_user_files_s3_bucket_region": "eu-west-2",
    "aws_content_delivery_bucket": "xapo-s3-client-uploads-dev",
    "aws_content_delivery_bucket_region": "eu-west-2",
    "aws_content_delivery_url": "https://d3ll6zbfabpmex.cloudfront.net",
    "aws_cloud_logic_custom": [
        {
            "name": "AdminQueries",
            "endpoint": "https://t93zgvne99.execute-api.eu-west-2.amazonaws.com/dev",
            "region": "eu-west-2"
        },
        {
            "name": "api0e794a67",
            "endpoint": "https://lzlpu143kb.execute-api.eu-west-2.amazonaws.com/dev",
            "region": "eu-west-2"
        }
    ]
});

Storage.configure({ level: 'protected' });

// AWS.config.update({region: COGNITO.REGION, accessKeyId: COGNITO.ACCESS_KEY_ID, secretAccessKey: COGNITO.SECRETE_ACCESS_KEY});

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/forgot">
          <ResetPassword />
        </Route>
        <Route path="/">
          <ProtectedRoute component={Dashboard} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
