import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import React, { useEffect, useState } from "react";
import { Button, Alert, TextField } from "../../../../../shared";
import { sendSmsVerificationCode } from "../../../../../api/authApi.js";
import { userRefreshStart } from "../../../../../redux/users/user.actions.js";
import { disableSMSAuth } from "../../../../../api/smsAuthenticationApi.js";
import { danger } from "../../../../../helpers/GlobalVariables";

const TIMER = 59;

const DisableSmsAuthenticator = ({ closeModal }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [state, setState] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [sendCode, setSendCode] = useState(false);
  const [counter, setCounter] = useState(TIMER);

  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    resendSmsApi();
  }, []);

  async function resendSmsApi() {
    try {
      setCounter(TIMER);

      setSendCode(false);
      let { data } = await sendSmsVerificationCode({});
      if (data.success) {
        setSendCode(true);
        setState(data.data.code);
      }
    } catch (error) {}
  }
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
  async function disableButtonClick() {
    if (!state) {
      setError("Please enter your verification code");
      return;
    }
    try {
      setloading(true);
      let { data } = await disableSMSAuth({
        verify_code: state,
        func_name: "disable",
      });
      if (data.success) {
        dispatch(userRefreshStart());
        closeModal();
      } else {
        throw new Error("Invalid Code Please try again");
      }
    } catch (error) {
      setloading(false);
      setError(error.response.data.message);
    }
  }
  return (
    <>
      <div className="d-flex gap-3 flex-column">
        <Typography
          id="modal-modal-description"
          sx={{
            fontSize: "14px",
          }}>
          Verification code has been sent to your phone number :{" "}
          {currentUser.phone}.
        </Typography>
        {error && (
          <div>
            <Alert severity="error" icon={false}>
              <Typography fontSize={13} color={danger}>
                {error}
              </Typography>
            </Alert>
          </div>
        )}
        <TextField
          //   required
          color={error ? "error" : "primary"}
          label="Verification Code"
          type="text"
          fullWidth
          size="small"
          value={state}
          error={error}
          onFocus={() => setError(null)}
          onChange={(e) => {
            setError(null);
            setState(e.target.value);
          }}
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
        <div className="buttons d-flex  gap-3 justify-content-end">
          <Button
            className={"shadow-5 normal-case py-[5px] px-5 text-darkGray border border-darkGray bg-white"}
            disabled={loading}
            onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button
            className={"shadow-5 normal-case py-[5px] px-5 text-white border-[3px] border-danger bg-danger"}
            disabled={loading}
            loading={loading}
            onClick={() => disableButtonClick()}>
            Disable
          </Button>
        </div>
      </div>
    </>
  );
};

export default DisableSmsAuthenticator;
