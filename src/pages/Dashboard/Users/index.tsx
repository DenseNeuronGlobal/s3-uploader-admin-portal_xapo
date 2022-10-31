import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import AWS from "aws-sdk";
import { Button, styled } from "@material-ui/core";
import { AttributeType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import { COGNITO } from "../../../configs/aws";
import CommonTable from "../../../components/Table";
import { Toast } from "../../../utils/notifications";
import { IUserAttributes, IUserSimple } from "../../../interfaces/user.interface";

const AddButton: any = styled(Button)({
  marginLeft: 'auto',
  marginBottom: '10px',
});

const Users = () => {
  const [users, setUsers] = useState<IUserSimple[]>([]);

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
      render: ((row: IUserSimple) => row?.UserCreateDate?.toDateString()),
    }
  ];

  useEffect(() => {
    var params = {
      UserPoolId: COGNITO.USER_POOL_ID,
    };

    const cognito = new AWS.CognitoIdentityServiceProvider();
    cognito.listUsers(params, (err, data) => {
      if (err) {
        Toast("Error!!", err.message || 'Error', "danger");
        return;
      }
      else {
        if (data.Users) {
          setUsers(data.Users.map((user) => {
            const attri = user.Attributes && user.Attributes.reduce((attributes: IUserAttributes, attribute: AttributeType) => (
              {
                ...attributes,
                [attribute.Name]: attribute.Value,
              }
            ), {});
            return {
              ...user,
              ...attri,
            } as IUserSimple;
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
        onRowClick={(row) => history.push(`/users/${row.Username}`)}
      />
    </>
  );
};

export default Users;
