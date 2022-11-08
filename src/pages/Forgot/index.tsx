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
})

const FormWrapper: any = styled(Card)({
  padding: '20px 20px 10px',
  borderRadius: '10px',
  border: '1px solid #838c95',
  boxShadow: '0 2px 6px rgba(13, 26, 38, 0.15)'
})

const BackToSignIn: any = styled(Box)({
  marginTop: '20px',
  textAlign: 'center',
});

const BackToSignInLink: any = styled(Link)({
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

const ResetPassword: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sendCode, setSendCode] = useState<boolean>(false);

  const history = useHistory();

  const {value: email, bind: bindEmail} = useInput('');
  const {value: code, bind: bindCode} = useInput('');
  const {value: password, bind: bindPassword} = useInput('');

  const savePassword = async () => {
    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      Toast('Success!!', 'Reset password Successfully', 'success');
      history.push('/');
    } catch (error: any) {
      Toast('Error!!', error.message, 'danger');
    }
  };

  const sendResetPasswordCode = async () => {
    try {
      await Auth.forgotPassword(email);
      Toast('Success!!', 'Reset password code send Successfully', 'success');
      setSendCode(true);
    } catch (error: any) {
      Toast('Error!!', error.message, 'danger');
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    if (sendCode) {
      await savePassword();
    } else {
      await sendResetPasswordCode();
    }
    setLoading(false);
  };

  return (
    <Page>
      <LogoImages>
        <img className="amplify-image logo" alt="Xapo Logo" src="https://assets-global.website-files.com/63209aa05bd6ad6734b0da3d/6321ca7a2930be7b3d91991c_footer-logo-img.svg" />
        <img className="amplify-image" alt="Xapo Full Logo" src="https://assets-global.website-files.com/63209aa05bd6ad6734b0da3d/6321caad6f73797603d576fa_logo-colored.svg" />
      </LogoImages>
      <FormWrapper>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onSubmit={handleSubmit}
        >
          <h1 style={{fontSize: '20px', fontWeight: 500, margin: "0 0 20px"}}>Reset your password</h1>
          <InputField placeholder="Enter your email" {...bindEmail} />
          {sendCode && (
              <>
                <InputField placeholder="Enter code" {...bindCode} />
                <InputField placeholder="Enter new password" {...bindPassword} />
              </>
          )}
          <Button variant="contained" color="primary" size="medium" type="submit" disabled={loading} className={"amplify-button"}>
            {loading && <CircularProgress size={20} style={{marginRight: 20}} />}
            {sendCode ? 'Change Password' : 'Send Code'}
          </Button>
        </form>
        <BackToSignIn>
          <BackToSignInLink to="/signin" component={RouterLink}>Back to Sign In</BackToSignInLink>
        </BackToSignIn>
      </FormWrapper>
    </Page>
  );
};

export default ResetPassword;
