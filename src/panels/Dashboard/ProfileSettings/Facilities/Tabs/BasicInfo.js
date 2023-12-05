import React from "react";
import { Button, TextField, Typography, Alert } from "../../../../../shared";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { Switch } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";

const Input = styled("input")({
  display: "none",
});

const BasicInfo = ({
  id,
  name,
  address,
  city,
  state,
  zip,
  primaryContactName,
  primaryContactEmail,
  officePhone,
  status,
  setName,
  setAddress,
  setCity,
  setState,
  setZip,
  setPrimaryContactName,
  setPrimaryContactEmail,
  setofficePhone,
  setStatus,
}) => {
  return (
    <div
      className="flex flex-col justify-between pt-5 px-5">
      <div className="border rounded bg-white pb-0.5">
        <h6 className="px-3 pt-3 pb-1">Basic Information</h6>
        {/* Profile Image Row */}
        <div className="d-flex gap-4 align-items-start my-4 p-2">
          <Avatar
            alt={"MA"}
            // src={userDetails.profilePic}
            sx={{ width: 75, height: 75 }}
          />

          <div className="d-flex gap-2 flex-column">
            <img alt="" />
            <div className="d-flex gap-2">
              <label htmlFor="icon-button-file">
                <Input
                  accept=".png, .jpg"
                  id="icon-button-file"
                  type="file"
                  // onChange={handleImgChange}
                  // onClick={onInputClick}
                />
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  fullWidth={true}
                  className="normal-case"
                  disabled={false}
                  loading={false}>
                  Upload New Photo
                </Button>
              </label>
              {true && (
                <Button
                  component="span"
                  variant="outlined"
                  color="primary"
                  className="normal-case">
                  Remove
                </Button>
              )}
            </div>
            <div className="d-flex">
              <p
              className="text-secondaryColor text-xs">
                JPG or PNG, at least 256px
              </p>
            </div>
          </div>
        </div>
        {false && (
          <div className="mb-3 mt-3">
            <Alert
              severity="success"
              icon={false}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  onClick={() => {}}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"green"}>
                Success
              </Typography>
            </Alert>
          </div>
        )}
        <form className="px-3">
          <div className=" row">
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Facility ID"
                  type={"text"}
                  fullWidth
                  helperText={!id ? "Facility ID is required" : ""}
                  error={!id ? true : false}
                  value={id}
                  disabled={true}
                  name="facilityID"
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Facility Name"
                  type={"text"}
                  fullWidth
                  helperText={!name ? "Facility name is required" : ""}
                  error={!name ? true : false}
                  value={name}
                  name="facilityName"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Address"
                  fullWidth
                  name="address"
                  value={address}
                  helperText={!address ? "Facility address is required" : ""}
                  error={!address ? true : false}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="City"
                  fullWidth
                  name="addrcityess"
                  value={city}
                  helperText={!city ? "Facility city is required" : ""}
                  error={!city ? true : false}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-row row mb-3">
                <div className="col-md-9 mb-3">
                  <TextField
                    size="small"
                    label="State"
                    fullWidth
                    name="state"
                    value={state}
                    helperText={!state ? "State is required" : ""}
                    error={!state ? true : false}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <TextField
                    size="small"
                    label="Zip"
                    fullWidth
                    name="zipCode"
                    helperText={!zip ? "Zip code is required" : ""}
                    error={!zip ? true : false}
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Primary Contact Name"
                  fullWidth
                  name="primaryContactName"
                  value={primaryContactName}
                  helperText={
                    !primaryContactName
                      ? "Primary contact name is required"
                      : ""
                  }
                  error={!primaryContactName ? true : false}
                  onChange={(e) => setPrimaryContactName(e.target.value)}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Primary contact Email"
                  fullWidth
                  name="primaryContact"
                  value={primaryContactEmail}
                  helperText={
                    !primaryContactEmail
                      ? "Primary contact email is required"
                      : ""
                  }
                  error={!primaryContactEmail ? true : false}
                  onChange={(e) => setPrimaryContactEmail(e.target.value)}
                />
              </div>
              <div className="form-row mb-3">
                <MuiPhoneNumber
                  defaultCountry="us"
                  variant="outlined"
                  size="small"
                  label="Office Phone"
                  fullWidth
                  name="officePhone"
                  helperText={!officePhone ? "Office phone is required" : ""}
                  error={!officePhone ? true : false}
                  onChange={(e) => setofficePhone(e)}
                  disableAreaCodes
                  value={officePhone}
                />
              </div>
              <div className="form-row mb-3">
                <div className="text-[12px]">Active Status</div>
                <div className="text-[13px]">
                  <Switch
                    checked={status === 1 ? true : false}
                    onChange={(e) => setStatus(status === 1 ? 0 : 1)}
                    value={status}
                  />
                  Active
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BasicInfo;
