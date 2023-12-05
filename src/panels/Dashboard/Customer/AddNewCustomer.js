/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useEffect, useState, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { phone as phonevalidator } from "phone";
import { Tabs, Tab } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import Error from "@mui/icons-material/Error";
import ClearIcon from "@mui/icons-material/Clear";
// Local Imports
import {
  BreadCrumb,
  Button,
  CustomModal,
  Typography,
  Alert,
  Box,
  Spinner,
  TextField,
} from "../../../shared";
import BasicInfo from "./Tabs/BasicInfo";
import Settings from "./Tabs/Settings";
import Integrations from "./Tabs/Integrations";
import {
  addCustomer,
  deleteCustomer,
  getAllFacilitiesList,
  getCustomerDetails,
  updateCustomer,
} from "../../../api/customerApi";
import "./Styles/customer.css";
import Orders from "./Tabs/Orders";
import { useSelector } from "react-redux";
import { AssignDeleteModal } from "../../../helpers/AssignDeleteModal";

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

const AddNewCustomer = () => {
  //***** States *****//
  const { state } = useLocation();
  const { from } = state;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const companyAdmin = user?.currentUser?.role === "company_admin";
  // General States for all tabs
  const [value, setValue] = useState(0);
  // PersonalInfo Values
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [errorObj, setErrorMsg] = useState({ type: "", title: "", msg: "" });

  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    customerCode: "",
    city: "",
    state: "",
    shippingLogic: "",
    productionLogic: "",
    recurringCharge: "",
    status: 0,
    primaryName: "",
    primaryEmail: "",
    primaryPhone: "",
    facilityArray: [],
  });

  const [allFacilities, setAllFacilities] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [userDetail, setUserDetail] = useState({
    items: "",
  });
  const [itemsCounter, setItemsCounter] = useState([1]);

  // Customer Settings State
  const [customerSettings, setCustomerSettings] = useState([
    [
      {
        key: "lot_number",
        title: "Lot Number on BOL / Receipts",
        value: 0,
      },
      {
        key: "lot_id1",
        title: "LotlD1 on BOL / Receipts",
        value: 0,
      },
      {
        key: "lot_id2",
        title: "LotlD2 on BOL / Receipts",
        value: 0,
      },
      {
        key: "receive_date",
        title: "Receive Date on BOL / Receipts",
        value: 0,
      },
      {
        key: "production_date",
        title: "Production Date on BOL / Receipts",
        value: 0,
      },
      {
        key: "expiration_date",
        title: "Expiration Date on BOL / Receipts",
        value: 0,
      },
    ],
    [
      {
        key: "billed_date",
        title: "Billed Date on Recurring Invoice",
        value: 0,
      },
      {
        key: "show_unit_of_count",
        title: "Always Show UnitOfCount on BOL / Receipts",
        value: 0,
      },
      {
        key: "group_by_item",
        title: "Group By Item on Recurring",
        value: 0,
      },
      {
        key: "group_by_lot_number",
        title: "Group By LotNumber on Recurring",
        value: 0,
      },
      {
        key: "group_by_lot_id1",
        title: "Group By LotlD1 on Recurring",
        value: 0,
      },
      {
        key: "group_by_lot_id2",
        title: "Group By LotlD2 on Recurring",
        value: 0,
      },
    ],
  ]);
  // Customer Details Error State
  const [isEmpty, setIsEmpty] = useState([]);
  // For Deleting Customer
  const [customerCode, setCustomerCode] = useState("");
  const [error, setError] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isError, setIsError] = useState(false);

  // ***** START METHODS FOR BUTTONS FROM ADD NEW CUSTOMER LINKED SCREENS ***** //

  // Getter & Setter for Customer Details For Edit
  const getSetCustomerDetails = () => {
    setLoading(true);
    getCustomerDetails({ uuid: state?.user?.uuid })
      .then((res) => {
        let data = res?.data?.data;
        const customerUsers = data?.users?.reduce((result, item, index) => {
          const obj = {
            fName: item?.fname,
            lName: item?.lname,
            email: item?.email,
            phone: item?.phone,
          };
          result[index + 1] = obj;
          return result;
        }, {});

        let settingLeft = {
          lot_number: data.lot_number,
          lot_id1: data.lot_id1,
          lot_id2: data.lot_id2,
          receive_date: data.receive_date,
          production_date: data.production_date,
          expiration_date: data.expiration_date,
        };
        let settingRight = {
          billed_date: data.billed_date,
          show_unit_of_count: data.show_unit_of_count,
          group_by_item: data.group_by_item,
          group_by_lot_number: data.group_by_lot_number,
          group_by_lot_id1: data.group_by_lot_id1,
          group_by_lot_id2: data.group_by_lot_id2,
        };
        setCustomerDetails({
          customerName: data.name,
          customerCode: data.code,
          city: data.city,
          state: data.state,
          shippingLogic: data.shipping_pick_logic,
          productionLogic: data.production_pick_logic,
          recurringCharge: data.min_charge === null ? "" : data.min_charge,
          status: data.status,
          primaryName: data.primary_contacts.name,
          primaryEmail: data.primary_contacts.email,
          primaryPhone: data.primary_contacts.phone,

          facilityArray: data?.facilities
            ? data?.facilities?.map((facilities) => ({
                value: facilities.uuid,
                label: facilities.name,
                facilityAdminEmail: facilities.primary_contact.email,
                facilityAdminPhone: facilities.primary_contact.phone,
                facilityAdminName: facilities.primary_contact.name,
              }))
            : [],
        });
        setCustomerSettings(() => {
          const array = [...customerSettings];
          array[0] = [...array[0]];

          Object.values(settingLeft).map((savedVal, index) => {
            array[0].map((item) => {
              if (item.key === Object.keys(settingLeft)[index])
                item.value = savedVal;
            });
          });

          return array;
        });
        setCustomerSettings(() => {
          const array = [...customerSettings];
          array[1] = [...array[1]];

          Object.values(settingRight).map((savedVal, index) => {
            array[1].map((item) => {
              if (item.key === Object.keys(settingRight)[index])
                item.value = savedVal;
            });
          });

          return array;
        });
        setCustomerOrders(data?.orders);
        setUserDetail({
          items: customerUsers,
        });
        if (data?.users?.length > 0) {
          setItemsCounter(Object.keys(customerUsers));
        } else {
          setItemsCounter([1]);
        }
        getFacilitiesList();
        // setFacilityArray(data.facilities);
      })
      .catch((err) => {
        setLoading(false);
        console.log("error in customer details", err?.message);
      });
  };

  const getFacilitiesList = () => {
    getAllFacilitiesList()
      .then((response) => {
        setAllFacilities(response?.data?.data?.facilities);
        setLoading(false);
        setIsDisabled(state?.user ? true : false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  // For Validating Email
  const validateEmail = (email) => {
    var emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
  };
  // For Validating Input Fields => Not Empty Check
  const isCustomerDetailsEmpty = () => {
    let isContactValid = phonevalidator(customerDetails.primaryPhone).isValid;
    let isEmpty;

    // Storing values in object if they have empty values
    Object.values(customerDetails).map((item, index) => {
      if (item === null || item === "") {
        isEmpty = {
          ...isEmpty,
          [Object.keys(customerDetails)[index]]: true,
          showErrorOnTabHeader: true,
        };
      }
    });
    // Checking primary phone is valid
    if (!isContactValid) {
      isEmpty = {
        ...isEmpty,
        isContactNumValid: true,
        showErrorOnTabHeader: true,
      };
    }
    // Checking primary email is valid
    if (!validateEmail(customerDetails.primaryEmail)) {
      isEmpty = {
        ...isEmpty,
        isEmailValid: true,
        showErrorOnTabHeader: true,
      };
    }

    // Checking if any userDetail is empty
    Object.values(userDetail?.items).map((item) => {
      if (
        !("fName" in item) ||
        item?.fName === "" ||
        !("lName" in item) ||
        item?.lName === "" ||
        !("email" in item) ||
        item?.email === "" ||
        !("phone" in item) ||
        item?.phone === ""
      ) {
        isEmpty = {
          ...isEmpty,
          items: true,
          showErrorOnTabHeader: true,
        };
      }
      if (!validateEmail(item?.email) && item?.email !== "") {
        isEmpty = {
          ...isEmpty,
          isItemEmailValid: true,
        };
      }
    });

    // Checking if facilities are selected
    // if (customerDetails.facilityArray.length === 0) {
    //   isEmpty = {
    //     ...isEmpty,
    //     facilityArray: true,
    //     showErrorOnTabHeader: true,
    //   };
    // }

    // Removing optional values from object if they exist
    if (isEmpty?.shippingLogic) {
      delete isEmpty?.shippingLogic;
    }

    if (isEmpty?.productionLogic) {
      delete isEmpty?.productionLogic;
    }
    if (isEmpty?.recurringCharge) {
      delete isEmpty?.recurringCharge;
    }

    if (
      isEmpty &&
      Object.keys(isEmpty).length === 1 &&
      isEmpty?.showErrorOnTabHeader
    ) {
      delete isEmpty?.showErrorOnTabHeader;
    }

    // setting state
    setIsEmpty(isEmpty);
    return isEmpty ? (Object.keys(isEmpty).length === 0 ? false : true) : false;
  };

  // OnClick Add Customer / Edit Customer Button
  const onPressAddOrEditCustomer = () => {
    // For Add New Customer from Basic Information
    if (from === "addCustomer") {
      setLoading(true);
      console.log(
        "%cFrom Add Customer",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      addNewCustomerPress();
    }

    // For Edit Existing Customer from Basic Information
    if (from === "editCustomer") {
      setLoading(true);
      console.log(
        "%cFrom Edit Customer",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      editCustomerPress();
    }
  };
  // OnClick from Add New Customer Screen => Add Customer Button
  const addNewCustomerPress = () => {
    if (!isCustomerDetailsEmpty()) {
      let payload = createPayload();
      addCustomer(payload)
        .then((res) => {
          navigate("/customers");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data?.errors?.code) {
            setIsEmpty({ customerCodeTaken: true });
          } else {
            setAlertModal(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: err?.response?.data?.message,
            });
          }
        });
    } else {
      setLoading(false);
    }
  };
  // OnClick from Add New Customer Screen For Editing the Existing Customer => Edit Customer Button
  const editCustomerPress = () => {
    if (!isCustomerDetailsEmpty()) {
      let payload = createPayload();
      payload = {
        ...payload,
        uuid: state?.user?.uuid,
      };

      updateCustomer(payload)
        .then((res) => {
          navigate("/customers");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data?.errors?.code) {
            setIsEmpty({ customerCodeTaken: true });
          } else {
            setAlertModal(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: err?.response?.data?.message,
            });
          }
        });
    } else {
      setLoading(false);
    }
  };

  // For Creating Payload
  const createPayload = () => {
    let facilitiesArray = customerDetails?.facilityArray?.map((item) => {
      return item.value;
    });
    const customerUsers = Object.values(userDetail?.items).map((item) => {
      const obj = {
        fname: item?.fName,
        lname: item?.lName,
        email: item?.email,
        phone: item?.phone,
        username: item?.email?.split("@")[0],
      };
      return obj;
    });
    return {
      name: customerDetails?.customerName,
      code: customerDetails?.customerCode.toLocaleUpperCase(),
      city: customerDetails?.city,
      state: customerDetails?.state,
      shipping_pick_logic: customerDetails?.shippingLogic,
      production_pick_logic: customerDetails?.productionLogic,
      min_charge: customerDetails?.recurringCharge,
      status: customerDetails?.status,
      primary_contact_name: customerDetails?.primaryName,
      primary_contact_email: customerDetails?.primaryEmail,
      primary_contact_phone: customerDetails?.primaryPhone,
      lot_number: customerSettings[0][0].value,
      lot_id1: customerSettings[0][1].value,
      lot_id2: customerSettings[0][2].value,
      receive_date: customerSettings[0][3].value,
      production_date: customerSettings[0][4].value,
      expiration_date: customerSettings[0][5].value,
      billed_date: customerSettings[1][0].value,
      show_unit_of_count: customerSettings[1][1].value,
      group_by_item: customerSettings[1][2].value,
      group_by_lot_number: customerSettings[1][3].value,
      group_by_lot_id1: customerSettings[1][4].value,
      group_by_lot_id2: customerSettings[1][5].value,
      facility_ids: facilitiesArray,
      users: customerUsers,
    };
  };

  // OnClick Delete User
  const handleDelete = () => {
    console.log(
      "%cFrom Personal-Info Delete User",
      "color: Red; font-family:sans-serif; font-size: 20px; font-weight: 700"
    );
    setLoading(true);
    let payload = {
      code: customerCode,
      uuid: state?.user?.uuid,
    };

    if (state?.user?.code === customerCode) {
      deleteCustomer(payload)
        .then((res) => {
          setLoading(false);
          navigate("/customers");
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data) {
            setIsError(error?.response?.data?.errors?.uuid?.[0]);
          }
        });
    } else {
      setError(true);
      setLoading(false);
    }
  };

  // METHODS FOR BUTTONS FROM ADD NEW CUSTOMER LINKED SCREENS END ***** //
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Button Group
  const Buttons = () => {
    return (
      <div
        className={`pt-[20px] pb-[20px] border-t border-lightGray d-flex ${
          from === "editCustomer" && companyAdmin
            ? "justify-content-between"
            : "justify-content-end"
        } bg-white`}>
        {from === "editCustomer" && companyAdmin && (
          <Button
            size="medium"
            className="capitalize ml-[20px] mr-[10px] w-[100px]"
            component="span"
            variant="outlined"
            color="danger"
            onClick={() => {
              setDeleteModal(true);
            }}>
            Delete
          </Button>
        )}
        <div className="buttons d-flex">
          <Button
            size="medium"
            className="mr-[10px] capitalize w-[100px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => navigate("/customers")}>
            Cancel
          </Button>
          <div
            className={`mr-[20px] ${
              isDisabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}>
            <Button
              size="medium"
              className=" capitalize w-[130px]"
              component="span"
              color="primary"
              variant="contained"
              onClick={onPressAddOrEditCustomer}
              loading={loading}
              disabled={isDisabled}>
              {from === "editCustomer" ? "Save" : "Add Customer"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // For getting Customer Details
  useEffect(() => {
    if (state?.user) {
      getSetCustomerDetails();
    } else {
      setLoading(true);
      getFacilitiesList();
    }
  }, []);

  // For getting all facilities
  useEffect(() => {
    setIsDisabled(false);
  }, [customerDetails, customerSettings, userDetail]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {/* For Showing Alert Modal */}
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
                  className="d-flex flex-row align-items-center "
                  variant="body1"
                  fontSize={15}
                  marginBottom={1}
                  marginTop={3}
                  marginLeft={3}
                  fontWeight="light">
                  {errorObj.msg}
                </Typography>
                <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                  <Button
                    className="mr-[10px]"
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

          {/* For Showing Delete Modal */}
          <AssignDeleteModal
            open={deleteModal}
            setOpen={setDeleteModal}
            headTitle="Delete Customer"
            warningMsg="This action is irreversible. Are you sure you want to delete this customer?"
            confirmationPrompt="Before you can delete this customer, please enter the code of customer:"
            onClose={() => {
              setDeleteModal(false);
              setIsError("");
              setCustomerCode("");
            }}
            onDelete={() => handleDelete()}
            loading={loading}
            errorMsg={isError}
          >
            <div className="form-row mx-4">
              <TextField
                label="Customer Code"
                type={"text"}
                fullWidth
                helperText={error ? "Customer Code not matched" : ""}
                error={error ? true : false}
                value={customerCode}
                name="customerCode"
                onFocus={() => setError(false)}
                onChange={(e) => {
                  setCustomerCode(e.target.value);
                }}
              />
            </div>
          </AssignDeleteModal>

          <div className="main-container">
            <Box sx={{ width: "100%" }}>
              <div className="d-flex flex-row justify-content-between align-items-center p-3 bg-white">
                <div>
                  <BreadCrumb
                    routes={[
                      { name: "ShiftERP", route: "/dashboard", color: true },
                      { name: "Customers", route: "/customers", color: true },
                      {
                        name:
                          from === "editCustomer"
                            ? `${state.user.name}`
                            : "Add New Customer",
                      },
                    ]}
                  />
                  {from === "editCustomer" ? (
                    <div>
                      <Edit className="mb-1" color="primary" /> Edit Customer:{" "}
                      {state.user.name}
                    </div>
                  ) : (
                    <div>
                      <Add className="mb-1" color="primary" /> Add New Customer
                    </div>
                  )}
                </div>
              </div>
              <Box className="border-b bg-white">
                <Tabs
                  variant="scrollable"
                  value={value}
                  className="px-3"
                  onChange={handleChange}
                  aria-label="basic tabs example">
                  <Tab
                    className="capitalize text-[15px]"
                    icon={
                      isEmpty?.showErrorOnTabHeader && (
                        <Error color="danger" fontSize="small" />
                      )
                    }
                    iconPosition="start"
                    label="Basic Info"
                    {...a11yProps(0)}
                  />
                  <Tab
                    className="capitalize text-[15px]"
                    label="Settings"
                    {...a11yProps(1)}
                  />
                  <Tab
                    className="capitalize text-[15px]"
                    label="Orders"
                    {...a11yProps(2)}
                  />
                  <Tab
                    className="capitalize text-[15px]"
                    label="Integrations"
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <div className="h-[100%] flex flex-col justify-between bg-bgGray">
                  <BasicInfo
                    customerDetails={customerDetails}
                    setCustomerDetails={setCustomerDetails}
                    userDetail={userDetail}
                    setUserDetail={setUserDetail}
                    isEmpty={isEmpty}
                    setIsEmpty={setIsEmpty}
                    from={from}
                    allFacilities={allFacilities}
                    itemsCounter={itemsCounter}
                    setItemsCounter={setItemsCounter}
                  />
                  <Buttons />
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div className="h-[100%] flex flex-col justify-between bg-bgGray">
                  <Settings
                    customerSettings={customerSettings}
                    setCustomerSettings={setCustomerSettings}
                  />
                  <Buttons />
                </div>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <div className="h-[100%] flex flex-col justify-between bg-bgGray">
                  <Orders customerOrders={customerOrders} />
                  <Buttons />
                </div>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <div className="h-[100%] flex flex-col justify-between bg-bgGray">
                  <Integrations />
                  <Buttons />
                </div>
              </TabPanel>
            </Box>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default AddNewCustomer;
