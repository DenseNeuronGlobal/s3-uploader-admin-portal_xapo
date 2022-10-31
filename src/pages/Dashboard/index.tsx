import React from "react";
import { Toast } from "./../../utils/notifications";
import { Auth } from "aws-amplify";
import { Route, Switch, useHistory } from "react-router-dom";
import Users from "./Users";
import Files from "./Files";
import {styled} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import AddUser from "./AddUser";

const Page: any = styled(Box)({
  flex: 1,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
});

const Dashboard: React.FC = () => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      Toast("Success!!", "Logged out successfully!", "success");
      history.push("/signin");
    } catch (error) {
      Toast("Error!!", error.message, "danger");
    }
  };

  return (
    <Page>
      <Switch>
        <Route path="/users/new">
          <AddUser />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/files">
          <Files />
        </Route>
      </Switch>
    </Page>
  );
};

export default Dashboard;
