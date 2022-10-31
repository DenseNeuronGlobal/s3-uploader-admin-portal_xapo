import React from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";
import {Card, Grid} from "@material-ui/core";
import { Toast } from "../../../utils/notifications";
import { useInput } from "../../../utils/forms";

const FormPaper: any = styled(Card)({
  padding: "20px",
});

const Field: any = styled(TextField)({
  margin: "10px 0",
  width: '100%'
});

const AddUser: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  const { value: name, bind: bindName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: phone, bind: bindPhone } = useInput("");
  const { value: company, bind: bindCompany } = useInput("");
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
      await Auth.signUp({
        username: email,
        password: confirmPassword,
        attributes: {
          email,
          name,
          phone_number: phone,
          "custom:company": company,
        },
      });
      Toast("Success!!", "Signup was successful", "success");
      history.push("/confirmation");
    } catch (error) {
      console.error(error);
      Toast("Error!!", error.message, "danger");
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
            <Field label="Phone" {...bindPhone} type="tel" />
          </Grid>
          <Grid item xs={1} md={6}>
            <Field label="Company" {...bindCompany} />
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
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={loading}
        >
          {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
          Sign Up
        </Button>
      </form>
    </FormPaper>
  );
};

export default AddUser;
