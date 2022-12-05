import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Amplify, {Storage, Auth} from 'aws-amplify';
import Dashboard from './pages/Dashboard';
import {COGNITO} from './configs/aws';
import ProtectedRoute from './routes/ProtectedRoute';
import Signin from './pages/Login';
import ResetPassword from './pages/Forgot';

Amplify.configure({
  aws_project_region: COGNITO.REGION,
  aws_cognito_identity_pool_id: COGNITO.IDENTITY_POOL_ID,
  aws_cognito_region: COGNITO.REGION,
  aws_user_pools_id: COGNITO.USER_POOL_ID,
  aws_user_pools_web_client_id: COGNITO.APP_CLIENT_ID,
  aws_user_files_s3_bucket: COGNITO.S3_BUCKET,
  aws_user_files_s3_bucket_region: COGNITO.REGION,
  aws_cloud_logic_custom: COGNITO.CUSTOM_LOGIC
});

Storage.configure({ level: 'protected' });

Auth.configure({ signUpVerificationMethod: 'link' });

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
