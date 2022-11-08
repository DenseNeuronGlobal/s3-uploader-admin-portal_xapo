import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Box, Button, Card, Grid, TextField, styled, CircularProgress} from '@material-ui/core';
import AWS from 'aws-sdk';
import {Toast} from '../../../utils/notifications';
import {useInput} from '../../../utils/forms';
import {COGNITO} from '../../../configs/aws';
import {Add, DeleteOutline, EditOutlined} from "@material-ui/icons";
import CommonBreadCrumb from "../../../components/BreadCrumbs";
import {IPath} from "../../../interfaces/global.interface";

AWS.config.update({region: COGNITO.REGION, accessKeyId: COGNITO.ACCESS_KEY_ID, secretAccessKey: COGNITO.SECRETE_ACCESS_KEY});

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

const UserDetail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const history = useHistory();
  const {username} = useParams<{username: string}>();
  const cognito = new AWS.CognitoIdentityServiceProvider();
  const s3 = new AWS.S3();

  const {value: name, bind: bindName, setValue: setName} = useInput('');
  const {value: email, bind: bindEmail, setValue: setEmail} = useInput('');
  const {value: password, bind: bindPassword} = useInput('');
  const {value: confirmPassword, bind: bindConfirmPassword} = useInput('');

  useEffect(() => {
    if (username && username !== 'new') {
      setIsEdit(true);
      const cognitoParams = {
        UserPoolId: COGNITO.USER_POOL_ID,
        Username: username
      };
      cognito.adminGetUser(cognitoParams, (err, data) => {
        if (data) {
          setName(data.Username);

          if (data.UserAttributes) {
            setEmail(data.UserAttributes.find(attr => attr.Name === 'email')?.Value || '');
          }
        }
      });
    }
  }, [username]);

  const handleSignUp = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      Toast('Error!!', 'Password and Confirm Password should be same', 'danger');
      return;
    }
    try {
      const cognito = new AWS.CognitoIdentityServiceProvider();

      const cognitoParams = {
        UserPoolId: COGNITO.USER_POOL_ID,
        Username: name,
        TemporaryPassword: confirmPassword,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          },
          {
            Name: 'email_verified',
            Value: 'true'
          }
        ]
      };

      await cognito.adminCreateUser(cognitoParams, (err, data) => {
        if (err) {
          Toast('Error!!', err.message, 'danger');
        } else {
          const params = {
            Bucket: COGNITO.S3_BUCKET,
            Key: `${name}/`
          };

          s3.putObject(params).promise();
          Toast('Success!!', 'User created successfully', 'success');
          history.push('/users');
        }
      });
    } catch (error: any) {
      if (error) {
        Toast('Error!!', error.message, 'danger');
      }
    }
    setLoading(false);
  };

  const handleRemove = () => {
    const cognitoParams = {
      UserPoolId: COGNITO.USER_POOL_ID,
      Username: username
    };
    const cognito = new AWS.CognitoIdentityServiceProvider();
    cognito.adminDeleteUser(cognitoParams, (err, data) => {
      if (err) {
        return;
      }

      const params = {
        Bucket: COGNITO.S3_BUCKET,
        Key: `${username}/`
      };

      s3.deleteObject(params).promise();
      history.push('/users');
    });
  };

  return (
    <>
      <CommonBreadCrumb
        paths={[
          defaultPath,
          {
            title: username
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
              <ActionButton variant="outlined" color="error" size="medium" onClick={handleRemove} disabled={loading} className={"amplify-button--error"}>
                <DeleteOutline fontSize={"small"} />
                Delete
              </ActionButton>
            )}
            <ActionButton variant="outlined" color="primary" size="medium" type="submit" disabled={loading} className={"amplify-button"}>
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
