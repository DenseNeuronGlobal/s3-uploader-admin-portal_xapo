import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, Grid, TextField, styled, CircularProgress} from "@material-ui/core";
import AWS from "aws-sdk";
import { Toast } from "../../../utils/notifications";
import { useInput } from "../../../utils/forms";
import { COGNITO } from "../../../configs/aws";

AWS.config.update({ region: COGNITO.REGION, accessKeyId: COGNITO.ACCESS_KEY_ID, secretAccessKey: COGNITO.SECRETE_ACCESS_KEY });
const s3 = new AWS.S3();

const FormPaper: any = styled(Card)({
  padding: "20px",
});

const Field: any = styled(TextField)({
  margin: "10px 0",
  width: '100%'
});

const AddButton: any = styled(Button)({
  marginLeft: 'auto',
  marginTop: '20px',
});

const UserDetail: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  const { value: name, bind: bindName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");
  const { value: confirmPassword, bind: bindConfirmPassword } = useInput("");

  const handleSignUp = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      Toast(
        "Error!!",
        "Password and Confirm Password should be same",
        "danger"
      );
      return;
    }
    try {
      const cognito = new AWS.CognitoIdentityServiceProvider();

      const cognitoParams = {
        UserPoolId: COGNITO.USER_POOL_ID,
        Username: email,
        TemporaryPassword: confirmPassword,
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'email_verified',
            Value: 'true',
          }
        ],
      }

      await cognito.adminCreateUser(cognitoParams, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const params = {
            Bucket: COGNITO.S3_BUCKET,
            Key: `${email}/`
          };

          s3.putObject(params).promise();
          Toast("Success!!", "User created successfully", "success");
          history.push("/users");
        }
      });
    } catch (error: any) {
      if (error) {
        Toast("Error!!", error.message, "danger");
      }
    }
    setLoading(false);
  };

  return (
    <FormPaper>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onSubmit={handleSignUp}
      >
        <Grid  container spacing={4}>
          <Grid item xs={1} md={6}>
            <Field label="Name" {...bindName} />
          </Grid>
          <Grid item xs={1} md={6}>
            <Field label="Email" {...bindEmail} type="email" />
          </Grid>
          <Grid item xs={1} md={6}>
            <Field label="Password" type="password" {...bindPassword} />
          </Grid>
          <Grid item xs={1} md={6}>
            <Field
              label="Confirm Password"
              type="password"
              {...bindConfirmPassword}
            />
          </Grid>
        </Grid>
        <AddButton
          variant="outlined"
          color="primary"
          size="large"
          type="submit"
          disabled={loading}
        >
          {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
          Add
        </AddButton>
      </form>
    </FormPaper>
  );
};

export default UserDetail;
