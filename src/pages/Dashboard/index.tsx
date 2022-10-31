import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { Box, styled } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { Toast } from "../../utils/notifications";
import Users from "./Users";
import Files from "./Files";
import UserDetail from "./UserDetail";

const Page: any = styled(Box)({
  flex: 1,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
});

const Dashboard: React.FC = () => {
  return (
    <Page>
      <Switch>
        <Route path="/users/new">
          <UserDetail />
        </Route>
        <Route path="/users/:username">
          <UserDetail />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/files">
          <Files />
        </Route>
        <Route
          path="*"
          render={() => <Redirect to="/users" />}
        />
      </Switch>
    </Page>
  );
};

export default Dashboard;
