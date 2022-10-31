import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import AWS from 'aws-sdk';
import {Box, Button, styled} from '@material-ui/core';
import {AttributeType} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {COGNITO} from '../../../configs/aws';
import CommonTable from '../../../components/Table';
import {Toast} from '../../../utils/notifications';
import {IUserAttributes, IUserSimple} from '../../../interfaces/user.interface';
import CommonBreadCrumb from '../../../components/BreadCrumbs';
import {IPath} from '../../../interfaces/global.interface';

const AddButton: any = styled(Button)({
  marginLeft: '10px',
});

const RemoveButton: any = styled(Button)({
  marginLeft: '10px',
  color: '#d32f2f',
});

const ActionWrapper: any = styled(Box)({
  marginLeft: 'auto',
  marginBottom: '10px'
});

const defaultPath: IPath = {
  title: 'User List',
  to: '/users'
};

const UserNameCell: any = styled(Box)({
  marginLeft: 'auto',
  marginBottom: '10px',
  cursor: 'pointer',
  color: '#0073bb',
  fontSize: '14px',
  lineHeight: '22px',
  '&:hover': {
    color: '#0073bb',
    textDecoration: 'underline'
  }
});

const Users = () => {
  const [users, setUsers] = useState<IUserSimple[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const history = useHistory();

  const columns = [
    {
      title: 'Name',
      key: 'Username',
      render: (row: IUserSimple) => (
        <UserNameCell onClick={() => onRowClick(row.Username)}>
          {row.Username}
        </UserNameCell>
      )
    },
    {
      title: 'Enabled',
      key: 'Enabled'
    },
    {
      title: 'Account status',
      key: 'UserStatus',
    },
    {
      title: 'Email',
      key: 'email'
    },
    {
      title: 'Email verified',
      key: 'email_verified'
    },
    {
      title: 'Phone number verified',
      key: 'email_verified'
    },
    {
      title: 'Updated',
      key: ' UserLastModifiedDate',
      render: (row: IUserSimple) => row?.UserLastModifiedDate?.toDateString()
    },
    {
      title: 'Created',
      key: 'UserCreateDate',
      render: (row: IUserSimple) => row?.UserCreateDate?.toDateString()
    }
  ];

  useEffect(() => {

    let params = {
      UserPoolId: COGNITO.USER_POOL_ID
    };

    const cognito = new AWS.CognitoIdentityServiceProvider();
    cognito.listUsers(params, (err, data) => {
      if (err) {
        Toast('Error!!', err.message || 'Error', 'danger');
        return;
      } else {
        if (data.Users) {
          setUsers(
            data.Users.map(user => {
              const attri =
                user.Attributes &&
                user.Attributes.reduce(
                  (attributes: IUserAttributes, attribute: AttributeType) => ({
                    ...attributes,
                    [attribute.Name]: attribute.Value
                  }),
                  {}
                );
              return {
                ...user,
                ...attri
              } as IUserSimple;
            })
          );
        }
      }
    });
  }, []);

  const handleDeleteObjects = () => {

  };

  const onRowClick = (row: string): void => {
    history.push(`users/${row}`);
  };

  return (
    <>
      <CommonBreadCrumb paths={[defaultPath]} />
      <ActionWrapper>
        <RemoveButton color="inherit" variant="outlined" disabled={selectedRows.length === 0} onClick={handleDeleteObjects}>
          Delete
        </RemoveButton>
        <AddButton color="primary" variant="outlined" onClick={() => history.push('/users/new')}>
          Add User
        </AddButton>
      </ActionWrapper>
      <CommonTable
        showCheckBoxSelection
        columns={columns}
        tableData={users}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
};

export default Users;
