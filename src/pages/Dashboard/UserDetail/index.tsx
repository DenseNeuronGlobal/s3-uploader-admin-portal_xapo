import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  styled,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import {Auth, API} from 'aws-amplify';
import {IUserResponse, IAttribute} from '../../../interfaces/user.interface';
import {Toast} from '../../../utils/notifications';
import {useInput} from '../../../utils/forms';
import {Add, DeleteOutline, EditOutlined, DoneOutlined} from "@material-ui/icons";
import CommonBreadCrumb from "../../../components/BreadCrumbs";
import {IPath} from "../../../interfaces/global.interface";
import {COGNITO} from '../../../configs/aws';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [autoPassword, setAutoPassword] = useState<boolean>(false);
  const [addToGroup, setAddToGroup] = useState<boolean>(false);
  const [isUserDisabled, setIsUserDisabled] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const history = useHistory();
  const {username} = useParams<{username: string}>();
  const {value: name, bind: bindName, setValue: setName} = useInput('');
  const {value: email, bind: bindEmail, setValue: setEmail} = useInput('');
  const {value: password, bind: bindPassword} = useInput('');
  const {value: confirmPassword, bind: bindConfirmPassword} = useInput('');

  const fetchUser = async (username: string): Promise<IUserResponse> => {
    const path: string = '/getUser';
    const myInit = {
      queryStringParameters: {
        username
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    };
    return API.get(apiName, path, myInit);
  };
  
  const getUser = async (username: string): Promise<void> => {
    setLoading(true);
    try {
      const user: IUserResponse = await fetchUser(username);
      setIsUserDisabled(!user.Enabled);
      if (user.UserAttributes) {
        setName(user.UserAttributes.find((attr: IAttribute) => attr.Name === 'name')?.Value || '');
        const fetchedUserEmail = user.UserAttributes.find((attr: IAttribute) => attr.Name === 'email')?.Value || '';
        setEmail(fetchedUserEmail);
        setUserEmail(fetchedUserEmail);
      }
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
    setLoading(false);
  };
  
  const generatePassword = (): string => {
    return Math.random().toString(36).slice(0, 8) + Math.random().toString(36).toUpperCase().slice(0, 8);
  };

  const handleSignUp = async (e: React.SyntheticEvent<Element, Event>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!autoPassword) {
      if (password.length === 0) {
        setIsSubmitting(false);
        Toast('Error!!', 'Password and Confirm Password are required', 'danger');
        return;
      }
      if (password !== confirmPassword) {
        setIsSubmitting(false);
        Toast('Error!!', 'Password and Confirm Password should be same', 'danger');
        return;
      }
    }
    try {
      const user: IUserResponse = await fetchUser(email);
      if (user) {
        setIsSubmitting(false);
        Toast('Error!!', 'Email already exists!', 'danger');
        return;
      }
    } catch (error: any) {
      console.log("error", error.message);
    }
    const params = {
      username: email,
      password: autoPassword ? generatePassword() : confirmPassword,
      attributes: {
        name,
        email
      }
    };
    try {
      await Auth.signUp(params);
      if (addToGroup) {
        const path: string = '/addUserToGroup';
        const myInit = {
          body: {
            username: email,
            groupname: COGNITO.DEFAULT_USER_GROUP
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          }
        };
        await API.post(apiName, path, myInit);
      }
      Toast('Success!!', 'User created successfully', 'success');
      history.push('/users');
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
    setIsSubmitting(false);
  };

  const handleEnableUser = async (): Promise<void> => {
    setLoading(true);
    const path: string = '/enableUser';
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
      Toast('Success!!', 'User enabled successfully', 'success');
      history.push('/users');
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
    setLoading(false);
  };

  const handleDisableUser = async (): Promise<void> => {
    setLoading(true);
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
    setLoading(false);
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
            title: isEdit ? userEmail : "Add User"
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
            <Grid item xs={12} md={6}>
              <Field label="Name" {...bindName} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field label="Email" {...bindEmail} type="email" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field label="Password" type="password" {...bindPassword} disabled={isEdit || autoPassword} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field label="Confirm Password" type="password" {...bindConfirmPassword} disabled={isEdit || autoPassword} />
            </Grid>
            {!isEdit && (
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={autoPassword}
                      onChange={() => setAutoPassword((prev) => !prev)}
                    />
                  )}
                  label="Auto Generate Password"
                />
              </Grid>
            )}
            {!isEdit && COGNITO.ALLOW_ADD_TO_GROUP && COGNITO.DEFAULT_USER_GROUP && (
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={addToGroup}
                      onChange={() => setAddToGroup((prev) => !prev)}
                    />
                  )}
                  label={`Add User To Group (${COGNITO.DEFAULT_USER_GROUP})`}
                />
              </Grid>
            )}
          </Grid>

          <ActionFooter>
            {isEdit && (
              isUserDisabled ? (
                <ActionButton variant="outlined" color="error" size="medium" onClick={handleEnableUser} disabled={loading} className={"amplify-button--success"}>
                  <DoneOutlined fontSize={"small"} />
                  Enable
                </ActionButton>
              ) : (
                <ActionButton variant="outlined" color="error" size="medium" onClick={handleDisableUser} disabled={loading} className={"amplify-button--error"}>
                  <DeleteOutline fontSize={"small"} />
                  Disable
                </ActionButton>
              )
            )}
            <ActionButton variant="outlined" color="primary" size="medium" type="submit" disabled={isEdit || isSubmitting} className={"amplify-button"}>
              {isSubmitting && <CircularProgress size={20} style={{marginRight: 20}} />}
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
