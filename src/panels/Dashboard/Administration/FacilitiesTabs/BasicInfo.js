/* eslint-disable array-callback-return */
// Library Imports
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import MuiPhoneNumber from "material-ui-phone-number";
// Local Imports
import AssetsImages from "../../../../assets/images";
import {
  Button as Lbutton,
  TextField,
  Typography,
  Avatar,
  Alert,
  MuiSwitch,
  MaterialDropdown,
} from "../../../../shared";

const Input = styled("input")({
  display: "none",
});

const BasicInfo = ({
  facilityDetails,
  primaryContacts,
  setFacilityDetails,
  isEmpty,
  setIsEmpty,
  fromEdit,
}) => {
  // To Capture User Selected Image Response
  const handleImgChange = (event) => {
    let file = URL.createObjectURL(event.target.files[0]);
    console.log(
      "🚀 ~ file: PersonalInfo.js ~ line 34 ~ ",
      event.target.files[0].size
    );
    if (event.target.files[0].size > 2e6) {
      setIsEmpty({
        ...isEmpty,
        imageSize: true,
      });
      setFacilityDetails({
        ...facilityDetails,
        profilePic: file,
        profilePicFile: event.target.files[0],
      });
    } else {
      setIsEmpty({
        ...isEmpty,
        imageSize: false,
      });
      setFacilityDetails({
        ...facilityDetails,
        profilePic: file,
        profilePicFile: event.target.files[0],
      });
    }
  };
  // To Rum OnChange Handler Again To Select Same Image
  const onInputClick = (event) => {
    event.target.value = "";
  };

  // To Check Input Not Containing Special Charactrers
  const validateInput = (name, text) => {
    // Only Accept Numbers
    var numbers = /^[0-9+]*$/;
    // Only Accept Characters And Numbers
    var alphaNum = /^[A-Za-z0-9_]*$/;

    if (name === "userName" || name === "zipCode") {
      return alphaNum.test(text);
    } else if (name === "contactNumber") {
      return numbers.test(text);
    } else {
      return true;
    }
  };
  // To Capture Form OnChange
  const handleOnChange = (e) => {
    // Validate User Input
    if (
      validateInput(e.target.name, e.target.value) &&
      e.target.name !== "primaryContactName"
    ) {
      // Setting User Input Into States
      setFacilityDetails({
        ...facilityDetails,
        [e.target.name]: e.target.value,
      });
    }

    // onSelect Primary Contact autofill Email from Primary Contact
    if (e.target.name === "primaryContactName") {
      primaryContacts.map((item) => {
        if (item.full_name === e.target.value) {
          setFacilityDetails({
            ...facilityDetails,
            [e.target.name]: e.target.value,
            email: item.email,
            adminId: item.uuid,
          });
        }
      });
    }

    // Setting State For Is Empty To FALSE
    if (
      e.target.name !== "profilePic" ||
      e.target.name !== "userId" ||
      e.target.name !== "activeStatus"
    ) {
      setIsEmpty({
        ...isEmpty,
        [e.target.name]: false,
        isEmailValid: false,
        showErrorOnTabHeader: false,
      });
    }
  };
  // Office Contact
  const handleOfficePhoneOnChange = (e) => {
    // Setting User Input Into States
    setFacilityDetails({
      ...facilityDetails,
      officePhone: e,
    });

    // Setting State For Is Empty To FALSE
    setIsEmpty({
      ...isEmpty,
      isOfficePhoneValid: false,
      showErrorOnTabHeader: false,
    });
  };

  return (
    <div className="flex flex-col justify-between pt-[20px] px-[20px]">
      <div className="border rounded bg-white pb-0.5">
        <h6 className="px-3 pt-3 pb-1">Basic Information</h6>
        {/* Profile Image Row */}
        <div className="d-flex gap-4 align-items-start mt-2 mb-3 ml-2 p-2">
          <Avatar
            alt={"MA"}
            src={facilityDetails.profilePic}
            className="w-[75px] h-[75px]"
          />
          <div className="d-flex gap-2 flex-column">
            <img alt="" />
            <div className="d-flex gap-2">
              <label htmlFor="icon-button-file">
                <Input
                  accept=".png, .jpg"
                  id="icon-button-file"
                  type="file"
                  onChange={handleImgChange}
                  onClick={onInputClick}
                />
                <Lbutton
                  component="span"
                  color="primary"
                  variant="contained"
                  fullWidth={true}
                  className="capitalize"
                  disabled={false}
                  loading={false}>
                  Upload New Photo
                </Lbutton>
              </label>
              {fromEdit
                ? facilityDetails.profilePic !== AssetsImages.profileImg && (
                    <Lbutton
                      size="medium"
                      className="ml-[20px] mr-[10px] capitalize w-[100px]"
                      component="span"
                      variant="outlined"
                      color="danger"
                      onClick={() => {
                        setFacilityDetails({
                          ...facilityDetails,
                          profilePicFile: "",
                          profilePic: AssetsImages.profileImg,
                        });
                        setIsEmpty({ ...isEmpty, imageSize: false });
                      }}>
                      Remove
                    </Lbutton>
                  )
                : facilityDetails.profilePicFile !== "" && (
                    <Lbutton
                      size="medium"
                      className="ml-[20px] mr-[10px] capitalize w-[100px]"
                      component="span"
                      variant="outlined"
                      color="danger"
                      onClick={() => {
                        setFacilityDetails({
                          ...facilityDetails,
                          profilePicFile: "",
                          profilePic: AssetsImages.profileImg,
                        });
                      }}>
                      Remove
                    </Lbutton>
                  )}
            </div>
            <div className="d-flex">
              <p className="text-secondaryColor text-[12px]">
                JPG or PNG, at least 256px
              </p>
            </div>
            {isEmpty.imageSize && (
              <div>
                <Alert severity="error" icon={false}>
                  <Typography
                    variant="h1"
                    fontSize={13}
                    fontWeight="medium"
                    color={"red"}
                    className="text-[13px] font-medium text-danger">
                    The image must not be greater than 2048 kilobytes.
                  </Typography>
                </Alert>
                {/* <br /> */}
              </div>
            )}
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
                className="text-[13px] font-medium"
                color={"green"}>
                Success
              </Typography>
            </Alert>
          </div>
        )}
        <form className="px-3">
          <div className=" row">
            <div className="form-group col-md-6">
              {fromEdit && (
                <div className="form-row mb-3">
                  <TextField
                    size="small"
                    label="Facility ID"
                    type={"text"}
                    fullWidth
                    helperText={
                      isEmpty.facilityId ? "Facility ID is required" : ""
                    }
                    error={isEmpty.facilityId ? true : false}
                    value={facilityDetails.facilityId}
                    disabled={true}
                    name="facilityID"
                  />
                </div>
              )}
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Facility Name"
                  type={"text"}
                  fullWidth
                  helperText={
                    isEmpty.facilityName ? "Facility name is required" : ""
                  }
                  error={isEmpty.facilityName ? true : false}
                  value={facilityDetails.facilityName}
                  name="facilityName"
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Address"
                  fullWidth
                  helperText={
                    isEmpty.address ? "Facility address is required" : ""
                  }
                  error={isEmpty.address ? true : false}
                  value={facilityDetails.address}
                  name="address"
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="City"
                  fullWidth
                  helperText={isEmpty.city ? "Facility city is required" : ""}
                  error={isEmpty.city ? true : false}
                  value={facilityDetails.city}
                  name="city"
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row row mb-3">
                <div className="col-md-9 mb-3">
                  <TextField
                    size="small"
                    label="State"
                    fullWidth
                    helperText={isEmpty.state ? "State is required" : ""}
                    error={isEmpty.state ? true : false}
                    value={facilityDetails.state}
                    name="state"
                    onChange={handleOnChange}
                  />
                </div>
                <div className="col-md-3">
                  <TextField
                    size="small"
                    label="Zip"
                    fullWidth
                    helperText={isEmpty.zipCode ? "Zip code is required" : ""}
                    error={isEmpty.zipCode ? true : false}
                    value={facilityDetails.zipCode}
                    name="zipCode"
                    onChange={handleOnChange}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-md-6">
              <div className="form-row mb-3 position-relative">
                <MaterialDropdown
                  multiple={false}
                  options={primaryContacts}
                  label="Primary Contact Name"
                  name="primaryContactName"
                  value={facilityDetails.primaryContactName}
                  onChange={handleOnChange}
                  fullWidth
                  error={isEmpty.primaryContactName ? true : false}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Primary contact Email"
                  type={"text"}
                  fullWidth
                  helperText={
                    isEmpty.email
                      ? "Email is required"
                      : isEmpty.isEmailValid
                      ? "Email is not valid"
                      : ""
                  }
                  error={
                    isEmpty.email ? true : isEmpty.isEmailValid ? true : false
                  }
                  value={facilityDetails.email}
                  name="email"
                  disabled={true}
                />
              </div>
              <div className="form-row mb-3">
                <MuiPhoneNumber
                  defaultCountry="us"
                  variant="outlined"
                  size="small"
                  label="Office Phone"
                  fullWidth
                  helperText={
                    isEmpty.officePhone
                      ? "Office phone is required"
                      : isEmpty.isOfficePhoneValid
                      ? "Office phone is not valid"
                      : ""
                  }
                  error={
                    isEmpty.officePhone
                      ? true
                      : isEmpty.isOfficePhoneValid
                      ? true
                      : false
                  }
                  disableAreaCodes
                  value={facilityDetails.officePhone}
                  onChange={handleOfficePhoneOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <div className="text-[12px]">Active Status</div>
                <div className="text-[13px]">
                  <MuiSwitch
                    checked={facilityDetails.activeStatus == 1 ? true : false}
                    onChange={(event) => {
                      setFacilityDetails({
                        ...facilityDetails,
                        activeStatus: event.target.checked ? 1 : 0,
                      });
                    }}
                    value={facilityDetails.activeStatus}
                  />
                  {facilityDetails.activeStatus ? "Active" : "Inactive"}
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
