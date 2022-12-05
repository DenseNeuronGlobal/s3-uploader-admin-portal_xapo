import React, {FC, useState} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Box, Button, Card, CircularProgress, Link, styled} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import {useInput} from '../../utils/forms';
import {Toast} from '../../utils/notifications';
import InputField from "../../components/Field";

const Page: any = styled(Box)({
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '300px'
});

const LogoImages: any = styled(Box)({
  padding: '15px',
  textAlign: 'center'
});

const FormWrapper: any = styled(Card)({
  padding: '20px 20px 10px',
  borderRadius: '10px',
  border: '1px solid #838c95',
  boxShadow: '0 2px 6px rgba(13, 26, 38, 0.15)'
});

const ResetPassword: any = styled(Box)({
  marginTop: '20px',
  textAlign: 'center',
});

const ResetPasswordLink: any = styled(Link)({
  padding: '3.75px 7.5px',
  fontSize: '15px',
  fontWeight: 400,
  cursor: 'pointer',
  color: '#000000',
  textDecoration: 'none !important',
  '&:hover': {
    color: '#783326',
  }
});

const CancelButton: any = styled(Box)({
  fontSize: '15px',
  fontWeight: 400,
  cursor: 'pointer',
  color: '#000000',
  textDecoration: 'none !important',
  '&:hover': {
    color: '#783326',
  }
});

const Signin: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const history = useHistory();
  const {value: email, bind: bindEmail, reset: resetEmail} = useInput('');
  const {value: password, bind: bindPassword, reset: resetPassword} = useInput('');
  const {value: newPassword, bind: bindNewPassword, reset: resetNewPassword} = useInput('');
  const {value: confirmNewPassword, bind: bindConfirmNewPassword, reset: resetConfirmNewPassword} = useInput('');
  const handleSavePassword = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);
    try {
    } catch (error: any) {
      Toast('Error!!', error.message, 'danger');
    }
    setLoading(false);
  };
  const handleLogin = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userDetail = await Auth.signIn(email, password);
      console.log("userDetail", userDetail)
      if (userDetail.challengeName === "NEW_PASSWORD_REQUIRED") {
        userDetail = await Auth.completeNewPassword(userDetail, password);
        // setIsChangePassword(true)
      };
      console.log("userDetail", userDetail)
      if (userDetail.signInUserSession.accessToken && 
        userDetail.signInUserSession.accessToken.payload["cognito:groups"] && 
        userDetail.signInUserSession.accessToken.payload["cognito:groups"].length && 
        userDetail.signInUserSession.accessToken.payload["cognito:groups"].includes("Admin")
      ) {
        Toast('Success!!', 'Login Successfully', 'success');
        history.push('/');
      } else {
        Toast('Error!!', "This portal is for members of the Administration group only", 'danger');
      }
    } catch (error: any) {
      Toast('Error!!', error.message, 'danger');
    }
    setLoading(false);
  };
  const resetForm = () => {
    resetEmail();
    resetPassword();
    resetNewPassword();
    resetConfirmNewPassword();
    setIsChangePassword(false);
  };

  return (
    <Page>
      <LogoImages>
        <img className="amplify-image logo" alt="Xapo Logo" src="https://assets-global.website-files.com/63209aa05bd6ad6734b0da3d/6321ca7a2930be7b3d91991c_footer-logo-img.svg" />
        <img className="amplify-image" alt="Xapo Full Logo" src="https://assets-global.website-files.com/63209aa05bd6ad6734b0da3d/6321caad6f73797603d576fa_logo-colored.svg" />
      </LogoImages>
      {isChangePassword ? (
        <FormWrapper>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onSubmit={handleSavePassword}
          >
            <h1 style={{fontSize: '20px', fontWeight: 500, margin: "0 0 20px"}}>Change password</h1>
            <InputField placeholder="Enter new password" {...bindNewPassword} />
            <InputField placeholder="Confirm your password" type="password" {...bindConfirmNewPassword} />
            <Button variant="contained" color="primary" size="medium" type="submit" disabled={loading} className={"amplify-button"}>
              {loading && <CircularProgress size={20} style={{marginRight: 20}} />}
              Change Password
            </Button>
          </form>
          <ResetPassword>
            <CancelButton onClick={resetForm}>Cancel</CancelButton>
          </ResetPassword>
        </FormWrapper>
      ) : (
        <FormWrapper>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onSubmit={handleLogin}
          >
            <h1 style={{fontSize: '20px', fontWeight: 500, margin: "0 0 20px"}}>Sign in to your account</h1>
            <InputField placeholder="Enter your email" {...bindEmail} />
            <InputField placeholder="Enter your password" type="password" {...bindPassword} />
            <Button variant="contained" color="primary" size="medium" type="submit" disabled={loading} className={"amplify-button"}>
              {loading && <CircularProgress size={20} style={{marginRight: 20}} />}
              Sign in
            </Button>
          </form>
          <ResetPassword>
            <ResetPasswordLink to="/forgot" component={RouterLink}>Forgot your password</ResetPasswordLink>
          </ResetPassword>
        </FormWrapper>
      )}
    </Page>
  );
};

export default Signin;
