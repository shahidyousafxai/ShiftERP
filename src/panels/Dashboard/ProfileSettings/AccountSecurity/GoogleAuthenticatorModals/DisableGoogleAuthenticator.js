import React, { useState } from "react";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";


import { TextField, Alert, Button } from "../../../../../shared";
import { googleAuthDisable } from "../../../../../api/googleAuthenticatorApi.js";
import { userRefreshStart } from "../../../../../redux/users/user.actions.js";


const DisableGoogleAuthenticator = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState("");
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);
  const handleSubmit = () => {
    if (!state) {
      setError("Please enter your verification code");
      return;
    }
    var formdata = new FormData();
    formdata.append("verify_code", state);
    formdata.append("disable", "true");
    setloading(true);
    googleAuthDisable(formdata)
      .then((res) => {
        if (res.data.success && res.data.data.enable_google === 0) {
          dispatch(userRefreshStart());
          closeModal();
        } else {
          throw new Error("Verification Code is invalid. Please try again");
        }
      })
      .catch((err) => {
        setloading(false);
        setError("Verification Code is invalid. Please try again");
      });
  };
  return (
    <>
      <div className="d-flex gap-3 flex-column">
        <Typography
          id="modal-modal-description"
          sx={{
            fontSize: "13px",
          }}>
          Enter Verification from Google Authenticator App.
        </Typography>
        {error && (
          <div className="mb-3 mt-3">
            <Alert severity="error" icon={false}>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"red"}>
                {error}
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
          onChange={(e) => setState(e.target.value)}
        />

        <div className="buttons d-flex  gap-3 justify-content-end">
          <Button
            className={"shadow-5 normal-case py-[5px] px-5 text-darkGray border border-lightGray bg-white"}
            loading={loading}
            onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button
            className={"shadow-5 normal-case py-[5px] px-5 text-white border-[3px] border-danger bg-danger"}
            loading={loading}
            onClick={() => handleSubmit()}>
            Disable
          </Button>
        </div>
      </div>
    </>
  );
};

export default DisableGoogleAuthenticator;
