/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
// Library Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Add, Edit, Error, Delete } from "@mui/icons-material";
import MuiPhoneNumber from "material-ui-phone-number";
import { Switch, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { phone as phonevalidator } from "phone";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
// Local Imports
import {
  BreadCrumb,
  TextField,
  Button,
  CustomModal,
  MaterialDropdown,
} from "../../../../shared";
import {
  addNewShipTo,
  deleteShipTo,
  updateShipTo,
} from "../../../../api/shipToApi";
import { getUniCustomers } from "../../../../redux/universalcustomers/actions";
import { GetUniversalCustomersList } from "../../../../redux/universalcustomers/selectors";
import { GetShipToListing } from "../../../../redux/shipTo/selectors";
import { primaryColor } from "../../../../helpers/GlobalVariables";
import { AssignDeleteModal } from "../../../../helpers/AssignDeleteModal";

const AddNewShipTo = () => {
  let { id } = useParams();
  const { state } = useLocation();
  const shipTo = state?.shipTo;
  let shipToList = GetShipToListing();
  shipToList = shipToList?.filter((item) => item.uuid !== shipTo?.uuid);
  let customers = GetUniversalCustomersList();
  //Navigations
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //All States
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isShipToErr, setIsShipToErr] = useState("");
  const [isExternalIdErr, setIsExternalIDErr] = useState("");
  const [error, setError] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState([]);
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });
  const [assignShipTo, setAssignShipTo] = useState("");
  const [isAssignedValEmpty, setIsAssignedEmpty] = useState(false);
  const [assignErr, setAssignErr] = useState(false);

  //Form Data
  const [shipToData, setShipToData] = useState({
    customerName: id ? shipTo?.customer_name : "",
    customerUUID: id ? shipTo?.customer_uuid : "",
    shipToName: id ? shipTo?.name : "",
    address1: id ? shipTo?.address1 : "",
    address2: id ? shipTo?.address2 : "",
    city: id ? shipTo?.city : "",
    state: id ? shipTo?.state : "",
    zipCode: id ? shipTo?.zip_code : "",
    externalID: id ? shipTo?.external_id : "",
    status: id ? shipTo?.status : 0,
    contactName: id ? shipTo?.primary_contacts?.name : "",
    contactEmail: id ? shipTo?.primary_contacts?.email : "",
    contactNumber: id ? shipTo?.primary_contacts?.phone : "",
  });
  //Input Validations
  const validateInput = (name, text) => {
    var characters = /^[A-Za-z\s]*$/;
    var alphaNum = /^[0-9a-zA-Z\s]*$/;
    var numbers = /^(?!(0))[0-9]{0,15}$/;

    if (name === "shipToName" || name === "state" || name === "city") {
      return characters.test(text);
    } else if (name === "address1" || name === "address2") {
      return alphaNum.test(text);
    } else if (name === "zipCode" || name === "externalID") {
      return numbers.test(text);
    } else {
      return true;
    }
  };
  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      if (e.target.name === "customerUUID") {
        setShipToData({
          ...shipToData,
          customerName: customers?.map((item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }),
          [e.target.name]: e.target.value,
        });
      } else {
        setShipToData({
          ...shipToData,
          [e.target.name]: e.target.value,
        });
      }
    }
    setIsEmpty({
      ...isEmpty,
      [e.target.name]: false,
      isEmailValid: false,
      externalIDErr: false,
      shipToErr: false,
    });
  };

  //Handle OnChange Phone Field
  const handlePhoneOncChange = (e) => {
    // Setting User Input Into States
    setShipToData({
      ...shipToData,
      contactNumber: e,
    });

    setIsEmpty({
      ...isEmpty,
      contactNumber: false,
      isContactNumValid: false,
    });
  };

  //For Validating Email
  const validateEmail = (email) => {
    var emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
  };

  //Validating Every input If Empty
  const isShipToDetailsEmpty = () => {
    let isContactValid = phonevalidator(shipToData.contactNumber).isValid;
    let isEmpty;
    // Storing values in object if they have empty values
    Object.values(shipToData).map((item, index) => {
      if (item === null || item === "") {
        isEmpty = {
          ...isEmpty,
          [Object.keys(shipToData)[index]]: true,
        };
      }
    });
    if (!isContactValid) {
      isEmpty = {
        ...isEmpty,
        isContactNumValid: true,
      };
    }
    if (!validateEmail(shipToData.contactEmail)) {
      isEmpty = {
        ...isEmpty,
        isEmailValid: true,
      };
    }
    setIsEmpty(isEmpty);

    return isEmpty ? (Object.keys(isEmpty).length === 0 ? false : true) : false;
  };

  const createPayload = () => {
    let payload = {
      customer_id: shipToData.customerUUID,
      name: shipToData.shipToName,
      city: shipToData.city,
      state: shipToData.state,
      zip_code: shipToData.zipCode,
      address2: shipToData.address2,
      status: shipToData.status,
      primary_contact_name: shipToData.contactName,
      primary_contact_email: shipToData.contactEmail,
      primary_contact_phone: shipToData.contactNumber,
      external_id: shipToData.externalID,
      address1: shipToData.address1,
    };
    return payload;
  };

  //On Press Add New ShipTo
  const onPressAddNewShipTo = () => {
    if (!isShipToDetailsEmpty()) {
      setLoading(true);
      let payload = createPayload();
      addNewShipTo(payload)
        .then((res) => {
          setLoading(false);
          navigate("/supply-chain/ship-to");
        })
        .catch((error) => {
          console.log(error?.response);
          setLoading(false);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: error?.response?.data?.message,
            });
          }
          if (error?.response?.data?.errors?.external_id) {
            setIsEmpty({
              ...isEmpty,
              externalIDErr: true,
            });
            setIsExternalIDErr(error?.response?.data?.errors?.external_id[0]);
          }
          if (error?.response?.data?.errors?.name) {
            setIsEmpty({
              ...isEmpty,
              shipToErr: true,
            });
            setIsShipToErr(error?.response?.data?.errors?.name[0]);
          }
        });
    }
  };

  //OnPress Edit ShipTo
  const onPressEditShipTo = () => {
    if (!isShipToDetailsEmpty()) {
      setLoading(true);
      let payload = createPayload();
      payload = {
        ...payload,
        uuid: shipTo?.uuid,
      };
      updateShipTo(payload)
        .then((resp) => {
          setLoading(false);
          navigate("/supply-chain/ship-to");
        })
        .catch((error) => {
          console.log(error?.response);
          setLoading(false);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: error?.response?.data?.message,
            });
          }
          if (error?.response?.data?.errors?.external_id) {
            setIsEmpty({
              ...isEmpty,
              externalIDErr: true,
            });
            setIsExternalIDErr(error?.response?.data?.errors?.external_id[0]);
          }
          if (error?.response?.data?.errors?.name) {
            setIsEmpty({
              ...isEmpty,
              shipToErr: true,
            });
            setIsShipToErr(error?.response?.data?.errors?.name[0]);
          }
        });
    }
  };

  //OnPress AddOrEditShipto
  const onPressAddOrEditShipTo = () => {
    if (!id) {
      onPressAddNewShipTo();
    }
    if (id) {
      onPressEditShipTo();
    }
  };

  //Handle OnChange For Delete ShipTo
  const handleOnChangeDeleteShipTo = (event) => {
    if (event.target.name === "assingShipTo") {
      setAssignShipTo(event.target.value);
      setIsAssignedEmpty(false);
      setAssignErr(false);
    }
  };

  const validateDeleteInput = () => {
    if (assignShipTo === "") {
      setIsAssignedEmpty(true);
      return true;
    } else {
      return false;
    }
  };

  //Handle Delet ShipTo
  const handleDeleteShipTo = () => {
    let payload = {
      id: shipTo?.uuid,
      ship_to_reassign: assignShipTo,
    };
    if (!validateDeleteInput()) {
      setDeleteLoading(true);
      deleteShipTo(payload)
        .then((res) => {
          setDeleteLoading(false);
          navigate("/supply-chain/ship-to");
        })
        .catch((error) => {
          setDeleteLoading(false);
          setAssignErr(true);
          if (error?.response?.data) {
            setIsError(error?.response?.data?.message);
          }
        });
    }
  };

  //Handle Cancel Delete
  const handleCancelDelete = () => {
    setIsDelete(!isDelete);
    setIsError("");
    setAssignShipTo("");
    setIsAssignedEmpty(false);
    setAssignErr(false);
  };

  //UseEffect For Get Customers
  useEffect(() => {
    dispatch(getUniCustomers());
  }, []);

  //End Buttons
  const Buttons = () => {
    return (
      <div
        className={`mt-4 py-4 bg-white overflow-auto border-t border-lightGray d-flex ${
          id ? "justify-between" : "justify-end"
        }`}>
        {id && (
          <div className="mx-4">
            <Button
              size="medium"
              className="capitalize mr-[20px] w-[130px]"
              component="span"
              variant="outlined"
              color="danger"
              onClick={() => setIsDelete(!isDelete)}>
              Delete Ship To
            </Button>
          </div>
        )}
        <div className="buttons d-flex">
          <Button
            size="medium"
            className="capitalize mr-[10px] w-[100px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading || deleteLoading}
            onClick={() => navigate("/supply-chain/ship-to")}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="capitalize mr-[20px] w-[130px]"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading || deleteLoading}
            onClick={onPressAddOrEditShipTo}>
            {id ? "Save Ship To" : "Add Ship To"}
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col justify-between h-[100vh]">
      <div>
        {/* Bread Crums Start*/}
        <div className="flex justify-between items-center p-3 bg-white border-bottom">
          <div>
            <BreadCrumb
              routes={[
                {
                  name: "Supply Chain",
                  route: "/supply-chain/carriers",
                  color: true,
                },
                {
                  name: "Ship To",
                  route: "/supply-chain/ship-to",
                  color: true,
                },
                { name: id ? shipTo?.name : "Add New Ship To" },
              ]}
            />
            {id ? (
              <div>
                <Edit className="mb-1 mr-1" color="primary" />
                Edit : {shipTo?.name}
              </div>
            ) : (
              <div>
                <Add className="mb-1" color="primary" />
                Add New ShipTo
              </div>
            )}
          </div>
        </div>
        {/* Bread Crums End*/}

        {/* Error Message Alert */}
        <CustomModal
          open={error}
          close={() => setError(!error)}
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
                {errorObj?.title}
              </div>
              <div className="pointer mx-3" onClick={() => setError(!error)}>
                <ClearIcon color="secondary" fontSize="small" />
              </div>
            </div>

            <div className="my-3">
              <Typography
                className="d-flex flex-row align-items-center p-3"
                variant="body1"
                fontSize={15}
                color="danger"
                fontWeight="light">
                {errorObj?.msg}
                <br />
              </Typography>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  className="capitalize mr-[10px]"
                  component="span"
                  variant="outlined"
                  color="danger"
                  onClick={() => {
                    setError(!error);
                  }}>
                  {"Ok"}
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Delete Modal Start */}
        <AssignDeleteModal
          open={isDelete}
          setOpen={setIsDelete}
          headTitle="Delete ShipTo"
          warningMsg=""
          confirmationPrompt={<span>Before you can delete <b>'{shipTo?.name}'</b> you must first reassign to another:</span>}
          onClose={handleCancelDelete}
          onDelete={() => handleDeleteShipTo()}
          loading={deleteLoading}
        >
          <div className="form-row mx-4">
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                className={`${isAssignedValEmpty
                  ? "text-danger"
                  : assignErr
                    ? "text-danger"
                    : primaryColor
                  }`}>
                Assign ShipTo
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={assignShipTo}
                label="Assign ShipTo"
                name="assingShipTo"
                className={`${isAssignedValEmpty
                  ? "text-danger"
                  : assignErr
                    ? "text-danger"
                    : primaryColor
                  }`}
                onChange={handleOnChangeDeleteShipTo}
                error={
                  isAssignedValEmpty
                    ? "Please assign ShipTo before deleting selected one."
                    : assignErr
                      ? isError
                      : ""
                }>
                {shipToList.map((item, index) => {
                  return (
                    <MenuItem value={item.uuid} key={index}>
                      {item.shipToName}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText className="text-danger">
                {isAssignedValEmpty
                  ? "Please assign ShipTo before deleting selected one."
                  : assignErr
                    ? isError
                    : ""}
              </FormHelperText>
            </FormControl>
          </div>
        </AssignDeleteModal>


        {/* Form */}
        <div className="flex flex-col pt-[20px]">
          {/* Basic Info */}
          <div className="border rounded bg-white pb-0.5 mx-4">
            <h6 className="px-3 py-3">Basic Information</h6>
            <form className="px-3">
              <div className=" row">
                {/* Left Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="External ID"
                      type="text"
                      fullWidth
                      name="externalID"
                      value={shipToData.externalID}
                      onChange={handleOnChange}
                      disabled={id ? true : false}
                      helperText={
                        isEmpty?.externalID
                          ? "External ID is required"
                          : isEmpty?.externalIDErr
                          ? isExternalIdErr
                          : ""
                      }
                      error={
                        isEmpty?.externalID
                          ? true
                          : isEmpty?.externalIDErr
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={customers}
                      value={shipToData.customerUUID}
                      label={"Customer Name"}
                      name="customerUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleOnChange}
                      userRoleToShow={shipToData.customerName}
                      error={
                        isEmpty?.customerUUID ? "Customer Name is required" : ""
                      }
                      errorMsg={
                        isEmpty?.customerUUID ? "Customer Name is required" : ""
                      }
                      errorState={isEmpty?.customerUUID}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="ShipTo Name"
                      type={"text"}
                      name="shipToName"
                      value={shipToData.shipToName}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty?.shipToName
                          ? "ShipTo is required"
                          : isEmpty?.shipToErr
                          ? isShipToErr
                          : ""
                      }
                      error={
                        isEmpty?.shipToName
                          ? true
                          : isEmpty?.shipToErr
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Address 1"
                      type={"text"}
                      name="address1"
                      value={shipToData.address1}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty?.address1 ? "Address 1 is required" : ""
                      }
                      error={isEmpty?.address1 ? true : false}
                    />
                  </div>
                </div>

                {/* Right Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Address 2"
                      type={"text"}
                      name="address2"
                      value={shipToData.address2}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty?.address2 ? "Address 2 is required" : ""
                      }
                      error={isEmpty?.address2 ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="City"
                      type={"text"}
                      name="city"
                      value={shipToData.city}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={isEmpty?.city ? "City is required" : ""}
                      error={isEmpty?.city ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3 flex gap-3">
                    <div className="flex-[4]">
                      <TextField
                        size="small"
                        label="State"
                        type="text"
                        fullWidth
                        name="state"
                        value={shipToData.state}
                        onChange={handleOnChange}
                        helperText={isEmpty?.state ? "State is required" : ""}
                        error={isEmpty?.state ? true : false}
                      />
                    </div>
                    <div className="flex-[2]">
                      <TextField
                        size="small"
                        label="ZIP"
                        type="text"
                        fullWidth
                        name="zipCode"
                        value={shipToData.zipCode}
                        onChange={handleOnChange}
                        helperText={
                          isEmpty?.zipCode ? "Zipcode is required" : ""
                        }
                        error={isEmpty?.zipCode ? true : false}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-row mb-3">
                      <p className=" text-[12px]">Active Status</p>
                      <div className="d-flex items-center mt-[-10px] -ml-3">
                        <Switch
                          checked={shipToData.status === 1 ? true : false}
                          aria-label="Status"
                          value={shipToData.status}
                          onChange={(event) =>
                            setShipToData({
                              ...shipToData,
                              status: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                        <span color="secondary">
                          {shipToData.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Primary Contact Info */}
          <div className="border rounded bg-white pb-0.5 mx-4 mt-[20px]">
            <h6 className="px-3 py-3">Primary Contact</h6>
            <form className="px-3">
              <div className=" row">
                {/* Left Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Contact Name"
                      type={"text"}
                      name="contactName"
                      value={shipToData.contactName}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty?.contactName ? "Contact Name is required" : ""
                      }
                      error={isEmpty?.contactName ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Contact Email"
                      type={"text"}
                      name="contactEmail"
                      value={shipToData.contactEmail}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty?.contactEmail
                          ? "Contact email is required"
                          : isEmpty?.isEmailValid
                          ? "Contact email is not valid"
                          : ""
                      }
                      error={
                        isEmpty?.contactEmail
                          ? true
                          : isEmpty?.isEmailValid
                          ? true
                          : false
                      }
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
                        isEmpty?.contactNumber
                          ? "Contact number is required"
                          : isEmpty?.isContactNumValid
                          ? "Contact number is not valid"
                          : ""
                      }
                      error={
                        isEmpty?.contactNumber
                          ? true
                          : isEmpty?.isContactNumValid
                          ? true
                          : false
                      }
                      disableAreaCodes
                      value={shipToData.contactNumber}
                      onChange={handlePhoneOncChange}
                    />
                  </div>
                </div>
                {/* Right Section */}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <Buttons />
      </div>
    </div>
  );
};
export default AddNewShipTo;
