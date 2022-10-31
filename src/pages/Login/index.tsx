import React from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";
import { useInput } from "../../utils/forms";
import { Toast } from "../../utils/notifications";

const Field: any = styled<any>(TextField)({
  margin: "10px 0",
});

const Signin: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Auth.signIn(email, password);
      Toast("Success!!", "Login Successfully", "success");
      history.push("/");
    } catch (error) {
      Toast("Error!!", error.message, "danger");
    }
    setLoading(false);
  };

  return (
    <Card style={{ width: 500, margin: "100px auto", padding: "40px" }}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onSubmit={handleSubmit}
      >
        <h1 style={{ fontSize: "22px", fontWeight: 800 }}>
          {" "}
          Sign in to an existing account
        </h1>
        <Field label="Email" {...bindEmail} />
        <Field label="Password" type="password" {...bindPassword} />
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={loading}
        >
          {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
          Login to Your Account
        </Button>
      </form>
    </Card>
  );
};

export default Signin;
