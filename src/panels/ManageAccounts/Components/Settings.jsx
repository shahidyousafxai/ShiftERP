// Library imports
import React, { useState } from "react";
import { Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MuiPhoneNumber from "material-ui-phone-number";
import { phone as phonevalidator } from "phone";

// Local Imports
import { Button, CustomModal, TextField } from "../../../shared";

const Settings = ({
  provisionDetails,
  provisionDetailsEmpty,
  handleOnChange,
  handlePhoneOnChange,
  handleOnFocus,
}) => {
  const [modal, toggleModal] = useState(false);
  const [error, setError] = useState({ name: "", msg: "" });
  // For Validating Email
  const validateEmail = (email) => {
    var emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
  };
  const isProvisionDetailsEmpty = () => {
    let isAdminPhoneValid = phonevalidator(provisionDetails.adminPhone).isValid;
    let emailValid = validateEmail(provisionDetails?.adminEmail);

    if (provisionDetails?.adminFirstName === "") {
      setError({ name: "adminFirstName", msg: "Field data is required." });
      return true;
    } else if (provisionDetails?.adminLastName === "") {
      setError({ name: "adminLastName", msg: "Field data is required." });
      return true;
    } else if (provisionDetails?.adminUsername === "") {
      setError({ name: "adminUsername", msg: "Field data is required." });
      return true;
    } else if (!emailValid) {
      setError({ name: "adminEmail", msg: "Field data is not valid." });
      return true;
    } else if (!isAdminPhoneValid) {
      setError({ name: "adminPhone", msg: "Field data is not valid." });
      return true;
    } else {
      return false;
    }
  };

  const saveAdminDetails = () => {
    if (!isProvisionDetailsEmpty()) {
      toggleModal(false);
    }
  };

  const onChangeHandler = (e) => {
    setError({ name: "", msg: "" });
    handleOnChange(e);
  };

  return (
    <>
      <div className="w-1/2 flex flex-col justify-between items-stretch relative px-[20px] pt-[20px]">
        <div className="px-3 py-3 border h-full rounded bg-white pb-0.5">
          <p className="mb-4 text-base font-semibold">Admin Information</p>
          <EditIcon
            className={`position-absolute top-[40px] right-[40px] cursor-pointer w-[20px] h-[20px] text-[13px] ${
              provisionDetailsEmpty?.settings
                ? "text-red"
                : "text-secondaryColor"
            } `}
            onClick={() => toggleModal(true)}
          />
          <div className="flex flex-col gap-2 !text-sm">
            <div className="flex gap-2">
              <span className="text-darkGray">User Name :</span>
              <Typography sx={{ fontSize: "14px" }} color={"primary"}>
                {provisionDetails.adminUsername}
              </Typography>
            </div>
            <div className="flex gap-2">
              <span className="text-darkGray">Email :</span>
              <Typography sx={{ fontSize: "14px" }}>
                {provisionDetails.adminEmail}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <CustomModal
        open={modal}
        close={() => {
          toggleModal(false);
          setError({ name: "", msg: "" });
        }}
        title="Admin Information"
        padding={2}
        width={600}>
        <form>
          <div className="d-flex gap-3 flex-column">
            <div className="form-row flex gap-3 pr-3 mb-3">
              <div className="col-md-6">
                <TextField
                  label="First Name"
                  fullWidth
                  size="small"
                  name="adminFirstName"
                  helperText={
                    provisionDetailsEmpty?.adminFirstName
                      ? "First Name is required"
                      : error?.name === "adminFirstName"
                      ? error?.msg
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.adminFirstName
                      ? true
                      : error?.name === "adminFirstName"
                      ? true
                      : false
                  }
                  value={provisionDetails.adminFirstName}
                  onChange={(e) => onChangeHandler(e)}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label="Last Name"
                  fullWidth
                  size="small"
                  name="adminLastName"
                  helperText={
                    provisionDetailsEmpty?.adminLastName
                      ? "Last Name is required"
                      : error?.name === "adminLastName"
                      ? error?.msg
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.adminLastName
                      ? true
                      : error?.name === "adminLastName"
                      ? true
                      : false
                  }
                  value={provisionDetails.adminLastName}
                  onChange={(e) => onChangeHandler(e)}
                  onFocus={handleOnFocus}
                />
              </div>
            </div>
            <div className="form-row flex gap-3 pr-3 mb-3">
              <div className="col-md-6">
                <TextField
                  label="User Name"
                  fullWidth
                  size="small"
                  name="adminUsername"
                  helperText={
                    provisionDetailsEmpty?.adminUsername
                      ? "User Name is required"
                      : provisionDetailsEmpty?.usernameTaken
                      ? "The username has already been taken"
                      : error?.name === "adminUsername"
                      ? error?.msg
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.adminUsername
                      ? true
                      : provisionDetailsEmpty?.usernameTaken
                      ? true
                      : error?.name === "adminUsername"
                      ? true
                      : false
                  }
                  value={provisionDetails.adminUsername}
                  onChange={(e) => onChangeHandler(e)}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
                  name="adminEmail"
                  helperText={
                    provisionDetailsEmpty?.adminEmail
                      ? "Email is required"
                      : provisionDetailsEmpty?.adminEmailValid
                      ? "Email is not valid"
                      : provisionDetailsEmpty?.emailTaken
                      ? "The email has already been taken"
                      : error?.name === "adminEmail"
                      ? error?.msg
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.adminEmail
                      ? true
                      : provisionDetailsEmpty?.adminEmailValid
                      ? true
                      : provisionDetailsEmpty?.emailTaken
                      ? true
                      : error?.name === "adminEmail"
                      ? true
                      : false
                  }
                  value={provisionDetails.adminEmail}
                  onChange={(e) => onChangeHandler(e)}
                  onFocus={handleOnFocus}
                />
              </div>
            </div>
            <div className="form-row flex gap-3 pr-3">
              <div className="col-md-6">
                <MuiPhoneNumber
                  defaultCountry="us"
                  variant="outlined"
                  size="small"
                  label="Phone"
                  fullWidth
                  disableAreaCodes
                  helperText={
                    provisionDetailsEmpty?.adminPhone
                      ? "Phone is required"
                      : provisionDetailsEmpty?.adminPhoneValid
                      ? "Phone is not valid"
                      : error?.name === "adminPhone"
                      ? error?.msg
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.adminPhone
                      ? true
                      : provisionDetailsEmpty?.adminPhoneValid
                      ? true
                      : error?.name === "adminPhone"
                      ? true
                      : false
                  }
                  value={provisionDetails.adminPhone}
                  onChange={(e) => {
                    handlePhoneOnChange(e, "adminPhone");
                    setError({ name: "", msg: "" });
                  }}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="col-md-6 pl-[200px] mt-1">
                <Button
                  className={
                    "h-9 w-[75px] text-white bg-primaryColor normal-case"
                  }
                  onClick={() => {
                    saveAdminDetails();
                  }}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CustomModal>
    </>
  );
};

export default Settings;
