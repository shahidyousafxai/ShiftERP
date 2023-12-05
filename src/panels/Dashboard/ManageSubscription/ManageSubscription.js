/* eslint-disable array-callback-return */
// Library Imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Error from "@mui/icons-material/Error";
import { phone as phonevalidator } from "phone";
// Local Imports
import {
  Box,
  BreadCrumb,
  Button as Lbutton,
  AlertMessage,
} from "../../../shared";
import BusinessInfo from "./Tabs/BusinessInfo";
import Subscription from "./Tabs/Subscription";
import Settings from "./Tabs/Settings";
import { updateProvisionAccount } from "../../../api/provisionAccountsApi";
import { userLogin } from "../../../redux/users/user.actions";

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

const ManageSubscription = () => {
  const user = useSelector((state) => state.user);
  const provisionAccountData = user.provisionAccount;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const subscriptions = [
    {
      uuid: "774c8034b09b49669a1ea3b5580bf866",
      name: "Basic License",
      user_limit: 15,
      facility_limit: 5,
      price_per_license: 100,
    },
    {
      uuid: "e4d7a2303ca94bb389f4013cbba6d5bf",
      name: "Enterprise License",
      user_limit: 150,
      facility_limit: 20,
      price_per_license: 800,
    },
  ];

  //***** States *****//
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [provisionDetailsEmpty, setProvisionDetailsEmpty] = useState({});
  const [provisionDetails, setProvisionDetails] = useState({
    companyName: provisionAccountData?.company_name
      ? provisionAccountData?.company_name
      : "",
    dbaName: provisionAccountData?.dba_name
      ? provisionAccountData?.dba_name
      : "",
    comapnyPhone: provisionAccountData?.phone
      ? provisionAccountData?.phone
      : "",
    comapnyAddress: provisionAccountData?.address
      ? provisionAccountData?.address
      : "",
    companyCity: provisionAccountData?.city ? provisionAccountData?.city : "",
    companyState: provisionAccountData?.state
      ? provisionAccountData?.state
      : "",
    companyZip: provisionAccountData?.zip ? provisionAccountData?.zip : "",
    companyStatus: user?.userInfo?.status ? user?.userInfo?.status : 0,

    billingFirstName: provisionAccountData?.billing_details.fname
      ? provisionAccountData?.billing_details.fname
      : "",
    billingLastName: provisionAccountData?.billing_details.lname
      ? provisionAccountData?.billing_details.lname
      : "",
    billingTitle: provisionAccountData?.billing_details.title
      ? provisionAccountData?.billing_details.title
      : "",
    billingEmail: provisionAccountData?.billing_details.email
      ? provisionAccountData?.billing_details.email
      : "",
    billingContact: provisionAccountData?.billing_details.contact_number
      ? provisionAccountData?.billing_details.contact_number
      : "",
    billingAddress: provisionAccountData?.billing_details.address
      ? provisionAccountData?.billing_details.address
      : "",
    billingCity: provisionAccountData?.billing_details.city
      ? provisionAccountData?.billing_details.city
      : "",
    billingState: provisionAccountData?.billing_details.state
      ? provisionAccountData?.billing_details.state
      : "",
    billingZip: provisionAccountData?.billing_details.zip
      ? provisionAccountData?.billing_details.zip
      : "",

    recBillingStartDate: provisionAccountData?.Subscription_details[0]
      ?.recurring_billing_start_date
      ? provisionAccountData?.Subscription_details[0]
          ?.recurring_billing_start_date
      : "",
    subscriptionID: provisionAccountData?.Subscription_details[0]?.Subscription
      ?.uuid
      ? provisionAccountData?.Subscription_details[0]?.Subscription?.uuid
      : "",
    setupFee: provisionAccountData?.Subscription_details[0]?.setup_fee
      ? provisionAccountData?.Subscription_details[0]?.setup_fee
      : "",
    setupFeeStartDate: provisionAccountData?.Subscription_details[0]
      ?.setup_fee_start_date
      ? provisionAccountData?.Subscription_details[0]?.setup_fee_start_date
      : "",

    adminFirstName: user?.userInfo?.fname ? user?.userInfo?.fname : "",
    adminLastName: user?.userInfo?.lname ? user?.userInfo?.lname : "",
    adminUsername: provisionAccountData?.company_owner?.username
      ? provisionAccountData?.company_owner?.username
      : "",
    adminPhone: provisionAccountData?.company_owner?.phone
      ? provisionAccountData?.company_owner?.phone
      : "",
    adminEmail: provisionAccountData?.company_owner?.email
      ? provisionAccountData?.company_owner?.email
      : "",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //***** Methods *****//
  // UseEffect For Hiding Info Messages
  useEffect(() => {
    if (updated) {
      setTimeout(() => {
        setUpdated(false);
      }, 3000);
    }
  }, [updated]);

  //***** Add Provision  *****//

  const handleOnChange = (e) => {
    setProvisionDetails({
      ...provisionDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnFocus = () => {
    setProvisionDetailsEmpty({});
  };
  const handleStatusOnChange = (event) => {
    setProvisionDetails({
      ...provisionDetails,
      companyStatus: event.target.checked ? 1 : 0,
    });
  };
  const handlePhoneOnChange = (e, name) => {
    // Setting User Input Into States
    setProvisionDetails({
      ...provisionDetails,
      [name]: e,
    });
  };
  // For Validating Email
  const validateEmail = (email) => {
    var emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
  };

  const createPayload = () => {
    let payload = {
      company_name: provisionDetails.companyName,
      dba_name: provisionDetails.dbaName,
      provision_address: provisionDetails.comapnyAddress,
      provision_city: provisionDetails.companyCity,
      provision_phone: provisionDetails.comapnyPhone,
      provision_state: provisionDetails.companyState,
      provision_zip: provisionDetails.companyZip,
      provision_status: provisionDetails.companyStatus,

      billing_fname: provisionDetails.billingFirstName,
      billing_lname: provisionDetails.billingLastName,
      billing_title: provisionDetails.billingTitle,
      billing_email: provisionDetails.billingEmail.trim(),
      billing_phone: provisionDetails.billingContact,
      billing_address: provisionDetails.billingAddress,
      billing_city: provisionDetails.billingCity,
      billing_state: provisionDetails.billingState,
      billing_zip: provisionDetails.billingZip,

      recurring_billing_start_date:
        typeof provisionDetails.recBillingStartDate === "object"
          ? provisionDetails.recBillingStartDate.toLocaleDateString()
          : provisionDetails.recBillingStartDate,
      subscription_id: provisionDetails.subscriptionID,
      setup_fee: provisionDetails.setupFee,
      setup_fee_start_date:
        typeof provisionDetails.setupFeeStartDate === "object"
          ? provisionDetails.setupFeeStartDate.toLocaleDateString()
          : provisionDetails.setupFeeStartDate,

      fname: provisionDetails.adminFirstName,
      lname: provisionDetails.adminLastName,
      username: provisionDetails.adminUsername,
      phone: provisionDetails.adminPhone,
      email: provisionDetails.adminEmail.trim(),
    };
    return payload;
  };
  const isProvisionDetailsEmpty = () => {
    let isCompanyPhoneValid = phonevalidator(
      provisionDetails.comapnyPhone
    ).isValid;
    let isBillingContactValid = phonevalidator(
      provisionDetails.billingContact
    ).isValid;
    let isAdminPhoneValid = phonevalidator(provisionDetails.adminPhone).isValid;
    let isEmpty = {};

    // Storing values in object if they have empty values
    Object.values(provisionDetails).map((item, index) => {
      if (item === null || item === "") {
        isEmpty = {
          ...isEmpty,
          [Object.keys(provisionDetails)[index]]: true,
        };
        setLoading(false);
      }
    });
    // Checking phone is valid
    if (!isCompanyPhoneValid) {
      isEmpty = {
        ...isEmpty,
        comapnyPhoneValid: true,
      };
      setLoading(false);
    }
    if (!isBillingContactValid) {
      isEmpty = {
        ...isEmpty,
        billingContactValid: true,
      };
      setLoading(false);
    }
    if (!isAdminPhoneValid) {
      isEmpty = {
        ...isEmpty,
        adminPhoneValid: true,
      };
      setLoading(false);
    }
    // Checking email is valid
    if (!validateEmail(provisionDetails.billingEmail.trim())) {
      isEmpty = {
        ...isEmpty,
        billingEmailValid: true,
      };
      setLoading(false);
    }
    if (!validateEmail(provisionDetails.adminEmail.trim())) {
      isEmpty = {
        ...isEmpty,
        adminEmailValid: true,
      };
      setLoading(false);
    }
    // If having empty Fields Setting Error For Tab Header
    if (isEmpty !== {}) {
      Object.values(isEmpty).map((item, index) => {
        if (
          [Object.keys(isEmpty)[index]][0].includes("comapny") ||
          [Object.keys(isEmpty)[index]][0].includes("dba") ||
          [Object.keys(isEmpty)[index]][0].includes("billing")
        ) {
          isEmpty = {
            ...isEmpty,
            businessInfo: true,
          };
        } else if (
          [Object.keys(isEmpty)[index]][0].includes("Date") ||
          [Object.keys(isEmpty)[index]][0].includes("Fee")
        ) {
          isEmpty = {
            ...isEmpty,
            subscription: true,
          };
        } else if ([Object.keys(isEmpty)[index]][0].includes("admin")) {
          isEmpty = {
            ...isEmpty,
            settings: true,
          };
        }
      });
    }
    setProvisionDetailsEmpty(isEmpty);
    return Object.keys(isEmpty).length ? false : true;
  };
  const onPressProvisionAccount = async () => {
    setLoading(true);
    if (isProvisionDetailsEmpty()) {
      await updateProvisionAccount(createPayload())
        .then((res) => {
          setLoading(false);
          setUpdated(true);
          dispatch(
            userLogin({
              user: res?.data?.data?.user,
              token: user.token,
              userInfo: res?.data?.data?.user_info,
              provisionAccount: res?.data?.data?.provision_detail,
            })
          );
        })
        .catch((error) => {
          let message = error?.response?.data?.message;
          let isEmpty = provisionDetailsEmpty;
          if (message?.includes("Username")) {
            isEmpty = {
              ...isEmpty,
              usernameTaken: true,
              settings: true,
            };
          }
          if (message?.includes("Email")) {
            isEmpty = {
              ...isEmpty,
              emailTaken: true,
              settings: true,
            };
          }
          setProvisionDetailsEmpty(isEmpty);
          setLoading(false);
        });
    }
  };

  const Buttons = () => {
    return (
      <div
        className={`flex justify-end bg-white  pt-[20px] pb-[20px] border-t-[1px] border-lightGray`}>
        <div className="buttons d-flex">
          <Lbutton
            size="medium"
            className="mr-[20px] capitalize w-[120px]"
            component="span"
            color="primary"
            variant="contained"
            onClick={onPressProvisionAccount}
            loading={loading}
            disabled={loading}>
            Save
          </Lbutton>
        </div>
      </div>
    );
  };

  return (
    <Box className="w-[100%]">
      {/* Bread Crumbs */}
      <div className="d-flex flex-row justify-content-between align-items-center p-3 bg-white">
        <div>
          <BreadCrumb
            routes={[
              { name: "ShiftERP", route: "/dashboard", color: true },
              { name: "Manage Subscription" },
            ]}
          />
          <h6>Manage Subscription</h6>
        </div>
        {/* Alert Message for Subscription updated */}
        {updated && (
          <AlertMessage
            severity="success"
            text="Subscription details successfully updated"
            textColor="green"
          />
        )}
      </div>
      {/* Tabs Header */}
      <Box className="bg-white border-b-[1px] border-lightGray ">
        <Tabs
          variant="scrollable"
          value={value}
          className="px-3"
          onChange={handleChange}
          aria-label="basic tabs example">
          <Tab
            className="normal-case text-[15px]"
            icon={
              provisionDetailsEmpty?.businessInfo && (
                <Error color="danger" fontSize="small" />
              )
            }
            iconPosition="start"
            label="Business Info"
            {...a11yProps(0)}
          />
          <Tab
            className="normal-case text-[15px]"
            icon={
              provisionDetailsEmpty?.subscription && (
                <Error color="danger" fontSize="small" />
              )
            }
            iconPosition="start"
            label="Subscription"
            {...a11yProps(1)}
          />
          <Tab
            className="normal-case text-[15px]"
            icon={
              provisionDetailsEmpty?.settings && (
                <Error color="danger" fontSize="small" />
              )
            }
            iconPosition="start"
            label="Settings"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>

      {/* Selected Tab Body */}
      <TabPanel value={value} index={0}>
        <div className="h-[100%] flex flex-col justify-between bg-bgGray">
          <BusinessInfo
            provisionDetails={provisionDetails}
            provisionDetailsEmpty={provisionDetailsEmpty}
            handleOnChange={handleOnChange}
            handleOnFocus={handleOnFocus}
            handlePhoneOnChange={handlePhoneOnChange}
            handleStatusOnChange={handleStatusOnChange}
          />
          <Buttons />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="h-[100%] flex flex-col justify-between bg-bgGray">
          <Subscription
            subscriptions={subscriptions}
            provisionDetails={provisionDetails}
            provisionDetailsEmpty={provisionDetailsEmpty}
            handleOnChange={handleOnChange}
            handleOnFocus={handleOnFocus}
            handleDateChange={handlePhoneOnChange}
            setProvisionDetails={setProvisionDetails}
            previousData={provisionAccountData}
            navigate={navigate}
          />
          <Buttons />
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="h-[100%] flex flex-col justify-between bg-bgGray">
          <Settings
            provisionDetails={provisionDetails}
            provisionDetailsEmpty={provisionDetailsEmpty}
            handleOnChange={handleOnChange}
            handleOnFocus={handleOnFocus}
            handlePhoneOnChange={handlePhoneOnChange}
          />
          <Buttons />
        </div>
      </TabPanel>
    </Box>
  );
};

export default ManageSubscription;
