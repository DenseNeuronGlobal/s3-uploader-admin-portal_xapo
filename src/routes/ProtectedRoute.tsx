import React, {useState} from 'react';
import {Auth} from 'aws-amplify';
import {Route, Redirect} from 'react-router-dom';
import Layout from '../components/Layout';

interface Props {
  component: React.FC;
}

const ProtectedRoute: React.FC<Props> = ({component}) => {
  const [isAuthenticated, setLoggedIn] = React.useState<boolean>(true);
  const [user, setUser] = useState();

  React.useEffect(() => {
    (async () => {
      let user = null;

      try {
        user = await Auth.currentAuthenticatedUser();
        if (user) {
          setLoggedIn(true);
          setUser({
            ...user,
            ...user.attributes
          });
        } else {
          setLoggedIn(false);
        }
      } catch (e) {
        setLoggedIn(false);
      }
    })();
  }, []);

  return <Route render={props => (isAuthenticated ? <Layout user={user}>{React.createElement(component)}</Layout> : <Redirect to="/signin" />)} />;
};

export default ProtectedRoute;
