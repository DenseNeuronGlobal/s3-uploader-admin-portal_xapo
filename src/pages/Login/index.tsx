import React, {FC, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import {useHistory} from 'react-router-dom';
import {Box, Button, Card, CircularProgress, styled} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import {useInput} from '../../utils/forms';
import {Toast} from '../../utils/notifications';

const Page: any = styled(Box)({
  margin: '80px 0 0',
  display: 'flex',
  justifyContent: 'center'
});

const Field: any = styled(TextField)({
  margin: '10px 0'
});

const Signin: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();

  const {value: email, bind: bindEmail} = useInput('');
  const {value: password, bind: bindPassword} = useInput('');

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Auth.signIn(email, password);
      Toast('Success!!', 'Login Successfully', 'success');
      history.push('/');
    } catch (error: any) {
      Toast('Error!!', error.message, 'danger');
    }
    setLoading(false);
  };

  return (
    <Page>
      <Card style={{width: 500, padding: '40px'}}>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
          onSubmit={handleSubmit}
        >
          <h1 style={{fontSize: '22px', fontWeight: 800}}> Sign in to an existing account</h1>
          <Field label="Email" {...bindEmail} />
          <Field label="Password" type="password" {...bindPassword} />
          <Button variant="contained" color="primary" size="large" type="submit" disabled={loading}>
            {loading && <CircularProgress size={20} style={{marginRight: 20}} />}
            Login to Your Account
          </Button>
        </form>
      </Card>
    </Page>
  );
};

export default Signin;
