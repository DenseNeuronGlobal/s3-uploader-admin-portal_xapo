import React, {useEffect, useState, useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import {Auth, API} from 'aws-amplify';
import {Box, Button, styled} from '@material-ui/core';
import CommonTable from '../../../components/Table';
import {Toast} from '../../../utils/notifications';
import {IUserAttributes, IUserSimple, IUsersResponse, IAttribute} from '../../../interfaces/user.interface';
import CommonBreadCrumb from '../../../components/BreadCrumbs';
import {IPath, IRow} from '../../../interfaces/global.interface';
import {Add, DeleteOutline, DoneOutlined} from "@material-ui/icons";
import SearchField from "../../../components/Search";
import {useInput} from "../../../utils/forms";

const ActionButton: any = styled(Button)({
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

const apiName: string = 'AdminQueries';
const rowKey: string = "Username";

const Users = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUserSimple[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const selectedEnabledUsers: string[] = useMemo(() => {
    return users
      .filter((user: IUserSimple) => user.Enabled && selectedRows.includes(user.Username))
      .map((user: IUserSimple) => user.Username);
  }, [users, selectedRows]);
  const selectedDisabledUsers: string[] = useMemo(() => {
    return users
      .filter((user: IUserSimple) => !user.Enabled && selectedRows.includes(user.Username))
      .map((user: IUserSimple) => user.Username);
  }, [users, selectedRows]);
  const {value: search, bind: bindSearch} = useInput('');
  const history = useHistory();
  const columns = [
    {
      title: 'Id',
      key: 'custom:identityId',
      render: (row: IRow) => row['custom:identityId'] || '-'
    },
    {
      title: 'Email',
      key: 'Username',
      render: (row: IRow) => (
        <UserNameCell onClick={() => onRowClick(row)}>
          {row.Username}
        </UserNameCell>
      )
    },
    {
      title: 'Name',
      key: 'name',
      render: (row: IRow) => row['name'] || '-'
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
    const path: string = '/listUsers';
    const myInit = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
    
    try {
      const data = await API.get(apiName, path, myInit);
      setUsers(
        data.Users.map((user: IUsersResponse) => {
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
  
  const updateUser = async (username: string, path: string, authorization: string): Promise<void> => {
    const myInit = {
      body: {
        username
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    };
    await API.post(apiName, path, myInit);
  };
  
  const handleEnableUsers = async (): Promise<void> => {
    setLoading(true);
    const path: string = '/enableUser';
    try {
      const authorization: string = (await Auth.currentSession()).getAccessToken().getJwtToken();
      await Promise.all(
        selectedDisabledUsers.map(async (username) => {
          await updateUser(username, path, authorization);
        })
      );
      Toast('Success!!', `User${selectedRows.length > 1 ? 's' : ''} enabled successfully`, 'success');
      setSelectedRows([]);
      fetchUsers(search);
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
    setLoading(false);
  };

  const handleDisableUsers = async (): Promise<void> => {
    setLoading(true);
    const path: string = '/disableUser';
    try {
      const authorization: string = (await Auth.currentSession()).getAccessToken().getJwtToken();
      await Promise.all(
        selectedEnabledUsers.map(async (username) => {
          await updateUser(username, path, authorization);
        })
      );
      Toast('Success!!', `User${selectedRows.length > 1 ? 's' : ''} disabled successfully`, 'success');
      setSelectedRows([]);
      fetchUsers(search);
      history.push('/users');
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
    setLoading(false);
  };
  
  const getRowStyles = (row: IRow): React.CSSProperties => {
    if (!row.Enabled) {
      return {
        background: 'rgba(0, 0, 0, 0.1)'
      };
    }
    return {};
  };

  const onRowClick = (row: IRow): void => {
    history.push(`users/${row[rowKey]}`);
  };

  useEffect(() => {
    fetchUsers(search);
  }, [search]);

  return (
    <>
      <CommonBreadCrumb paths={[defaultPath]} />
      <ActionWrapper>
        <Box>
          <SearchField placeholder={"Search Users"} {...bindSearch} />
        </Box>
        <Box>
          <ActionButton variant="outlined" color="error" size="medium" onClick={handleEnableUsers} disabled={selectedDisabledUsers.length === 0 || loading} className={"amplify-button--success"}>
            <DoneOutlined fontSize={"small"} />
            Enable
          </ActionButton>
          <ActionButton color="inherit" variant="outlined" size={"medium"} onClick={handleDisableUsers} disabled={selectedEnabledUsers.length === 0 || loading} className={"amplify-button--error"}>
            <DeleteOutline fontSize={"small"} />
            Disable
          </ActionButton>
          <ActionButton color="primary" variant="outlined" size={"medium"} onClick={() => history.push('/users/new')} disabled={loading} className={"amplify-button"}>
            <Add fontSize={"small"} />
            Add User
          </ActionButton>
        </Box>
      </ActionWrapper>
      <CommonTable
        showCheckBoxSelection
        rowKey={rowKey}
        tableColumns={columns}
        tableData={users}
        getRowStyles={getRowStyles}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
};

export default Users;
