// Library Imports
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { phone as phonevalidator } from "phone";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Error from "@mui/icons-material/Error";
import { Add, Delete, Edit } from "@mui/icons-material";
// Local Imports
import BasicInfo from "./FacilitiesTabs/BasicInfo";
import Users from "./FacilitiesTabs/Users";
import Settings from "./FacilitiesTabs/Settings";
import {
  Box,
  Typography,
  Alert,
  BreadCrumb,
  Button,
  Spinner as InsideSpinner,
  TextField,
  CustomModal,
} from "../../../shared";
import * as Selectors from "../../../redux/administration/selectors";
import * as Actions from "../../../redux/administration/actions";

import {
  addUsersInFacilities,
  deleteFacility,
  getFacilityUsers,
} from "../../../api/administratorApi";
import {
  addNewFacility,
  addNewFacility_ProfileImg,
  editFacility,
  getPrimaryContacts,
} from "../../../api/administrationFacilitiesApi";
import AssetsImages from "../../../assets/images";
import "../../Dashboard/Administration/administration.module.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ height: window.innerHeight * 0.86 }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <>{children}</>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AddNewFacility = () => {
  // Hooks
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const { state } = useLocation();
  const singleFacilityDetails = state?.facility;

  // Values From Params
  let { id } = useParams();

  // All Users List
  const usersList = Selectors.GetUsers();

  // facility States
  const [facilityUsers, setFacilityUsers] = useState([]);
  const [primaryContacts, setPrimaryContacts] = useState([]);

  // States For Users
  const [selectedUsers, setSelectedUsers] = useState();
  const [selectedUsersUUID, setSelectedUsersUUID] = useState([]);

  // States For Main Screen
  const [value, setValue] = useState(0);
  const [isDelete, setIsDelete] = useState(0);
  const facilityLoading = Selectors.GetFaciltiesLoading();
  const [loading, setLoading] = useState(false);

  // Error Message Modal
  const [alertModal, setAlertModal] = useState(false);
  const [errorObj, setErrorMsg] = useState({ type: "", title: "", msg: "" });

  // Delete Facility Modal
  const [facilityName, setFacilityName] = useState();
  const [facilityNameErr, setFacilityNameErr] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  // Handle Tabs OnChange
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // UseEffect
  useEffect(() => {
    if (id) {
      let id = state?.facility?.uuid;
      getFacilityUsers(id)
        .then((res) => {
          let obj = res?.data?.data?.users?.map((item, index) => {
            return (item = { ...item, id: index + 1 });
          });
          setFacilityUsers(obj);
          setSelectedUsers(obj);
        })
        .catch((error) => {
          if (error?.response) {
            setAlertModal(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: error?.response?.data?.message,
            });
          } else {
            setAlertModal(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: "Oops! Something went wrong.",
            });
          }
        });
    }
    getPrimaryContacts()
      .then((res) => {
        setPrimaryContacts(res.data.data.facility_admins);
      })
      .catch((error) => {
        if (error?.response) {
          setAlertModal(true);
          setErrorMsg({
            type: "error",
            title: "Error",
            msg: error?.response?.data?.message,
          });
        } else {
          setAlertModal(true);
          setErrorMsg({
            type: "error",
            title: "Error",
            msg: "Oops! Something went wrong.",
          });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // States For Facilities Input Fields
  const [facilityDetails, setFacilityDetails] = useState({
    profilePic:
      id && state?.facility?.facility?.profile_pic
        ? state?.facility?.facility?.profile_pic
        : AssetsImages?.profileImg,
    profilePicFile: "",
    facilityId: id && state.id ? state.id : "",
    facilityName: id ? singleFacilityDetails?.name : "",
    address: id ? singleFacilityDetails?.address : "",
    city: id ? singleFacilityDetails?.city : "",
    state: id ? singleFacilityDetails?.state : "",
    zipCode: id ? singleFacilityDetails?.zip : "",
    primaryContactName: id ? singleFacilityDetails?.primary_contact?.name : "",
    email: id ? singleFacilityDetails?.primary_contact?.email : "",
    officePhone: id ? singleFacilityDetails?.primary_contact?.phone : "",
    activeStatus: id ? singleFacilityDetails?.status : 0,
    adminId: id ? singleFacilityDetails?.primary_contact?.uuid : "",
    uuid: id ? singleFacilityDetails?.uuid : "",
  });
  // For Facilities Error State
  const [isEmpty, setIsEmpty] = useState({
    facilityName: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    primaryContactName: false,
    email: false,
    isEmailValid: false,
    officePhone: false,
    isOfficePhoneValid: false,
    showErrorOnTabHeader: false,
    imageSize: false,
  });

  // ***** START METHODS FOR BUTTONS FROM ADD NEW USER LINKED SCREENS LIKE PERSONAL-INFO, PERMISSIONS AND FACILITIES

  // For Validating Email
  const validateEmail = (email) => {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
  };
  // For Validating Input Fields => Not Empty Check
  const isFacilityDetailsEmpty = () => {
    let isContactValid = (contact) => phonevalidator(contact).isValid;

    if (facilityDetails.facilityName === "") {
      setIsEmpty({
        ...isEmpty,
        facilityName: true,
        showErrorOnTabHeader: true,
      });
      return true;
    } else if (facilityDetails.address === "") {
      setIsEmpty({ ...isEmpty, address: true, showErrorOnTabHeader: true });
      return true;
    } else if (facilityDetails.city === "") {
      setIsEmpty({ ...isEmpty, city: true, showErrorOnTabHeader: true });
      return true;
    } else if (facilityDetails.state === "") {
      setIsEmpty({ ...isEmpty, state: true, showErrorOnTabHeader: true });
      return true;
    } else if (facilityDetails.zipCode === "") {
      setIsEmpty({ ...isEmpty, zipCode: true, showErrorOnTabHeader: true });
      return true;
    } else if (facilityDetails.primaryContactName === "") {
      setIsEmpty({
        ...isEmpty,
        primaryContactName: true,
        showErrorOnTabHeader: true,
      });
      return true;
    } else if (facilityDetails.primaryContactPhone === "") {
      setIsEmpty({
        ...isEmpty,
        primaryContactPhone: true,
        showErrorOnTabHeader: true,
      });
      return true;
    } else if (facilityDetails.officePhone === "") {
      setIsEmpty({ ...isEmpty, officePhone: true, showErrorOnTabHeader: true });
      return true;
    } else if (!isContactValid(facilityDetails.officePhone)) {
      setIsEmpty({
        ...isEmpty,
        isOfficePhoneValid: true,
        showErrorOnTabHeader: true,
      });
      return true;
    } else {
      return false;
    }
  };
  // OnClick Add Facility / Edit Facility Button
  const onPressAddOrEditFacility = () => {
    // For Add New Facility from Basic Information
    if (value === 0 && !id) {
      setLoading(true);
      console.log(
        "%cFrom Basic-Info Add Facility",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      addNewFacilityPress();
    }
    // For Edit Existing Facility from Basic Information
    else if (value === 0 && id) {
      setLoading(true);
      console.log(
        "%cFrom Basic-Info Edit Facility",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      editFacilityPress();
    }
    // For Add New Facility from Users
    else if (value === 1 && !id) {
      setLoading(true);
      console.log(
        "%cFrom Users Add Facility",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      addNewFacilityPress();
    }
    // For  Edit Existing Facility from Users
    else if (value === 1 && id) {
      setLoading(true);
      console.log(
        "%cFrom Users Edit Facility",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      editFacilityPress();
    }
    // For Add New Facility from Settings
    else if (value === 2 && !id) {
      setLoading(true);
      console.log(
        "%cFrom Settings Add Facility",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      addNewFacilityPress();
    }
    // For  Edit Existing Facility from Settings
    else if (value === 2 && id) {
      setLoading(true);
      console.log(
        "%cFrom Settings Edit Facility",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      editFacilityPress();
    }
  };
  // OnClick from Add New Facility Screen => Add Facility Button
  const addNewFacilityPress = () => {
    if (!isFacilityDetailsEmpty()) {
      let payload = createPayload();
      addNewFacility(payload)
        .then(async (res) => {
          let uuid = res.data.data.facility.uuid;
          // For Uploading Image
          if (facilityDetails.profilePicFile !== "") {
            let formData = new FormData();
            formData.append("facility_id", uuid);
            formData.append("image", facilityDetails.profilePicFile);

            await addNewFacility_ProfileImg(formData).then((res) => {});
          }
          // For Adding Users
          if (selectedUsersUUID.length > 0) {
            let payload = {
              user_ids: selectedUsersUUID.map((id) => id),
              facility_ids: [uuid],
              type: "single",
            };
            addUsersInFacilities(payload).then((res) => {
              console.log("🚀 ~ file: AddNewFacility.js ~ line 275 ~ res", res);
            });
          }
          navigate("/administration/facilities");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          const errorUsername = err?.response?.data?.errors?.name;
          setErrorMsg({ type: "error", title: "Error", msg: errorUsername });
        });
    } else {
      setLoading(false);
    }
  };
  // OnClick from Add New Facility Screen For Editing the Existing Facility => Edit Facility Button
  const editFacilityPress = async () => {
    if (!isFacilityDetailsEmpty()) {
      let payload = createPayload();

      await editFacility(payload)
        .then(async (res) => {
          let uuid = res.data.data.facility.uuid;
          // For Uploading / Removing Image
          if (facilityDetails.profilePic === AssetsImages.profileImg) {
            let formData = new FormData();
            formData.append("facility_id", uuid);
            formData.append("image", facilityDetails.profilePicFile);

            await addNewFacility_ProfileImg(formData).then((res) => {});
          } else if (facilityDetails.profilePicFile !== "") {
            let formData = new FormData();
            formData.append("facility_id", uuid);
            formData.append("image", facilityDetails.profilePicFile);

            await addNewFacility_ProfileImg(formData).then((res) => {});
          }
          // For Adding Users
          if (selectedUsersUUID) {
            let payload = {
              user_ids: selectedUsersUUID.map((id) => id),
              facility_ids: [uuid],
              type: "single",
            };
            addUsersInFacilities(payload).then((res) => {
              console.log("🚀 ~ file: AddNewFacility.js ~ line 275 ~ res", res);
            });
          }
          navigate("/administration/facilities");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          const errorUsername = err?.response?.data?.errors?.name;
          setErrorMsg({ type: "error", title: "Error", msg: errorUsername });
        });
    } else {
      setLoading(false);
    }
  };
  // For Creating Payload
  const createPayload = () => {
    return {
      name: facilityDetails.facilityName,
      primary_contact_name: facilityDetails.primaryContactName,
      address: facilityDetails.address,
      primary_contact_email: facilityDetails.email,
      city: facilityDetails.city,
      state: facilityDetails.state,
      zip_code: facilityDetails.zipCode,
      office_phone: facilityDetails.officePhone,
      status: facilityDetails.activeStatus,
      admin_id: facilityDetails.adminId,
      uuid: facilityDetails.uuid,
    };
  };
  // OnClick Delete Facility
  const handleDelete = () => {
    console.log(
      "%cFrom Basic-Info Delete Facility",
      "color: Red; font-family:sans-serif; font-size: 20px; font-weight: 700"
    );
    setDeleteLoading(true);
    if (state?.facility?.name === facilityName) {
      deleteFacility(state?.facility?.uuid)
        .then((res) => {
          dispatch(Actions.getFacilities());
          setDeleteLoading(false);
          setIsDelete(!isDelete);
          navigate("/administration/facilities");
        })
        .catch((err) => {
          setDeleteLoading(false);
          setShowError(err?.response?.data?.message);
        });
    } else {
      setFacilityNameErr(true);
      setDeleteLoading(false);
    }
  };
  // METHODS FOR BUTTONS FROM ADD NEW USER LINKED SCREENS LIKE PERSONAL-INFO, PERMISSIONS AND FACILITIES END ***** //

  const Buttons = () => {
    return (
      <div
        className={`flex mt-[20px] py-[20px] border-t-[1px] border-lightGray ${
          id ? "justify-content-between" : "justify-content-end"
        } bg-white`}>
        {id && (
          <Button
            size="medium"
            className="ml-[20px] mr-[10] capitalize w-[130px]"
            component="span"
            variant="outlined"
            color="danger"
            onClick={() => {
              setIsDelete(!isDelete);
            }}>
            Delete Facility
          </Button>
        )}
        <div className="buttons d-flex">
          <Button
            size="medium"
            className="mr-[10px] capitalize w-[100px]"
            component="span"
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/administration/facilities")}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="mr-[20px] capitalize w-[120px]"
            component="span"
            color="primary"
            variant="contained"
            onClick={onPressAddOrEditFacility}
            loading={loading}
            disabled={loading}>
            {id ? "Save" : "Add Facility"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {facilityLoading ? (
        <InsideSpinner />
      ) : (
        <React.Fragment>
          {/* For Showing Delete Modal */}
          <CustomModal
            open={alertModal}
            close={() => setAlertModal(!alertModal)}
            width={window.innerWidth * 0.4}>
            <div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="d-flex flex-row justify-content-between align-items-center text-center">
                  <div className="pointer">
                    <Error
                      className="mx-3 mb-1"
                      color="danger"
                      fontSize="small"
                    />
                  </div>
                  {errorObj.title}
                </div>
                <div
                  className="pointer mx-3"
                  onClick={() => setAlertModal(!alertModal)}>
                  <ClearIcon color="secondary" fontSize="small" />
                </div>
              </div>
              <div className="my-3">
                <Typography
                  className="d-flex flex-row align-items-center text-[15px] mb-[1px] mt-[3px] ml-[3px] font-light"
                  variant="body1">
                  {errorObj.msg}
                </Typography>
                <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                  <Button
                    className="capitalize mr-[10px]"
                    component="span"
                    variant="outlined"
                    color="secondary"
                    onClick={() => setAlertModal(false)}
                    disabled={loading}>
                    {"Ok"}
                  </Button>
                </div>
              </div>
            </div>
          </CustomModal>
          {/* Delete User Modal */}
          <CustomModal
            open={isDelete}
            close={() => {
              setIsDelete(!isDelete);
              setShowError("");
              setFacilityName("");
            }}
            width={window.innerWidth * 0.4}>
            <div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="d-flex flex-row justify-content-between align-items-center text-center">
                  <div className="pointer">
                    <Delete
                      className="mx-3 mb-1"
                      color="danger"
                      fontSize="small"
                    />
                  </div>
                  Delete Facility
                </div>
                <div
                  className="pointer mx-3"
                  onClick={() => {
                    setIsDelete(!isDelete);
                    setShowError("");
                    setFacilityName("");
                  }}>
                  <ClearIcon color="secondary" fontSize="small" />
                </div>
              </div>
              <div className="my-3 mx-4">
                <Alert severity="error" icon={true}>
                  <Typography
                    variant="body1"
                    className="text-[15px] font-light text-danger">
                    This action is irreversible. Are you sure you want to delete
                    this facility?
                  </Typography>
                </Alert>
              </div>
              <div className="my-3 ">
                <Typography
                  className="d-flex flex-row align-items-center text-[15px] mb-[3px] mt-[3px] ml-6 font-light"
                  variant="body1">
                  Before you can delete facility, please enter the name of
                  facility below:
                </Typography>
                <div className="form-row mx-4">
                  <TextField
                    label="Facility Name"
                    type="text"
                    fullWidth
                    helperText={
                      facilityNameErr ? "Facility Name not matched" : ""
                    }
                    error={facilityNameErr ? true : false}
                    value={facilityName}
                    name="facilityName"
                    onFocus={() => setFacilityNameErr(false)}
                    onChange={(e) => {
                      setFacilityName(e.target.value);
                    }}
                  />
                </div>
                {showError ? (
                  <Typography className="text-danger text-sm -mb-4 ml-6 py-2 ">
                    {showError}
                  </Typography>
                ) : (
                  ""
                )}
                <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                  <Button
                    className="capitalize mr-[10px]"
                    component="span"
                    variant="outlined"
                    color="secondary"
                    loading={deleteLoading}
                    disabled={deleteLoading}
                    onClick={() => {
                      setIsDelete(false);
                      setShowError("");
                      setFacilityName("");
                    }}>
                    Cancel
                  </Button>
                  <Button
                    component="span"
                    className="capitalize text-white"
                    color="danger"
                    variant="contained"
                    loading={deleteLoading}
                    disabled={deleteLoading}
                    onClick={() => handleDelete()}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CustomModal>
          <div className="main-container">
            <Box className="w-[100%]">
              <div className="flex flex-row justify-content-between align-items-center p-3 ">
                <div>
                  <BreadCrumb
                    routes={[
                      {
                        name: "Administration",
                        route: "/administration/users",
                        color: true,
                      },
                      {
                        name: "Facilities",
                        route: "/administration/facilities",
                        color: true,
                      },
                      {
                        name: id ? state?.facility?.name : "Add New Facility",
                      },
                    ]}
                  />
                  {id ? (
                    <div>
                      <Edit className="mb-1" color="primary" /> Edit Facility:
                      {state?.facility?.name}
                    </div>
                  ) : (
                    <div>
                      <Add className="mb-1" color="primary" /> Add New Facility
                    </div>
                  )}
                </div>
              </div>
              <Box className="border-b-[1px] !border-lightGray bg-white">
                <Tabs
                  variant="scrollable"
                  value={value}
                  className="px-3"
                  onChange={handleChange}
                  aria-label="basic tabs example">
                  <Tab
                    icon={
                      (isEmpty.showErrorOnTabHeader || isEmpty.imageSize) && (
                        <Error color="danger" fontSize="small" />
                      )
                    }
                    className="capitalize text-[15px]"
                    iconPosition="start"
                    label="Basic Info"
                    {...a11yProps(0)}
                  />
                  <Tab
                    className="capitalize text-[15px]"
                    label="Users"
                    {...a11yProps(1)}
                  />
                  <Tab
                    className="capitalize text-[15px]"
                    label="Settings"
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <div className="h-[100%] flex flex-col justify-between bg-bgGray">
                  <BasicInfo
                    facilityDetails={facilityDetails}
                    primaryContacts={primaryContacts}
                    setFacilityDetails={setFacilityDetails}
                    isEmpty={isEmpty}
                    setIsEmpty={setIsEmpty}
                    fromEdit={id ? true : false}
                  />
                  <Buttons />
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className="h-[100%] flex flex-col justify-between bg-bgGray">
                  <Users
                    users={usersList}
                    facilityUsers={facilityUsers}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    setSelectedUsersUUID={setSelectedUsersUUID}
                    fromEdit={id ? true : false}
                  />
                  <Buttons />
                </div>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <div className="h-[100%] flex flex-col justify-between bg-bgGray">
                  <Settings id={id} />
                  <Buttons />
                </div>
              </TabPanel>
            </Box>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default AddNewFacility;
