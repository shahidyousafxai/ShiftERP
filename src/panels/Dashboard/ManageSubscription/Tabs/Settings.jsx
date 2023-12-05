// Library Imports
import React, { useState } from "react";
import { Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MuiPhoneNumber from "material-ui-phone-number";
// Local Imports
import { CustomModal, TextField, Button } from "../../../../shared";

const Settings = ({
  provisionDetails,
  provisionDetailsEmpty,
  handleOnChange,
  handlePhoneOnChange,
  handleOnFocus,
}) => {
  const [modal, toggleModal] = useState(false);

  return (
    <>
      <div className="w-1/2 items-stretch relative flex flex-col justify-between pt-[20px] px-[20px]">
        <div className="px-3 py-3 border h-full rounded bg-white pb-0.5">
          <p className="mb-4 text-base font-semibold">Admin Information</p>
          <EditIcon
            className={`position-absolute top-[40px] right-[40px] cursor-pointer h-[20px] w-[20px] !text-[13px] ${
              provisionDetailsEmpty?.settings
                ? "text-danger"
                : "text-secondaryColor"
            }`}
            onClick={() => toggleModal(true)}
          />
          <div className="flex flex-col gap-2 !text-sm">
            <div className="flex gap-2">
              <span className="text-darkGray">User Name :</span>
              <Typography fontSize="14px" color="primary">
                {provisionDetails.adminUsername}
              </Typography>
            </div>
            <div className="flex gap-2">
              <span className="text-darkGray">Email :</span>
              <Typography fontSize="14px">
                {provisionDetails.adminEmail}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <CustomModal
        open={modal}
        close={() => toggleModal(false)}
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
                      : ""
                  }
                  error={provisionDetailsEmpty?.adminFirstName ? true : false}
                  value={provisionDetails.adminFirstName}
                  onChange={handleOnChange}
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
                      : ""
                  }
                  error={provisionDetailsEmpty?.adminLastName ? true : false}
                  value={provisionDetails.adminLastName}
                  onChange={handleOnChange}
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
                  disabled={true}
                  helperText={
                    provisionDetailsEmpty?.adminUsername
                      ? "User Name is required"
                      : provisionDetailsEmpty?.usernameTaken
                      ? "The username has already been taken"
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.adminUsername
                      ? true
                      : provisionDetailsEmpty?.usernameTaken
                      ? true
                      : false
                  }
                  value={provisionDetails.adminUsername}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
                  name="adminEmail"
                  disabled={true}
                  helperText={
                    provisionDetailsEmpty?.adminEmail
                      ? "Email is required"
                      : provisionDetailsEmpty?.adminEmailValid
                      ? "Email is not valid"
                      : provisionDetailsEmpty?.emailTaken
                      ? "The email has already been taken"
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.adminEmail
                      ? true
                      : provisionDetailsEmpty?.adminEmailValid
                      ? true
                      : provisionDetailsEmpty?.emailTaken
                      ? true
                      : false
                  }
                  value={provisionDetails.adminEmail}
                  onChange={handleOnChange}
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
                      : ""
                  }
                  error={
                    provisionDetailsEmpty?.adminPhone
                      ? true
                      : provisionDetailsEmpty?.adminPhoneValid
                      ? true
                      : false
                  }
                  value={provisionDetails.adminPhone}
                  onChange={(e) => handlePhoneOnChange(e, "adminPhone")}
                  onFocus={handleOnFocus}
                />
              </div>
              <div className="col-md-6 pl-[112px] mt-1">
                <Button
                  className="shadow-5 px-[15px] py-[5px] border border-[grey] text-secondaryColor capitalize"
                  variant="outlined"
                  onClick={() => toggleModal(false)}>
                  Cancel
                </Button>
                <Button
                  className={`ml-3 h-9 w-[75px] capitalize`}
                  variant="contained"
                  onClick={() => toggleModal(false)}>
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
