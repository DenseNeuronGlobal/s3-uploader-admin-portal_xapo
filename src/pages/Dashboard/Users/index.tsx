import React, {useEffect, useState} from 'react';
import {COGNITO} from "../../../configs/aws";
import AWS from "aws-sdk";
import {AttributeType} from "aws-sdk/clients/cognitoidentityserviceprovider";
import CommonTable from "../../../components/Table";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { styled } from "@material-ui/core/styles";

const AddButton: any = styled(Button)({
  marginLeft: 'auto',
  marginBottom: '10px',
});

const Users = () => {
  const [users, setUsers] = useState();

  const history = useHistory();

  const columns = [
    {
      title: 'Name',
      key: 'Username',
    },
    {
      title: 'Email',
      key: 'email',
    },
    {
      title: 'Email verified',
      key: 'email_verified',
    },
    {
      title: 'Enabled',
      key: 'Enabled',
    },
    {
      title: 'Created at',
      key: 'UserCreateDate',
      render: ((row: any) => row?.UserCreateDate?.toDateString()),
    }
  ];

  useEffect(() => {
    var params = {
      UserPoolId: COGNITO.USER_POOL_ID,
    };

    const cognito = new AWS.CognitoIdentityServiceProvider();
    cognito.listUsers(params, (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        if (data.Users) {
          setUsers(data.Users.map((user) => {
            const attri = user.Attributes && user.Attributes.reduce((attributes: { [key: string]: any }, attribute: AttributeType) => (
              {
                ...attributes,
                [attribute.Name]: attribute.Value,
              }
            ), {});
            return {
              ...user,
              ...attri,
            };
          }));
        }
      }
    })
  }, []);

  return (
    <>
      <AddButton color="primary" variant="outlined" onClick={() => history.push('/users/new')}>
        Add User
      </AddButton>
      <CommonTable
        columns={columns}
        tableData={users}
      />
    </>
  );
};

export default Users;
