import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { useSearchParams, useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import ClearIcon from "@mui/icons-material/Clear";
import Avatar from "@mui/material/Avatar";
import { useSelector, useDispatch } from "react-redux";

import {
  Button,
  TextField,
  Typography,
  DatePicker,
  CustomModal,
  Alert,
  Spinner,
  RadioButton,
} from "../../../../shared";
import { primaryColor } from "../../../../helpers/GlobalVariables.js";
import {
  changeUserEmailApi,
  deleteUserProfilePictureApi,
  getUserProfileInformationApi,
  updateUserProfileInformationApi,
  updateUserProfilePictureApi,
  verifyChangeUserEmailApi,
} from "../../../../api/profileSettingApi";
import { logoutUser } from "../../../../helpers/GlobalMethods";
import {
  userImageRemove,
  userImageSuccess,
} from "../../../../redux/users/user.actions.js";

const Input = styled("input")({
  display: "none",
});

const PersonalInfo = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [editEmailModal, setEditEmailModal] = useState(false);
  const [emailSentModal, setEmailSentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(
    user?.userInfo?.profile_pic ? user?.userInfo?.profile_pic[0]?.url : ""
  );
  const [userProfileInformation, setUserProfileInformation] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    hireDate: "",
    releaseDate: "",
    jobTitle: "",
    email: "",
    department: "",
    address: "",
    city: "",
    birthDate: "",
    state: "",
    zip_code: "",
    shift: "full",
    supervisorName: "",
  });
  const [editEmailError, seteditEmailError] = useState(null);
  const [success, setsuccess] = useState(false);
  const [error, seterror] = useState(null);
  useEffect(() => {
    if (
      params.get("email") !== null &&
      params.get("email").length > 1 &&
      params.get("token").length > 1
    ) {
      setNewUserEmail();
    }
    getUserProfileInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the alert will be hidden
      setsuccess(false);
      seterror(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [success, error]);
  const openEditEmailModal = () => {
    closeEmailSentModal();
    setEditEmailModal(true);
  };

  const closeEditEmailModal = () => setEditEmailModal(false);

  const openEmailSentModal = () => {
    closeEditEmailModal();
    setEmailSentModal(true);
  };
  const closeEmailSentModal = () => {
    setEmailSentModal(false);
  };

  const getUserProfileInformation = async () => {
    setPageLoading(true);
    const { data } = await getUserProfileInformationApi();
    setPageLoading(false);
    userProfileInformationSuccessfulResponse(data.data.user || {});
  };

  const userProfileInformationSuccessfulResponse = (data) => {
    setUserProfileInformation({
      firstName: data.fname || "",
      lastName: data.lname || "",
      phoneNumber: data.phone || "",
      hireDate: data.hire_date || "",
      releaseDate: data.release_date || "",
      jobTitle: data.job_title || "Job Title",
      email: data.email || "",
      department: data.department || "Department",
      address: data.address || "",
      city: data.city || "",
      birthDate: data.birth_date || "",
      state: data.state || "",
      zip_code: data.zip_code || "",
      shift: data.shift === "null" ? "full" : data.shift || "full",
      supervisorName: data.supervisor_name || "Supervisor",
    });
  };

  const handleOnChange = (e) => {
    setUserProfileInformation({
      ...userProfileInformation,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e, name) => {
    setUserProfileInformation({
      ...userProfileInformation,
      [name]: e,
    });
  };

  // const validateFields = (obj) => {
  //   for (let key in obj) {
  //     if (key !== "supervisorName") {
  //       if (obj[key] === null || obj[key] === "") {
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // };

  const saveButtonClicked = async () => {
    // if (!validateFields(userProfileInformation)) {
    //   seterror("All fields are required");
    //   return;
    // }
    setsuccess("");
    seterror("");
    try {
      const formData = new FormData();
      // const dateString = dayjs(userProfileInformation.hireDate).format(
      //   "DD-MM-YYYY"
      // );
      formData.append("fname", userProfileInformation.firstName || "");
      formData.append("lname", userProfileInformation.lastName || "");
      formData.append("phone", userProfileInformation.phoneNumber || "");
      formData.append(
        "hire_date",
        dayjs(userProfileInformation.hireDate).format("YYYY-MM-DD") || ""
      );
      formData.append(
        "release_date",
        dayjs(userProfileInformation.releaseDate).format("YYYY-MM-DD") || ""
      );
      formData.append("job_title", userProfileInformation.jobTitle || "");
      formData.append("email", userProfileInformation.email || "");
      formData.append("department", userProfileInformation.department || "");
      formData.append("address", userProfileInformation.address || "");
      formData.append("city", userProfileInformation.city || "");
      formData.append(
        "birth_date",
        dayjs(userProfileInformation.birthDate).format("YYYY-MM-DD") || ""
      );
      formData.append("state", userProfileInformation.state || "");
      formData.append(
        "supervisor_name",
        userProfileInformation.supervisorName || ""
      );
      formData.append("shift", userProfileInformation.shift || "");
      formData.append("zip", userProfileInformation.zip_code || "");

      await updateUserProfileInformationApi(formData);
      setsuccess("Saved Successfully");
    } catch (error) {
      seterror("All Fields are required. Double check all");
    }
  };

  const uploadProfilePicture = async (e) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      await updateUserProfilePictureApi(formData).then((res) => {
        setProfilePic(res?.data?.data?.profile_pic?.url);
        dispatch(userImageSuccess(res?.data?.data?.profile_pic?.url));
      });
      setLoading(false);
      setsuccess("Profile picture uploaded successfully");
      e.target.value = "";
      setLoading(false);
    } catch (error) {
      setLoading(false);
      seterror(error.response.data.message);
    }
  };

  const deleteProfilePicture = async () => {
    try {
      await deleteUserProfilePictureApi();
      setProfilePic("");
      dispatch(userImageRemove());
      seterror("Profile picture removed successfully");
    } catch (error) {}
  };

  const handleChangeEmail = (e) => {
    seteditEmailError(null);
    setNewEmail(e.target.value);
  };

  const sendEmailButtonClicked = async () => {
    if (!newEmail) {
      seteditEmailError("Email is required");
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newEmail)) {
      seteditEmailError("Email is invalid");
      return;
    }

    try {
      const payload = {
        email: newEmail,
        url: window.location.origin + "/profile",
      };
      setEmailChangeLoading(true);
      const { data } = await changeUserEmailApi(payload);

      changeUserEmailSentSuccessfully(data);
      setEmailChangeLoading(false);
    } catch (error) {
      setEmailChangeLoading(false);

      if (error.response.status === 422) {
        let { data = {} } = error.response || {};
        let arr = [];
        if (data.errors && data.errors) {
          for (let e of Object.values(data.errors)) {
            arr.push(e[0]);
          }
        }
        seteditEmailError(arr.toString());
      }
    }
  };

  const changeUserEmailSentSuccessfully = (data) => {
    if (data.success) {
      openEmailSentModal();
    }
  };

  const setNewUserEmail = async () => {
    try {
      const payload = {
        token: params.get("token"),
        email: params.get("email"),
      };
      await verifyChangeUserEmailApi(payload);
      await logoutUser();
      navigate("/");
    } catch (error) {}
  };

  return (
    <>
      <div className="mh-100">
        <b>
          <h6>Personal Information</h6>
        </b>
        <div className="d-flex gap-4 align-items-start my-4">
          <Avatar
            alt={"User Profile"}
            src={profilePic}
            sx={{ width: 75, height: 75 }}
          />

          <div className="d-flex gap-2 flex-column">
            <img alt="" />
            <div className="d-flex gap-2">
              <label htmlFor="icon-button-file">
                <Input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  onChange={(e) => uploadProfilePicture(e)}
                />
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  fullWidth={true}
                  className="normal-case"
                  disabled={false}
                  loading={loading}>
                  Upload New Photo
                </Button>
              </label>
              {user.image_url && (
                <Button
                  className={
                    "normal-case py-[5px] px-5 text-danger border border-danger bg-white"
                  }
                  onClick={deleteProfilePicture}>
                  Remove
                </Button>
              )}
            </div>
            <div className="d-flex">
              <p className="text-secondaryColor text-xs">
                JPG or PNG, at least 256px
              </p>
            </div>
          </div>
        </div>
        {success && (
          <div className="mb-3 mt-3">
            <Alert
              severity="success"
              icon={false}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setsuccess(false);
                  }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"green"}>
                {success}
              </Typography>
            </Alert>
            {/* <br /> */}
          </div>
        )}
        {error && (
          <div className="mb-3 mt-3">
            <Alert
              severity="error"
              icon={false}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    seterror(false);
                  }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }>
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"red"}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      seterror(false);
                    }}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }>
                {error}
              </Typography>
            </Alert>
            {/* <br /> */}
          </div>
        )}
        <>
          {pageLoading ? (
            <div
              className="flex items-center"
              style={{
                minHeight: "50vh",
              }}>
              <Spinner />
            </div>
          ) : (
            <form>
              <div className=" row">
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      label="First Name"
                      fullWidth
                      size="small"
                      helperText={
                        userProfileInformation.firstName === ""
                          ? "First Name is required"
                          : ""
                      }
                      error={
                        userProfileInformation.firstName === "" ? true : false
                      }
                      value={userProfileInformation.firstName}
                      name="firstName"
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      label="Last Name"
                      fullWidth
                      size="small"
                      value={userProfileInformation.lastName || ""}
                      name="lastName"
                      helperText={
                        userProfileInformation.lastName === ""
                          ? "Last Name is required"
                          : ""
                      }
                      error={
                        userProfileInformation.lastName === "" ? true : false
                      }
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      label="Phone"
                      fullWidth
                      size="small"
                      name="phoneNumber"
                      helperText={
                        userProfileInformation.phoneNumber === ""
                          ? "Phone is required"
                          : ""
                      }
                      error={
                        userProfileInformation.phoneNumber === "" ? true : false
                      }
                      value={userProfileInformation.phoneNumber || ""}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="form-row mb-3 position-relative">
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      size="small"
                      disabled={true}
                      value={userProfileInformation.email || ""}
                    />
                    <EditIcon
                      className="position-absolute w-[15px] h-[15px] text-secondaryColor cursor-pointer top-[13px] right-[15px]"
                      onClick={openEditEmailModal}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      label="Address"
                      fullWidth
                      size="small"
                      name="address"
                      helperText={
                        userProfileInformation.address === ""
                          ? "Address is required"
                          : ""
                      }
                      error={
                        userProfileInformation.address === "" ? true : false
                      }
                      onChange={handleOnChange}
                      value={userProfileInformation.address || ""}
                    />
                  </div>
                  <div className="form-row row mb-3">
                    <div className="col-md-8 mb-3">
                      <TextField
                        label="State"
                        fullWidth
                        size="small"
                        name="state"
                        helperText={
                          userProfileInformation.state === ""
                            ? "State is required"
                            : ""
                        }
                        error={
                          userProfileInformation.state === "" ? true : false
                        }
                        value={userProfileInformation.state || ""}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <TextField
                        label="Zip"
                        fullWidth
                        size="small"
                        name="zip_code"
                        helperText={
                          userProfileInformation.zip_code === ""
                            ? "Zip is required"
                            : ""
                        }
                        error={
                          userProfileInformation.zip_code === "" ? true : false
                        }
                        value={userProfileInformation.zip_code || ""}
                        onChange={handleOnChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group col-md-6">
                  <div className="form-row mb-3 -mt-[0.145rem]">
                    <DatePicker
                      label="Hire Date"
                      className="col"
                      fullWidth
                      size="small"
                      onChange={(e) => handleDateChange(e, "hireDate")}
                      name="hireDate"
                      helperText={
                        userProfileInformation.hireDate
                          ? ""
                          : "Hire Date is required"
                      }
                      color={
                        userProfileInformation.hireDate ? "primary" : "error"
                      }
                      error={userProfileInformation.hireDate ? false : true}
                      value={userProfileInformation.hireDate}
                    />
                  </div>

                  {/* <div className="form-row mb-3">
                    <DatePicker
                      label="Release Date"
                      className="col"
                      fullWidth
                      size="small"
                      name="releaseDate"
                      helperText={
                        userProfileInformation.releaseDate
                          ? ""
                          : "Release Date is required"
                      }
                      color={
                        userProfileInformation.releaseDate ? "primary" : "error"
                      }
                      error={userProfileInformation.releaseDate ? true : false}
                      onChange={(e) => handleDateChange(e, "releaseDate")}
                      value={userProfileInformation.releaseDate}
                    />
                  </div> */}

                  <div className="form-row mb-3 -mt-[0.145rem]">
                    <TextField
                      label="Job Title"
                      fullWidth
                      size="small"
                      disabled={true}
                      name="jobTitle"
                      // onChange={handleOnChange}
                      value={userProfileInformation.jobTitle || ""}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      label="Department"
                      fullWidth
                      size="small"
                      name="department"
                      disabled={true}
                      // onChange={handleOnChange}
                      value={userProfileInformation.department || ""}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      inputProps={{ style: { color: primaryColor } }}
                      label="Supervisor Name"
                      fullWidth
                      size="small"
                      disabled={true}
                      name="supervisorName"
                      // onChange={handleOnChange}
                      value={userProfileInformation.supervisorName || ""}
                    />
                  </div>

                  <div className="form-row mb-3">
                    <TextField
                      label="City"
                      fullWidth
                      size="small"
                      name="city"
                      helperText={
                        userProfileInformation.city === ""
                          ? "City is required"
                          : ""
                      }
                      error={userProfileInformation.city === "" ? true : false}
                      value={userProfileInformation.city || ""}
                      onChange={handleOnChange}
                    />
                  </div>

                  {/* <div className="form-row mb-1">
                    <DatePicker
                      label="Birth Date"
                      fullWidth
                      size="small"
                      name="birthDate"
                      helperText={
                        userProfileInformation.birthDate
                          ? ""
                          : "Birth Date is required"
                      }
                      color={
                        userProfileInformation.birthDate ? "primary" : "error"
                      }
                      error={userProfileInformation.birthDate ? true : false}
                      onChange={(e) => handleDateChange(e, "birthDate")}
                      value={userProfileInformation.birthDate || ""}
                    />
                  </div> */}

                  <div className="form-row mb-3 pt-2 ml-2">
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        className="flex gap-3 items-center pl-2.5"
                        name="shift"
                        defaultValue={true}
                        value={userProfileInformation.shift}
                        onChange={handleOnChange}>
                        <FormControlLabel
                          value="full"
                          control={
                            <RadioButton
                              label="Full Time"
                              checked={true}
                              className={
                                "flex items-center gap-2 cursor-pointer"
                              }
                            />
                          }
                        />
                        <FormControlLabel
                          value="part"
                          control={
                            <RadioButton
                              label="Part Time"
                              className={
                                "flex items-center gap-2 cursor-pointer"
                              }
                            />
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
              </div>

              <div className="buttons d-flex gap-3 justify-content-end">
                <Button
                  className={"text-capitalize"}
                  color="secondary"
                  variant="outlined"
                  startIcon={
                    <PrintIcon
                      className="text-secondaryColor "
                      fontSize="small"
                    />
                  }>
                  Print As
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={"w-28 text-capitalize"}
                  onClick={saveButtonClicked}>
                  Save
                </Button>
              </div>
            </form>
          )}
        </>
      </div>

      <CustomModal
        open={editEmailModal}
        close={closeEditEmailModal}
        title="Change Email"
        padding={2}
        width={600}
        icon={<EditIcon fontSize="20px" color="primary" />}>
        <form>
          <div
            className="pointer position-absolute top-3 right-5"
            onClick={closeEditEmailModal}>
            <ClearIcon color="secondary" fontSize="20px" />
          </div>
          <div className="d-flex gap-3 flex-column">
            <Typography id="modal-modal-description" fontSize={13}>
              A confirmation email with an activation link will be send to your
              new email address. Changes will be applied only after you click
              confirmation links.
            </Typography>
            {editEmailError && (
              <div className="mb-3 mt-3">
                <Alert severity="error" icon={false}>
                  <Typography
                    variant="h1"
                    fontSize={13}
                    fontWeight="medium"
                    color={"error"}>
                    {editEmailError}
                  </Typography>
                </Alert>
              </div>
            )}
            <TextField
              label="New Email Address"
              type="email"
              fullWidth
              size="small"
              error={editEmailError}
              onChange={handleChangeEmail}
            />

            <div className="buttons d-flex gap-3 justify-content-end">
              <Button
                color="secondary"
                variant="outlined"
                className={"normal-case"}
                onClick={() => closeEditEmailModal()}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={"normal-case"}
                loading={emailChangeLoading}
                onClick={sendEmailButtonClicked}>
                Send Link
              </Button>
            </div>
          </div>
        </form>
      </CustomModal>
      <CustomModal
        open={emailSentModal}
        close={closeEmailSentModal}
        title="Activation Link"
        padding={2}
        width={600}
        icon={<CheckCircleIcon color="success" />}>
        <>
          <div
            className="pointer position-absolute top-3 right-5"
            onClick={closeEmailSentModal}>
            <ClearIcon color="secondary" fontSize="20px" />
          </div>
          <Typography id="modal-modal-description" fontSize={13}>
            We have sent a confirmation email with an activation link to{" "}
            <span className="text-primaryColor">{newEmail}</span>. Please check
            your email
          </Typography>

          <div className="buttons d-flex gap-3 justify-content-end">
            <Button
              color="secondary"
              variant="outlined"
              className={"mr-1 normal-case text-[13px]"}
              onClick={() => closeEmailSentModal()}>
              Close
            </Button>
          </div>
        </>
      </CustomModal>
    </>
  );
};
export default PersonalInfo;
