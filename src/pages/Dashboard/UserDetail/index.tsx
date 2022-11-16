import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Box, Button, Card, Grid, TextField, styled, CircularProgress} from '@material-ui/core';
import {Auth, API} from 'aws-amplify';
import {IAttribute} from '../../../interfaces/user.interface';
import {Toast} from '../../../utils/notifications';
import {useInput} from '../../../utils/forms';
import {Add, DeleteOutline, EditOutlined} from "@material-ui/icons";
import CommonBreadCrumb from "../../../components/BreadCrumbs";
import {IPath} from "../../../interfaces/global.interface";

const FormPaper: any = styled(Card)({
  padding: '20px'
});

const Field: any = styled(TextField)({
  margin: '10px 0',
  width: '100%'
});

const ActionButton: any = styled(Button)({
  marginTop: '20px',
  marginLeft: '10px'
});

const ActionFooter: any = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end'
});

const defaultPath: IPath = {
  title: 'User List',
  to: '/users'
};

const apiName: string = 'AdminQueries';

const UserDetail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isUserEnabled, setIsUserEnabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const history = useHistory();
  const {username} = useParams<{username: string}>();
  const {value: name, bind: bindName, setValue: setName} = useInput('');
  const {value: email, bind: bindEmail, setValue: setEmail} = useInput('');
  const {value: password, bind: bindPassword} = useInput('');
  const {value: confirmPassword, bind: bindConfirmPassword} = useInput('');
  
  const getUser = async (username: string) => {
    const path: string = '/getUser';
    try {
      const myInit = {
        queryStringParameters: {
          username
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
      };
      const user = await API.get(apiName, path, myInit);
      setName(user.Username);
      setIsUserEnabled(user.Enabled);
      if (user.UserAttributes) {
        setEmail(user.UserAttributes.find((attr: IAttribute) => attr.Name === 'email')?.Value || '');
      }
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
  }

  const handleSignUp = async (e: React.SyntheticEvent<Element, Event>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      Toast('Error!!', 'Password and Confirm Password should be same', 'danger');
      return;
    }
    const params = {
      username: name,
      password: confirmPassword,
      attributes: {
        email,
      }
    };
    try {
      await Auth.signUp(params);
      Toast('Success!!', 'User created successfully', 'success');
      history.push('/users');
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
    setLoading(false);
  };

  const handleDisableUser = async (): Promise<void> => {
    const path: string = '/disableUser';
    try {
      const myInit = {
        body: {
          username
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
      };
      await API.post(apiName, path, myInit);
      Toast('Success!!', 'User disabled successfully', 'success');
      history.push('/users');
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
  };

  useEffect(() => {
    if (username && username !== 'new') {
      setIsEdit(true);
      getUser(username);
    }
  }, [username]);

  return (
    <>
      <CommonBreadCrumb
        paths={[
          defaultPath,
          {
            title: isEdit ? username : "Add User"
          }
        ]}
      />
      <FormPaper>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onSubmit={handleSignUp}
        >
          <Grid container spacing={4}>
            <Grid item xs={1} md={6}>
              <Field label="Name" {...bindName} />
            </Grid>
            <Grid item xs={1} md={6}>
              <Field label="Email" {...bindEmail} type="email" />
            </Grid>
            <Grid item xs={1} md={6}>
              <Field label="Password" type="password" {...bindPassword} disabled={isEdit} />
            </Grid>
            <Grid item xs={1} md={6}>
              <Field label="Confirm Password" type="password" disabled={isEdit} {...bindConfirmPassword} />
            </Grid>
          </Grid>

          <ActionFooter>
            {isEdit && (
              <ActionButton variant="outlined" color="error" size="medium" onClick={handleDisableUser} disabled={!isUserEnabled || loading} className={"amplify-button--error"}>
                <DeleteOutline fontSize={"small"} />
                Disable
              </ActionButton>
            )}
            <ActionButton variant="outlined" color="primary" size="medium" type="submit" disabled={isEdit || loading} className={"amplify-button"}>
              {loading && <CircularProgress size={20} style={{marginRight: 20}} />}
              {isEdit ? (
                  <>
                    <EditOutlined fontSize={"small"} />
                    Edit
                  </>
                  ) : (
                  <>
                    <Add fontSize={"small"} />
                    Add
                  </>
              )}
            </ActionButton>
          </ActionFooter>
        </form>
      </FormPaper>
    </>
  );
};

export default UserDetail;
