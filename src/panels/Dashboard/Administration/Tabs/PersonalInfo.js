/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
//Library Imports
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiPhoneNumber from "material-ui-phone-number";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
//Local Imports
import {
  Button,
  Typography,
  Avatar,
  Alert,
  Spinner,
  MaterialDropdown as MaterialDropDown,
  TextField,
  MuiSwitch as Switch,
} from "../../../../shared";
import AssetsImages from "../../../../assets/images";

const Input = styled("input")({
  display: "none",
});

const PersonalInfo = ({
  userRoles,
  userDetails,
  setUserDetails,
  fromEdit,
  isEmpty,
  setIsEmpty,
}) => {
  // To Capture User Selected Image Response
  const handleImgChange = (event) => {
    let file = URL.createObjectURL(event.target.files[0]);
    if (event.target.files[0].size > 2e6) {
      setIsEmpty({
        ...isEmpty,
        imageSize: true,
      });
      setUserDetails({
        ...userDetails,
        profilePic: file,
        profilePicFile: event.target.files[0],
      });
    } else {
      setIsEmpty({
        ...isEmpty,
        imageSize: false,
      });
      setUserDetails({
        ...userDetails,
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
    // Only Accept Characters
    var characters = /^[a-zA-Z]*$/;
    // Only Accept Numbers
    var numbers = /^[0-9+]*$/;
    // Only Accept Characters And Numbers
    var alphaNum = /^[A-Za-z0-9_]*$/;

    if (name === "firstName" || name === "lastName") {
      return characters.test(text);
    } else if (name === "userName" || name === "zipCode") {
      return alphaNum.test(text);
    } else if (name === "contactNumber") {
      return numbers.test(text);
    } else {
      return true;
    }
  };

  // To Capture Form OnChange
  const handleOnChange = (e) => {
    // To Show User Role Value onChange
    if (e.target.name === "userRole") {
      userRoles.map((item) => {
        if (item.uuid === e.target.value) {
          userDetails.userRoleToShow = item.name;
        }
      });
    }

    // Validate User Input
    if (validateInput(e.target.name, e.target.value)) {
      // Setting User Input Into States
      setUserDetails({
        ...userDetails,
        [e.target.name]: e.target.value,
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
  const handlePhoneOncChange = (e) => {
    // Setting User Input Into States
    setUserDetails({
      ...userDetails,
      contactNumber: e,
    });

    // Setting State For Is Empty To FALSE
    setIsEmpty({
      ...isEmpty,
      isContactNumValid: false,
      showErrorOnTabHeader: false,
    });
  };

  return (
    <div className="flex justify-between py-[20px] px-[20px] flex-col bg-bgGray">
      <div className="border rounded bg-white pb-0.5">
        <h6 className="px-3 pt-3 pb-1">Personal Information</h6>
        {/* Profile Image Row */}
        <div className="d-flex gap-4 align-items-start my-4 p-2">
          <Avatar
            alt={"MA"}
            src={userDetails.profilePic}
            sx={{ width: 75, height: 75, ml: 1, mt: -1 }}
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
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  className="capitalize"
                  fullWidth={true}
                  disabled={false}
                  loading={false}>
                  Upload New Photo
                </Button>
              </label>
              {fromEdit
                ? userDetails.profilePic !== AssetsImages.profileImg && (
                    <Button
                      size="medium"
                      className="ml-[5px] mr-[10px] !capitalize w-[100px]"
                      component="span"
                      variant="outlined"
                      color="danger"
                      onClick={() => {
                        setUserDetails({
                          ...userDetails,
                          profilePicFile: "",
                          profilePic: AssetsImages.profileImg,
                        });
                        setIsEmpty({ ...isEmpty, imageSize: false });
                      }}>
                      Remove
                    </Button>
                  )
                : userDetails.profilePicFile !== "" && (
                    <Button
                      size="medium"
                      className="ml-[20px] mr-[10px] !capitalize w-[100px]"
                      component="span"
                      variant="outlined"
                      color="danger"
                      onClick={() => {
                        setUserDetails({
                          ...userDetails,
                          profilePicFile: "",
                          profilePic: AssetsImages.profileImg,
                        });
                      }}>
                      Remove
                    </Button>
                  )}
            </div>
            <div className="flex">
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
                    color="red">
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
                fontSize={13}
                fontWeight="medium"
                color={"green"}>
                Success
              </Typography>
            </Alert>
          </div>
        )}
        {/* User Details Form View Start */}
        <React.Fragment>
          {false ? (
            <div className="min-h-[50vh] flex items-center">
              <Spinner />
            </div>
          ) : (
            <form className="px-3">
              <div className=" row">
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="First Name"
                      type={"text"}
                      fullWidth
                      helperText={
                        isEmpty.firstName ? "First Name is required" : ""
                      }
                      error={isEmpty.firstName ? true : false}
                      value={userDetails.firstName}
                      name="firstName"
                      onChange={handleOnChange}
                    />
                  </div>
                  {fromEdit && (
                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="User ID"
                        fullWidth
                        disabled={userDetails.userId ? true : false}
                        value={userDetails.userId ? userDetails.userId : null}
                        name="userId"
                      />
                    </div>
                  )}
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="User Name"
                      fullWidth
                      name="userName"
                      value={userDetails.userName}
                      helperText={
                        isEmpty.userName ? "User Name is required" : ""
                      }
                      error={isEmpty.userName ? true : false}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3 position-relative">
                    <MaterialDropDown
                      multiple={false}
                      // className="z-20"
                      options={userRoles}
                      label="User Role"
                      name="userRole"
                      value={userDetails.userRoleToShow}
                      userRoleToShow={userDetails.userRoleToShow}
                      withRenderValue
                      onChange={handleOnChange}
                      fullWidth
                      error={isEmpty.userRole ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Email"
                      type="email"
                      name="email"
                      fullWidth
                      value={userDetails.email}
                      helperText={
                        isEmpty.email
                          ? "Email is required"
                          : isEmpty.isEmailValid
                          ? "Email is not valid"
                          : ""
                      }
                      error={
                        isEmpty.email
                          ? true
                          : isEmpty.isEmailValid
                          ? true
                          : false
                      }
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MuiPhoneNumber
                      defaultCountry="us"
                      variant="outlined"
                      size="small"
                      label="Contact Number"
                      fullWidth
                      name="contactNumber"
                      helperText={
                        isEmpty.contactNumber
                          ? "ContactNumber is required"
                          : isEmpty.isContactNumValid
                          ? "Contact number is not valid"
                          : ""
                      }
                      error={
                        isEmpty.contactNumber
                          ? true
                          : isEmpty.isContactNumValid
                          ? true
                          : false
                      }
                      disableAreaCodes
                      value={userDetails.contactNumber}
                      onChange={handlePhoneOncChange}
                    />
                    {/* <TextField
                      size="small"
                      label="Contact Number"
                      fullWidth
                      name='contactNumber'
                      value={userDetails.contactNumber}
                      helperText={
                        isEmpty.contactNumber
                          ? "ContactNumber is required"
                          : ""
                      }
                      error={
                        isEmpty.contactNumber ? true : false
                      }
                      onChange={handleOnChange}
                    /> */}
                  </div>
                </div>
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Last Name"
                      fullWidth
                      helperText={
                        isEmpty.lastName ? "Last Name is required" : ""
                      }
                      error={isEmpty.lastName ? true : false}
                      value={userDetails.lastName}
                      name="lastName"
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Address"
                      fullWidth
                      name="address"
                      value={userDetails.address}
                      onChange={handleOnChange}
                      helperText={isEmpty.address ? "Address is required" : ""}
                      error={isEmpty.address ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="City"
                      fullWidth
                      name="city"
                      value={userDetails.city}
                      onChange={handleOnChange}
                      helperText={isEmpty.city ? "City is required" : ""}
                      error={isEmpty.city ? true : false}
                    />
                  </div>
                  <div className="form-row row mb-3">
                    <div className="col-md-8 mb-3">
                      <TextField
                        size="small"
                        label="State"
                        fullWidth
                        name="state"
                        value={userDetails.state}
                        helperText={isEmpty.state ? "State is required" : ""}
                        error={isEmpty.state ? true : false}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <TextField
                        size="small"
                        label="Zip"
                        fullWidth
                        name="zipCode"
                        helperText={
                          isEmpty.zipCode ? "zipCode is required" : ""
                        }
                        error={isEmpty.zipCode ? true : false}
                        value={userDetails.zipCode}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="form-row mb-3">
                      <div className="ml-1 text-[13px]">Active Status</div>
                      <div className="-mt-2 -ml-[9px] text-[13px]">
                        <Switch
                          checked={userDetails.activeStatus == 1 ? true : false}
                          onChange={(event) => {
                            setUserDetails({
                              ...userDetails,
                              activeStatus: event.target.checked,
                            });
                          }}
                          value={userDetails.activeStatus}
                        />
                        {userDetails.activeStatus ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </React.Fragment>
      </div>
    </div>
  );
};
export default PersonalInfo;
