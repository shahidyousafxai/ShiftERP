// Library imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Error from "@mui/icons-material/Error";
import { phone as phonevalidator } from "phone";

// Local Imports
import "../../Dashboard/Customer/Styles/customer.css";
import { BreadCrumb, Button } from "../../../shared";
import BusinessInfo from "./BusinessInfo.jsx";
import Subscription from "./Subscription.jsx";
import Settings from "./Settings.jsx";
import {
  addProvisionAccount,
  getSubscriptions,
} from "../../../api/provisionAccountsApi";
import { ErrorModal } from "./utils";

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
  const navigate = useNavigate();

  //***** States *****//
  const [value, setValue] = useState(0);
  const [subscriptions, setSubscriptions] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [provisionDetailsEmpty, setProvisionDetailsEmpty] = useState({});
  const [provisionDetails, setProvisionDetails] = useState({
    companyName: "",
    dbaName: "",
    comapnyPhone: "",
    comapnyAddress: "",
    companyCity: "",
    companyState: "",
    companyZip: "",
    companyStatus: 0,
    billingFirstName: "",
    billingLastName: "",
    billingTitle: "",
    billingEmail: "",
    billingContact: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    recBillingStartDate: "",
    subscriptionID: "",
    setupFee: "",
    setupFeeStartDate: "",
    adminFirstName: "",
    adminLastName: "",
    adminUsername: "",
    adminPhone: "",
    adminEmail: "",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fngetSubscriptions = async () => {
    await getSubscriptions(12345)
      .then((res) => {
        setSubscriptions(res.data.data);
      })
      .catch((error) => {
        if (error?.response) {
          setError(true);
          setErrorMsg(error?.response?.data?.message);
        } else {
          setError(true);
          setErrorMsg("Oops! Something went wrong.");
        }
      });
  };

  //***** Methods *****//
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fngetSubscriptions();
  }, []);

  //***** Add Provision  *****//

  const validateInput = (name, text) => {
    var numbers = /^(?!(0))[0-9]{0,15}$/;
    if (name === "setupFee") {
      return numbers.test(text);
    } else {
      return true;
    }
  };
  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      setProvisionDetails({
        ...provisionDetails,
        [e.target.name]: e.target.value,
      });
    }
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
    // eslint-disable-next-line array-callback-return
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
      // eslint-disable-next-line array-callback-return
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
        provisionDetails.recBillingStartDate.toLocaleDateString(),
      subscription_id: provisionDetails.subscriptionID,
      setup_fee: provisionDetails.setupFee,
      setup_fee_start_date:
        provisionDetails.setupFeeStartDate.toLocaleDateString(),

      fname: provisionDetails.adminFirstName,
      lname: provisionDetails.adminLastName,
      username: provisionDetails.adminUsername,
      phone: provisionDetails.adminPhone,
      email: provisionDetails.adminEmail.trim(),
    };
    return payload;
  };

  const onPressProvisionAccount = async () => {
    setLoading(true);
    if (isProvisionDetailsEmpty()) {
      await addProvisionAccount(createPayload())
        .then((res) => {
          setLoading(false);
          navigate("/manage-accounts");
        })
        .catch((error) => {
          let errors = error?.response?.data?.errors;
          let isEmpty = provisionDetailsEmpty;
          if (errors?.company_name) {
            isEmpty = {
              ...isEmpty,
              companyNameTaken: true,
              businessInfo: true,
            };
          }
          if (errors?.username) {
            isEmpty = {
              ...isEmpty,
              usernameTaken: true,
              settings: true,
            };
          }
          if (errors?.email) {
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
      <div className="d-flex justify-content-end bg-white py-[20px] mt-[20px] border-t-[1px] border-lightGray">
        <div className="buttons d-flex gap-2.5">
          <Button
            size="medium"
            className="normal-case w-[90px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => navigate("/manage-accounts")}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="mr-[20px] normal-case w-[160px]"
            component="span"
            color="primary"
            variant="contained"
            onClick={onPressProvisionAccount}
            loading={loading}
            disabled={loading}>
            Provision Account
          </Button>
        </div>
      </div>
    );
  };
  return (
    <>
      <Box className="w-full">
        <div className="d-flex flex-row justify-content-between align-items-center p-3 bg-white">
          <div>
            <BreadCrumb
              routes={[
                { name: "ShiftERP", route: "/manage-accounts", color: true },
                {
                  name: "Manage Accounts",
                  route: "/manage-accounts",
                  color: true,
                },
                { name: "Provision Account" },
              ]}
            />
            <h6>Provision Account</h6>
          </div>
        </div>
        <Box className="border-b-[1px] border-[divider] bg-white">
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

        <TabPanel value={value} index={0}>
          <div className="h-full flex flex-col justify-between bg-bgGray">
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
          <div className="h-full flex flex-col justify-between bg-bgGray">
            <Subscription
              subscriptions={subscriptions}
              provisionDetails={provisionDetails}
              provisionDetailsEmpty={provisionDetailsEmpty}
              handleOnChange={handleOnChange}
              handleOnFocus={handleOnFocus}
              handleDateChange={handlePhoneOnChange}
              setProvisionDetails={setProvisionDetails}
            />
            <Buttons />
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div className="h-full flex flex-col justify-between bg-bgGray">
            <Settings
              provisionDetails={provisionDetails}
              provisionDetailsEmpty={provisionDetailsEmpty}
              handleOnChange={handleOnChange}
              handleOnFocus={handleOnFocus}
              handlePhoneOnChange={handlePhoneOnChange}
              setProvisionDetailsEmpty={setProvisionDetailsEmpty}
            />
            <Buttons />
          </div>
        </TabPanel>
      </Box>
      <ErrorModal
        error={error}
        setError={setError}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    </>
  );
};

export default AddNewCustomer;
