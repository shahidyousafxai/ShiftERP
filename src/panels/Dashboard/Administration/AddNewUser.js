/* eslint-disable array-callback-return */
//Library imports
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { phone as phonevalidator } from "phone";
import { useDispatch } from "react-redux";
import { Tab, Tabs } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Error from "@mui/icons-material/Error";
//Local Imports
import {
  Typography,
  CustomModal,
  Button,
  Spinner,
  BreadCrumb,
} from "../../../shared";
import PersonalInfo from "./Tabs/PersonalInfo";
import Permissions from "./Tabs/Permissions";
import Facilities from "./Tabs/Facilities";
import {
  addNewUser,
  addNewUser_ProfileImg,
  editUser,
} from "../../../api/administrationUsersApi";
import { deteleMultipleUsers } from "../../../api/administratorApi";
import * as Actions from "../../../redux/administration/actions";
import { getAllRoles } from "../../../api/administratorApi";
import AssetsImages from "../../../assets/images";
import "./administration.module.css";
import { ErrorModal } from "./utils";
import { SimpleDeleteModal } from "../../../helpers/SimpleDeleteModal";

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

const AddNewUser = () => {
  const { state } = useLocation();
  let { id } = useParams();

  const navigate = useNavigate();

  // General States for all tabs
  const [value, setValue] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);
  const [rolesPermissionsFacilities, setRolesPermissionsFacilities] = useState(
    []
  );

  // Permission States
  const getPermissionsUUID = () => {
    let uuidArr = [];
    if (state?.user?.permission?.length > 0) {
      state.user.permission.map((el) => {
        if (uuidArr.length === 0) {
          uuidArr[0] = el.uuid;
        } else {
          uuidArr.push(el.uuid);
        }
      });
      return uuidArr;
    } else {
      return [];
    }
  };
  const [selectedPermissions, setSelectedPermissions] = useState(
    getPermissionsUUID()
  );

  // Facilities States
  const [selectedFacilities, setSelectedFacilities] = useState(
    state?.user
      ? state?.user?.facilities?.map((item, index) => {
          let obj = {
            id: index + 1,
            uuid: item?.uuid,
            name: item?.name,
            created_at: item?.date_of_creation,
            address: item?.address,
            city: item?.city,
            state: item?.state,
            zipCode: item?.zip,
            primaryContact: item?.primary_contact?.phone,
            primary_contact: item?.primary_contact,
            officePhone: item?.office_phone,
            primaryName: `${item?.primary_contact?.fname} ${item?.primary_contact?.lname}`,
          };
          return obj;
        })
      : []
  );
  const [selectedFacilitiesUUID, setSelectedFacilitiesUUID] = useState([]);

  // PersonalInfo Values
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    errormsg: "",
    errorUsername: "",
    errorEmail: "",
  });
  const [deleteErrorMsg, setDeleteErrorMsg] = useState("");

  // Error Modal States
  const [errorModal, setErrorModal] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState("");

  const dispatch = useDispatch();

  // User Details State
  const [userDetails, setUserDetails] = useState({
    profilePic:
      id && state?.user?.profile_pic
        ? state?.user?.profile_pic?.url
        : AssetsImages.profileImg,
    profilePicFile: "",
    firstName: id && state.user.fname ? state.user.fname : "",
    lastName: id && state.user.lname ? state.user.lname : "",
    userId: id && state.user.id ? state.user.id : "",
    userName: id && state.user.username ? state.user.username : "",
    userRole: id && state.user.role_uuid ? state.user.role_uuid : "",
    userRoleToShow: id && state.user.role ? state.user.role : "",
    email: id && state.user.email ? state.user.email : "",
    contactNumber: id && state.user.phone ? state.user.phone : "",
    address: id && state.user.address ? state.user.address : "",
    city: id && state.user.city ? state.user.city : "",
    state: id && state.user.state ? state.user.state : "",
    zipCode: id && state.user.zip_code ? state.user.zip_code : "",
    activeStatus: id && state.user.status ? state.user.status : 0,
    uuid: id && state.user.uuid ? state.user.uuid : "",
  });

  // User Details Error State
  const [isEmpty, setIsEmpty] = useState({
    firstName: false,
    lastName: false,
    userName: false,
    userRole: false,
    email: false,
    isEmailValid: false,
    contactNumber: false,
    isContactNumValid: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    showErrorOnTabHeader: false,
    imageSize: false,
  });

  // ***** START METHODS FOR BUTTONS FROM ADD NEW USER LINKED SCREENS LIKE PERSONAL-INFO, PERMISSIONS AND FACILITIES

  // For Validating Email
  const validateEmail = (email) => {
    var emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
  };
  // For Validating Input Fields => Not Empty Check
  const isUserDetailsEmpty = () => {
    let isContactValid = phonevalidator(userDetails.contactNumber).isValid;

    if (userDetails.firstName === "") {
      setIsEmpty({ ...isEmpty, firstName: true, showErrorOnTabHeader: true });
      return true;
    } else if (userDetails.lastName === "") {
      setIsEmpty({ ...isEmpty, lastName: true, showErrorOnTabHeader: true });
      return true;
    } else if (userDetails.userName === "") {
      setIsEmpty({ ...isEmpty, userName: true, showErrorOnTabHeader: true });
      return true;
    } else if (userDetails.userRole === "") {
      setIsEmpty({ ...isEmpty, userRole: true, showErrorOnTabHeader: true });
      return true;
    } else if (userDetails.email === "") {
      setIsEmpty({ ...isEmpty, email: true, showErrorOnTabHeader: true });
      return true;
    } else if (userDetails.email !== "" && !validateEmail(userDetails.email)) {
      setIsEmpty({
        ...isEmpty,
        isEmailValid: true,
        showErrorOnTabHeader: true,
      });
      return true;
    } else if (userDetails.contactNumber === "") {
      setIsEmpty({
        ...isEmpty,
        contactNumber: true,
        showErrorOnTabHeader: true,
      });
      return true;
    } else if (!isContactValid) {
      setIsEmpty({
        ...isEmpty,
        isContactNumValid: true,
        showErrorOnTabHeader: true,
      });
      return true;
    } else if (userDetails.address === "") {
      setIsEmpty({ ...isEmpty, address: true, showErrorOnTabHeader: true });
      return true;
    } else if (userDetails.city === "") {
      setIsEmpty({ ...isEmpty, city: true, showErrorOnTabHeader: true });
      return true;
    } else if (userDetails.state === "") {
      setIsEmpty({ ...isEmpty, state: true, showErrorOnTabHeader: true });
      return true;
    } else if (userDetails.zipCode === "") {
      setIsEmpty({ ...isEmpty, zipCode: true, showErrorOnTabHeader: true });
      return true;
    } else {
      return false;
    }
  };
  // OnClick Add User / Edit User Button
  const onPressAddOrEditUser = () => {
    // For Add New User from Personal Information
    if (value === 0 && !id) {
      setLoading(true);
      console.log(
        "%cFrom Personal-Info Add User",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      addNewUserPress();
    }
    // For Edit Existing User from Personal Information
    else if (value === 0 && id) {
      setLoading(true);
      console.log(
        "%cFrom Personal-Info Edit User",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      editUserPress();
    }
    // For Add New User from Permissions
    else if (value === 1 && !id) {
      setLoading(true);
      console.log(
        "%cFrom Permissions Add User",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      addNewUserPress();
    }
    // For  Edit Existing User from Permissions
    else if (value === 1 && id) {
      setLoading(true);
      console.log(
        "%cFrom Permissions Edit User",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      editUserPress();
    }
    // For Add New User from Facilities
    else if (value === 2 && !id) {
      setLoading(true);
      console.log(
        "%cFrom Facilities Add User",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      addNewUserPress();
    }
    // For  Edit Existing User from Facilities
    else if (value === 2 && id) {
      setLoading(true);
      console.log(
        "%cFrom Facilities Edit User",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      editUserPress();
    }
  };
  // OnClick from Add New User Screen => Add User Button
  const addNewUserPress = () => {
    if (!isUserDetailsEmpty()) {
      let payload = createPayload();

      addNewUser(payload)
        .then((res) => {
          let uuid = res.data.data.user.uuid;
          if (userDetails.profilePicFile !== "") {
            let formData = new FormData();
            formData.append("user_id", uuid);
            formData.append("image", userDetails.profilePicFile);

            addNewUser_ProfileImg(formData).then((res) => {});
          }
          navigate("/administration/users");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          const errorEmail = err?.response?.data?.errors?.email;
          const errorMessage = err?.response?.data?.message;
          const errorUsername = err?.response?.data?.errors?.username;
          // const errorArray = [errorUsername, errorEmail];
          setErrorMsg({
            type: "error",
            title: "Error",
            errormsg: errorMessage,
            errorUsername: errorUsername,
            errorEmail: errorEmail,
          });
        });
    } else {
      setLoading(false);
    }
  };
  // OnClick from Add New User Screen For Editing the Existing User => Edit User Button
  const editUserPress = async () => {
    if (!isUserDetailsEmpty()) {
      let payload = createPayload();
      console.log("🚀 ~ file: AddNewUser.js ~ line 274 ~ payload", payload);

      await editUser(payload)
        .then(async (res) => {
          let uuid = res.data.data.user.uuid;
          if (userDetails.profilePic === AssetsImages.profileImg) {
            let formData = new FormData();
            formData.append("user_id", uuid);
            formData.append("image", userDetails.profilePicFile);

            await addNewUser_ProfileImg(formData).then((res) => {});
          } else if (userDetails.profilePicFile !== "") {
            let formData = new FormData();
            formData.append("user_id", uuid);
            formData.append("image", userDetails.profilePicFile);

            await addNewUser_ProfileImg(formData).then((res) => {});
          }
          navigate("/administration/users");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          const errorEmail = err?.response?.data?.errors?.email;
          const errorMessage = err?.response?.data?.message;
          const errorUsername = err?.response?.data?.errors?.username;
          const errorArray = [errorUsername, errorEmail];
          setErrorMsg({
            type: "error",
            title: "Error",
            error: errorArray,
            msg: errorMessage,
          });
        });
    } else {
      setLoading(false);
    }
  };
  // For Creating Payload
  const createPayload = () => {
    let UUID = [];
    if (
      selectedFacilities?.length > 0 &&
      selectedFacilitiesUUID?.length === 0
    ) {
      selectedFacilities?.map((item) => {
        UUID.push(item.uuid);
      });
    }

    return {
      fname: userDetails.firstName,
      lname: userDetails.lastName,
      email: userDetails.email,
      phone: userDetails.contactNumber,
      username: userDetails.userName,
      address: userDetails.address,
      city: userDetails.city,
      zip_code: userDetails.zipCode,
      state: userDetails.state,
      status: userDetails.activeStatus,
      role_id: userDetails.userRole,
      birth_date: null,
      facilities:
        selectedFacilitiesUUID.length > 0
          ? selectedFacilitiesUUID
          : UUID.length > 0
          ? UUID
          : [],
      permission_ids: selectedPermissions.length > 0 ? selectedPermissions : [],
      image: null,
      uuid: userDetails.uuid,
    };
  };
  // OnClick Delete User
  const handleDelete = () => {
    console.log(
      "%cFrom Personal-Info Delete User",
      "color: Red; font-family:sans-serif; font-size: 20px; font-weight: 700"
    );

    setLoading(true);
    deteleMultipleUsers([state?.user?.uuid])
      .then((res) => {
        dispatch(Actions.getUsers("", "", "", ""));
        if (res.data.success) {
          navigate("/administration/users");
        }
      })
      .catch((error) => {
        if (error?.response) {
          console.log(
            "error message in Delete",
            error?.response?.data?.message
          );
          setLoading(false);
          setDeleteErrorMsg(error?.response?.data?.message);
        }
      });
  };

  // METHODS FOR BUTTONS FROM ADD NEW USER LINKED SCREENS LIKE PERSONAL-INFO, PERMISSIONS AND FACILITIES END ***** //

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Get All Roles And Permissions
  const getAllRolesPermissions = async () => {
    await getAllRoles()
      .then((res) => {
        setRolesPermissionsFacilities(res?.data?.data);
      })
      .catch((error) => {
        if (error?.response) {
          setErrorModal(true);
          setErrorModalMsg(error?.response?.data?.message);
        } else {
          setErrorModal(true);
          setErrorModalMsg("Oops! Something went wrong.");
        }
      });
    setShowSpinner(false);
  };

  useEffect(() => {
    getAllRolesPermissions();
  }, []);

  const Buttons = () => {
    return (
      <div
        className={`d-flex ${
          id ? "justify-content-between" : "justify-content-end"
        } bg-white py-[20px] border-t border-lightGray`}>
        {id && (
          <Button
            size="medium"
            className={`ml-5 mr-2.5 normal-case w-[120px]`}
            component="span"
            variant="outlined"
            color="danger"
            onClick={() => {
              setIsDelete(true);
            }}>
            Delete User
          </Button>
        )}
        <div className="buttons d-flex">
          <Button
            size="medium"
            className={`mr-2.5 normal-case w-[100px]`}
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => navigate("/administration/users")}>
            Cancel
          </Button>
          <Button
            size="medium"
            className={`mr-5 normal-case w-[100px]`}
            component="span"
            color="primary"
            variant="contained"
            onClick={onPressAddOrEditUser}
            loading={loading}
            disabled={loading || isEmpty.imageSize}>
            {id ? "Save" : "Add User"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {showSpinner ? (
        <Spinner />
      ) : (
        <>
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
                  onClick={() => {
                    setAlertModal(!alertModal);
                  }}>
                  <ClearIcon color="secondary" fontSize="small" />
                </div>
              </div>
              <div className="mb-3 mx-3">
                <Typography
                  className="d-flex flex-row align-items-center"
                  variant="body1"
                  fontSize={15}
                  // marginTop={3}
                  fontWeight="light">
                  {errorObj?.errormsg}
                  <br />
                  {errorObj?.errorUsername}
                  <br />
                  {errorObj?.errorEmail}
                </Typography>
                <div className="d-flex flex-row justify-content-end align-items-center mb-2">
                  <Button
                    className="capitalize mr-2.5"
                    component="span"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setAlertModal(false);
                    }}
                    disabled={loading}>
                    {"OK"}
                  </Button>
                </div>
              </div>
            </div>
          </CustomModal>

          <SimpleDeleteModal
            states={{
              open: isDelete,
              setOpen: setIsDelete,
              errorMsg: deleteErrorMsg,
              setErrorMsg: setDeleteErrorMsg,
              headTitle: "Delete User",
              deleteName: state?.user?.fname,
              loading: loading,
              deleteMethod: () => handleDelete(),
            }}
          />

          {/* Error Modal */}
          <ErrorModal
            error={errorModal}
            setError={setErrorModal}
            errorMsg={errorModalMsg}
            setErrorMsg={setErrorModalMsg}
          />

          <div className="main-container">
            <Box sx={{ width: "100%" }}>
              <div className="d-flex flex-row justify-content-between align-items-center p-3 bg-white">
                <div>
                  <BreadCrumb
                    routes={[
                      {
                        name: "Administration",
                        route: "/administration/users",
                        color: true,
                      },
                      {
                        name: "Users",
                        route: "/administration/users",
                        color: true,
                      },
                      { name: id ? state?.user?.fname : "Add New User" },
                    ]}
                  />
                  {id ? (
                    <div>
                      <Edit className="mb-1" color="primary" /> Edit User:{" "}
                      {state?.user?.fname}
                    </div>
                  ) : (
                    <div>
                      <Add className="mb-1" color="primary" /> Add New User
                    </div>
                  )}
                </div>
              </div>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  background: "white",
                }}>
                <Tabs
                  variant="scrollable"
                  value={value}
                  className="px-3"
                  onChange={handleChange}
                  aria-label="basic tabs example">
                  <Tab
                    className="normal-case text-[15px]"
                    icon={
                      (isEmpty.showErrorOnTabHeader || isEmpty.imageSize) && (
                        <Error color="danger" fontSize="small" />
                      )
                    }
                    iconPosition="start"
                    label="Personal Information"
                    {...a11yProps(0)}
                  />
                  <Tab
                    className="normal-case text-[15px]"
                    label="Permissions"
                    {...a11yProps(1)}
                  />
                  <Tab
                    className="normal-case text-[15px]"
                    label="Facilities"
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <div className="flex flex-col justify-between bg-bgGray h-full">
                  <PersonalInfo
                    userRoles={rolesPermissionsFacilities?.roles?.filter(
                      (item) => item?.name !== "User"
                    )}
                    // States For Input Fields
                    userDetails={userDetails}
                    setUserDetails={setUserDetails}
                    isEmpty={isEmpty}
                    setIsEmpty={setIsEmpty}
                    fromEdit={id ? true : false}
                  />
                  <Buttons />
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className="flex flex-col justify-between bg-bgGray h-full">
                  <Permissions
                    userPermissions={rolesPermissionsFacilities?.permissions}
                    selectedPermissions={selectedPermissions}
                    setSelectedPermissions={setSelectedPermissions}
                    fromEdit={id ? true : false}
                  />
                  <Buttons />
                </div>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <div className="flex flex-col justify-between bg-bgGray h-full">
                  <Facilities
                    userFacilities={rolesPermissionsFacilities?.facilities?.map(
                      (item, index) => {
                        let obj = {
                          id: index + 1,
                          uuid: item?.uuid,
                          name: item?.name,
                          created_at: item?.created_at,
                          address: item?.address,
                          city: item?.city,
                          state: item?.state,
                          zipCode: item?.zip_code,
                          primaryContact: item?.primary_contact?.phone,
                          officePhone: item?.office_phone,
                        };
                        return obj;
                      }
                    )}
                    selectedFacilities={selectedFacilities}
                    setSelectedFacilities={setSelectedFacilities}
                    setSelectedFacilitiesUUID={setSelectedFacilitiesUUID}
                    fromEdit={id ? true : false}
                  />
                  <Buttons />
                </div>
              </TabPanel>
            </Box>
          </div>
        </>
      )}
    </div>
  );
};

export default AddNewUser;
