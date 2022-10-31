import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Amplify from "aws-amplify";
import Dashboard from "./pages/Dashboard";
import { COGNITO } from "./configs/aws";
import ProtectedRoute from "./routes/ProtectedRoute";
import Signin from "./pages/Login";
import Layout from "./components/Layout";

Amplify.configure({
  aws_cognito_region: COGNITO.REGION,
  aws_user_pools_id: COGNITO.USER_POOL_ID,
  aws_user_pools_web_client_id: COGNITO.APP_CLIENT_ID,
});

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/">
          <ProtectedRoute component={Dashboard} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
