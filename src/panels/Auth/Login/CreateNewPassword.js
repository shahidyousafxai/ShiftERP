// Library Import
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Local Import
import { Typography, Button, TextField, Alert, PasswordStrengthIndicator } from "../../../shared"
import { danger } from "../../../helpers/GlobalVariables";
import "../Auth.css";
import AssetsImages from "../../../assets/images";
import { resetPasswordApi } from "../../../api/authApi";

const isNumberRegx = /\d/;
const isUpperCase = /[A-Z]+/;

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const search = useLocation().search;
  const email = new URLSearchParams(search).get("email");
  const token = new URLSearchParams(search).get("token");
  const [values, setValues] = useState({
    newPassword: "",
    confirmPassword: "",
    showNewPassword: false,
    showConfirmPassword: false,
    error: false,
    errorMessage: "",
  });
  const [loading, setloading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState({
    minChar: null,
    number: null,
    isUpperCase: null,
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    if (e.target.name === "newPassword" && e.target.value === "") {
      setPasswordFocused(false);
    }
    if (e.target.name === "newPassword") {
      setPasswordValidity({
        minChar: e.target.value.length >= 8 ? true : false,
        number: isNumberRegx.test(e.target.value) ? true : false,
        isUpperCase: isUpperCase.test(e.target.value) ? true : false,
      });
    }
  };

  const handleClickShowNewPassword = () => {
    setValues({
      ...values,
      showNewPassword: !values.showNewPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };

  const validateNewAndConfirmPassword = () => {
    if (
      passwordValidity.minChar === false ||
      passwordValidity.isUpperCase === false ||
      passwordValidity.number === false
    ) {
      setValues({
        ...values,
        error: true,
        errorMessage: "Please follow the pattern.",
      });
      return false;
    }

    if (values.newPassword === "" || values.confirmPassword === "") {
      setValues({
        ...values,
        error: true,
        errorMessage: "All fields are required",
      });
      return false;
    }
    if (values.newPassword !== values.confirmPassword) {
      setValues({
        ...values,
        error: true,
        errorMessage: "New Password & confirm password doesn't match",
      });
      return false;
    }

    return true;
  };

  const setPasswordButtonClicked = async () => {
    if (!validateNewAndConfirmPassword()) {
      return;
    }
    try {
      const payload = {
        token,
        email,
        password: values.newPassword,
        password_confirmation: values.confirmPassword,
      };

      setloading(true);
      await resetPasswordApi(payload);
      setloading(false);

      navigate("/reset-successfully");
    } catch (error) {
      setloading(false);

      setValues({
        ...values,
        error: true,
        errorMessage: "Your password is not strong enough",
      });
    }
  };

  return (
    <div className="row justify-content-center login-container align-items-center ">
      <div className="col-md-4 p-5 p-md-2 text-center">
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
            Create New Passowrd
          </Typography>
        </div>
        <div className="mb-3">
          <Typography
            variant="h1"
            fontSize={13}
            fontWeight="medium"
            color="secondary"
            align="center">
            Please enter your new password.
          </Typography>
        </div>
        {values.error && (
          <div className="mb-3">
            <Alert severity="error" icon={false}>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={danger}>
                {values.errorMessage}
              </Typography>
            </Alert>
          </div>
        )}
        <div className="mb-3">
          <TextField
            label="New Password"
            fullWidth={true}
            size="small"
            error={values.error}
            type={values.showNewPassword ? "text" : "password"}
            onFocus={() => setPasswordFocused(true)}
            onChange={handleChange}
            name="newPassword"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    edge="end">
                    {values.showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {passwordFocused && values.newPassword.length > 0 && (
            <PasswordStrengthIndicator validity={passwordValidity} />
          )}
        </div>
        <div className="mb-3">
          <TextField
            label="Confirm Password"
            fullWidth={true}
            size="small"
            error={values.error}
            onChange={handleChange}
            name="confirmPassword"
            type={values.showConfirmPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end">
                    {values.showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Button
          color="primary"
          variant="contained"
          fullWidth={true}
          className="normal-case"
          disabled={false}
          loading={loading}
          onClick={setPasswordButtonClicked}>
          Set Password
        </Button>
      </div>
    </div>
  );
};

export default CreateNewPassword;
