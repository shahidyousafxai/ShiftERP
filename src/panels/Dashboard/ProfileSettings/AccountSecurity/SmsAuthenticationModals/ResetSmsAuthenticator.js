/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import { Button, Alert, TextField, Spinner } from "../../../../../shared";
import { userRefreshStart } from "../../../../../redux/users/user.actions.js";
import {
  sendEmailForResetSMSAuth,
  verifyResetSMSAuth,
} from "../../../../../api/smsAuthenticationApi.js";
import { danger } from "../../../../../helpers/GlobalVariables";

const TIMER = 59;

const ResetSmsAuthenticator = ({ closeModal }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [state, setState] = useState("");
  const [sendCode, setSendCode] = useState(false);
  const [counter, setCounter] = useState(TIMER);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [initialLoading, setinitialLoading] = useState(false);
  const [error, setError] = useState({
    code: null,
    password: null,
  });

  useEffect(() => {
    resendSmsApi();
  }, []);

  async function resendSmsApi() {
    try {
      setCounter(TIMER);
      setSendCode(false);
      setinitialLoading(true);
      let { data } = await sendEmailForResetSMSAuth();
      if (data.success) {
        setSendCode(true);
        setState(data.data.email_code);
        setCounter(TIMER);
      } else {
        throw new Error("Failed");
      }
      setinitialLoading(false);
    } catch (error) {
      setinitialLoading(false);

      setError({
        ...error,
        code: "Something went wrong. Please try again",
      });
    }
  }
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
  async function disableButtonClick() {
    let err;
    if (!state) {
      err = {
        ...err,
        code: "Please Enter your code",
      };
    }
    if (!password) {
      err = {
        ...err,
        password: "Please Enter your password",
      };
    }
    if (err) {
      setError(err);
      return;
    }
    setError({
      code: "",
      password: "",
    });
    try {
      setloading(true);
      let { data } = await verifyResetSMSAuth({
        verify_code: state,
        password,
      });
      if (data.success) {
        dispatch(userRefreshStart());
        closeModal();
      }
    } catch (error) {
      setloading(false);
      if (error.response.data.message === "The verification code is invalid.") {
        setError({
          ...error,
          code: error.response.data.message,
        });
      } else if (
        error.response.data.message ===
        "The password you entered did not match our records. Please try again."
      ) {
        setError({
          ...error,
          password: error.response.data.message,
        });
      } else {
        setError({
          ...error,
          code: "Failed to Reset. Please Try again",
        });
      }
    }
  }
  return (
    <>
      {initialLoading ? (
        <Spinner />
      ) : (
        <div className="d-flex gap-3 flex-column">
          <Typography
            id="modal-modal-description"
            sx={{
              fontSize: "14px",
            }}>
            Verification code has been sent to your email:{" "}
            <b>{currentUser.email}</b>.
          </Typography>
          {error.code && (
            <div className="mb-3 mt-3">
              <Alert severity="error" icon={false}>
                <Typography
                  variant="h1"
                  fontSize={13}
                  fontWeight="medium"
                  color={"red"}>
                  {error.code}
                </Typography>
              </Alert>
            </div>
          )}
          <TextField
            //   required
            color={"primary"}
            label="Verification Code"
            type="text"
            fullWidth
            size="small"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <div className="mb-3">
            <Typography
              variant="h1"
              fontSize={13}
              fontWeight="medium"
              color="secondary"
              align="center">
              {counter > 0 ? (
                `Resend in 00:${counter}`
              ) : (
                <Typography
                  color="primary"
                  variant="h1"
                  fontSize={13}
                  fontWeight="medium"
                  align="center"
                  onClick={resendSmsApi}>
                  <div className="pointer">Resend</div>
                </Typography>
              )}
            </Typography>
          </div>
          {error.password && (
            <div>
              <Alert severity="error" icon={false}>
                <Typography fontSize={13} color={danger}>
                  {error.password}
                </Typography>
              </Alert>
            </div>
          )}
          <TextField
            //   required
            color={"primary"}
            label="Your Account Password"
            type={password.length > 0 && "password"}
            fullWidth
            size="small"
            error={error.password}
            value={password}
            onFocus={() =>
              setError({
                ...error,
                password: false,
              })
            }
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="buttons d-flex  gap-3 justify-content-end">
            <Button
              className={"shadow-5 normal-case py-[5px] px-5 text-black border border-lightgrey bg-white"}
              loading={loading}
              onClick={() => closeModal()}>
              Cancel
            </Button>
            <Button
              className={"shadow-5 normal-case py-[5px] px-5 text-white border-[3px] border-danger bg-danger"}
              loading={loading}
              onClick={() => disableButtonClick()}>
              Reset Authenticator
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetSmsAuthenticator;
