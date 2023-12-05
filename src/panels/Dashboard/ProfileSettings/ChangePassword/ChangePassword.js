import React, { useState } from "react";
import { Button, TextField, Typography, Alert, PasswordStrengthIndicator } from "../../../../shared";
import { changeUserPasswordApi } from "../../../../api/profileSettingApi";
import { danger } from "../../../../helpers/GlobalVariables";

const isNumberRegx = /\d/;
const isUpperCase = /[A-Z]+/;

const ChangePassword = () => {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    error: false,
    errorNewPassword: false,
    patternError: false,
    errorMessage: "",
    success: false,
    showError: true,
  });
  const [loading, setloading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState({
    minChar: null,
    number: null,
    isUpperCase: null,
  });

  const setNewPasswordButtonClick = async () => {
    setValues({ ...values, errorMessage: "", error: false });
    if (!validateNewAndConfirmPassword()) {
      return;
    }
    try {
      setloading(true);
      const payload = {
        current_password: values.currentPassword,
        password: values.newPassword,
        password_confirmation: values.confirmPassword,
      };
      await changeUserPasswordApi(payload);
      setValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        error: false,
        errorMessage: "",
        success: true,
      });
      setloading(false);
    } catch (error) {
      setloading(false);

      setValues({
        ...values,
        success: false,
        error: true,
        showError: false,
        errorMessage: error.response.data.message,
      });
    }
  };

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
    // validateNewAndConfirmPassword();
  };

  const validateNewAndConfirmPassword = () => {
    if (
      passwordValidity.minChar === false ||
      passwordValidity.isUpperCase === false ||
      passwordValidity.number === false
    ) {
      setValues({
        ...values,
        patternError: true,
        errorMessage: "Your password is not strong enough.",
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
        errorNewPassword: true,
        errorMessage: "New password and confirm password do not match.",
      });
      return false;
    }

    return true;
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h6>Change Password</h6>
        {values.error && (
          <div className="mb-3 mt-3">
            <Alert severity="error" icon={false}>
              <Typography fontSize={13} color={danger}>
                {values.errorMessage}
              </Typography>
            </Alert>
          </div>
        )}
        {values.success && (
          <div className="mb-3 mt-3">
            <Alert severity="success" icon={false}>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"green"}>
                {"Password Changed Successfully"}
              </Typography>
            </Alert>
          </div>
        )}
        <div className="mt-3">
          <TextField
            label="Current Password"
            fullWidth={true}
            size="small"
            name="currentPassword"
            type={values.currentPassword === "" ? "" : "password"}
            value={values.currentPassword}
            onFocus={() => setValues({ ...values, error: false })}
            error={values.error}
            onChange={handleChange}
          />
        </div>
        {values.patternError && (
          <div className="mb-3 mt-3">
            <Alert severity="error" icon={false}>
              <Typography fontSize={13} color={danger}>
                {values.errorMessage}
              </Typography>
            </Alert>
          </div>
        )}
        {values.showError && values.errorNewPassword && (
          <div className="mb-3 mt-3">
            <Alert severity="error" icon={false}>
              <Typography fontSize={13} color={danger}>
                {values.errorMessage}
              </Typography>
            </Alert>
          </div>
        )}
        <div className="mt-3">
          <TextField
            label="New Password"
            fullWidth={true}
            size="small"
            name="newPassword"
            type={values.newPassword === "" ? "" : "password"}
            value={values.newPassword}
            error={values.errorNewPassword || values.patternError}
            onFocus={() => setPasswordFocused(true)}
            onChange={handleChange}
          />
        </div>
        {passwordFocused && values.newPassword.length > 0 && (
          <PasswordStrengthIndicator validity={passwordValidity} />
        )}
        <div className="mt-3">
          <TextField
            label="Confirm Password"
            fullWidth={true}
            value={values.confirmPassword}
            size="small"
            name="confirmPassword"
            type={values.confirmPassword === "" ? "" : "password"}
            error={values.errorNewPassword}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end mt-4">
        <Button
          loading={loading}
          disabled={
            loading
              ? loading
              : values.currentPassword === "" ||
                values.newPassword === "" ||
                values.confirmPassword === ""
              ? true
              : false
          }
          className="normal-case"
          variant="contained"
          onClick={setNewPasswordButtonClick}>
          Set New Password
        </Button>
      </div>
    </div>
  );
};

export default ChangePassword;
