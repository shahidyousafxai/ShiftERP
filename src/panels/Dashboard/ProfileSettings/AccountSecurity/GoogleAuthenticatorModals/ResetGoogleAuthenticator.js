import React, { useState } from "react";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";


import { Button, TextField, Alert } from "../../../../../shared";
import { googleAuthReset } from "../../../../../api/googleAuthenticatorApi.js";
import { userRefreshStart } from "../../../../../redux/users/user.actions.js";

const ResetGoogleAuthenticator = ({ closeModal }) => {
  const dispatch = useDispatch();

  const [state, setState] = useState("");
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);
  const handleSubmit = () => {
    if (!state) {
      setError("Please enter your backup key");
      return;
    }
    var formdata = new FormData();
    formdata.append("backup_key", state);
    // formdata.append("disable", "true");
    setloading(true);
    googleAuthReset(formdata)
      .then((res) => {
        if (res.data.success) {
          dispatch(userRefreshStart());

          setloading(false);

          closeModal();
        } else {
          throw new Error("Invalid backup key. Try again");
        }
      })
      .catch((err) => {
        setloading(false);
        setError("Invalid backup key. Try again");
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
          Enter the backup key to reset Authenticator App.
        </Typography>
        {error && (
          <div className="mb-3 mt-3">
            <Alert severity="error" icon={false}>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"red"}>
                {error}{" "}
              </Typography>
            </Alert>
          </div>
        )}
        <TextField
          //   required
          color={"primary"}
          label="Backup key"
          type="text"
          fullWidth
          size="small"
          onChange={(e) => setState(e.target.value)}
        />

        <div className="buttons d-flex  gap-3 justify-content-end">
          <Button
            className={"shadow-5 normal-case py-[5px] px-5 text-darkGray border border-darkGray bg-white"}
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

export default ResetGoogleAuthenticator;
