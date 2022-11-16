import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Auth, API} from 'aws-amplify';
import {Box, Button, styled} from '@material-ui/core';
import CommonTable from '../../../components/Table';
import {Toast} from '../../../utils/notifications';
import {IUserAttributes, IUserSimple, IUserResponse, IAttribute} from '../../../interfaces/user.interface';
import CommonBreadCrumb from '../../../components/BreadCrumbs';
import {IPath, IRow} from '../../../interfaces/global.interface';
import {Add, DeleteOutline} from "@material-ui/icons";
import SearchField from "../../../components/Search";
import {useInput} from "../../../utils/forms";

const AddButton: any = styled(Button)({
  marginLeft: '10px',
});

const RemoveButton: any = styled(Button)({
  marginLeft: '10px',
});

const ActionWrapper: any = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px'
});

const UserNameCell: any = styled(Box)({
  marginLeft: 'auto',
  marginBottom: '10px',
  cursor: 'pointer',
  color: '#783326',
  fontSize: '14px',
  lineHeight: '22px',
  '&:hover': {
    color: '#783326',
    textDecoration: 'underline'
  }
});

const defaultPath: IPath = {
  title: 'User List',
  to: '/users'
};

const Users = () => {
  const [users, setUsers] = useState<IUserSimple[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const {value: search, bind: bindSearch} = useInput('');
  const history = useHistory();
  const columns = [
    {
      title: 'Id',
      key: 'custom:identityId',
      render: (row: IRow) => row['custom:identityId'] || '-'
    },
    {
      title: 'Name',
      key: 'Username',
      render: (row: IRow) => (
        <UserNameCell onClick={() => onRowClick(row.Username as string)}>
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
      render: (row: IRow) => row.UserLastModifiedDate ? new Date(row.UserLastModifiedDate).toDateString() : '-'
    },
    {
      title: 'Created',
      key: 'UserCreateDate',
      render: (row: IRow) => row.UserLastModifiedDate ? new Date(row.UserCreateDate).toDateString() : '-'
    }
  ];

  const fetchUsers = async (searchValue: string = '') => {
    const apiName = 'AdminQueries';
    const path = '/listUsers';
    const myInit = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    
    try {
      const data = await API.get(apiName, path, myInit);
      setUsers(
        data.Users.map((user: IUserResponse) => {
          const attri =
              user.Attributes &&
              user.Attributes.reduce(
                  (attributes: IUserAttributes, attribute: IAttribute) => ({
                    ...attributes,
                    [attribute.Name]: attribute.Value
                  }),
                  {}
              );
          return {
            ...user,
            ...attri
          } as IUserSimple;
        }).filter((user: IUserSimple) => user.Username.startsWith(searchValue))
      );
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
  };

  useEffect(() => {
    if (search) {
      fetchUsers(search);
    } else {
      fetchUsers();
    }
  }, [search]);

  const handleDeleteUsers = () => {
    // todo: to be implemented
  };

  const onRowClick = (row: string): void => {
    history.push(`users/${row}`);
  };

  return (
    <>
      <CommonBreadCrumb paths={[defaultPath]} />
      <ActionWrapper>
        <Box>
          <SearchField placeholder={"Search Users"} {...bindSearch} />
        </Box>
        <Box>
          <RemoveButton color="inherit" variant="outlined" size={"medium"} disabled={selectedRows.length === 0} onClick={handleDeleteUsers} className={"amplify-button--error"}>
            <DeleteOutline fontSize={"small"} />
            Disable
          </RemoveButton>
          <AddButton color="primary" variant="outlined" size={"medium"} onClick={() => history.push('/users/new')} className={"amplify-button"}>
            <Add fontSize={"small"} />
            Add User
          </AddButton>
        </Box>
      </ActionWrapper>
      <CommonTable
        showCheckBoxSelection
        rowKey="email"
        tableColumns={columns}
        tableData={users}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
};

export default Users;
