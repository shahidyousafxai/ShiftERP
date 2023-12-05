// Library Imports 
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Local Imports 
import { Typography, Button, TextField, Alert } from "../../../shared"
import "../Auth.css";
import AssetsImages from "../../../assets/images";
import { danger } from "../../../helpers/GlobalVariables";
import {
  isUserAuthenticated,
  validateEmail,
} from "../../../helpers/GlobalMethods";
import { forgotPasswordApi } from "../../../api/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // STATES
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isUserAuthenticated()) {
      // navigate("/dashboard");
      return;
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.value === "") {
      setError(false);
      setEmail("");
      return;
    }
    if (!validateEmail(e.target.value)) {
      setMessage("Please enter valid email.");
      setError(true);
      return false;
    }
    setError(false);
    setEmail(e.target.value);
  };

  const validateEmailFields = () => {
    if (email === "") {
      setMessage("Email field cannot be empty.");
      setError(true);
      return false;
    }
    if (!validateEmail(email)) {
      setMessage("Please enter valid email.");
      setError(true);
      return false;
    }
    return true;
  };

  const resetPasswordButtonClicked = async () => {
    const payload = {
      email,
      url: window.location.origin + "/reset-password",
    };

    if (!validateEmailFields()) {
      return;
    }
    try {
      setLoading(true);
      // eslint-disable-next-line no-unused-vars
      const { data } = await forgotPasswordApi(payload);
      setLoading(false);
      navigate("/request-sent", {
        state: {
          email,
        },
      });
    } catch ({ response }) {
      setMessage("User does not exist, Please enter a valid email.");
      setError(true);
      setLoading(false);
    }
  };

  const backButtonClicked = () => navigate("/");

  return (
    <div className="row justify-content-center login-container align-items-center ">
      <div className="col-md-4 p-5 p-md-2">
        <div className="logo-wrapper mb-5">
          <Link to="/ ">
            <img alt="shift-erp" src={AssetsImages.Logo} />
          </Link>
        </div>
        <div className="my-3">
          <Typography
            variant="h1"
            fontSize={17}
            fontWeight="medium"
            align="center">
            Forgot Password
          </Typography>
        </div>
        <div className="mb-3">
          <Typography
            variant="h1"
            fontSize={13}
            fontWeight="medium"
            color="secondary"
            align="center">
            Enter your email address and we will send you instructions to reset
            your password.
          </Typography>
        </div>

        {error && (
          <div className="mb-3">
            <Alert severity="error" icon={false}>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={danger}>
                {message}
              </Typography>
            </Alert>
          </div>
        )}

        <div className="mb-3">
          <TextField
            error={error}
            label="Email Address"
            fullWidth={true}
            size="small"
            type="email"
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <Button
            color="primary"
            variant="contained"
            loading={loading}
            fullWidth={true}
            className="normal-case"
            onClick={resetPasswordButtonClicked}>
            Reset Password
          </Button>
        </div>
        <div>
          <Button
            color="primary"
            loading={loading}
            variant="outlined"
            fullWidth={true}
            className="normal-case"
            onClick={backButtonClicked}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
