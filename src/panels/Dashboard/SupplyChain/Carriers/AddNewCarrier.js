// Library Imports
import { useState } from "react";
import { phone as phonevalidator } from "phone";
import { Add, Delete, Edit, Error } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MuiPhoneNumber from "material-ui-phone-number";
import ClearIcon from "@mui/icons-material/Clear";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

//Local Imports
import {
  Button,
  TextField,
  BreadCrumb,
  CustomModal,
  MuiSwitch,
  Typography,
  Alert,
} from "../../../../shared";
import {
  addNewCarrier,
  deleteCarrier,
  updateCarrier,
} from "../../../../api/carriersApi";
import { GetCarriersListing } from "../../../../redux/carriers/selectors";
import { danger, primaryColor } from "../../../../helpers/GlobalVariables";
import { AssignDeleteModal } from "../../../../helpers/AssignDeleteModal";

const AddNewCarrier = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const carrier = state?.carrier;
  let carriersList = GetCarriersListing();
  carriersList = carriersList?.filter((item) => item?.uuid !== carrier?.uuid);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [assignCarrier, setAssignCarrier] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isAssingCarrierEmpty, setIsAssignCarierEmpty] = useState("");
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });
  const [error, setError] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errExternalID, setErrExternalID] = useState("");
  const [errShipCode, setErrShipCode] = useState("");
  //from Data
  const [carrierData, setCarrierData] = useState({
    shipperName: id ? carrier?.shipper_name : "",
    shipperCode: id ? carrier?.shipper_code : "",
    address: id ? carrier?.address : "",
    city: id ? carrier?.city : "",
    state: id ? carrier?.state : "",
    zipCode: id ? carrier?.zip_code : "",
    externalID: id ? carrier?.external_id : "",
    status: id ? carrier?.status : 0,
    contactName: id ? carrier?.primary_contacts?.name : "",
    contactEmail: id ? carrier?.primary_contacts?.email : "",
    contactNumber: id ? carrier?.primary_contacts?.phone : "",
  });

  const [isEmpty, setIsEmpty] = useState({
    shipperName: false,
    shipperCode: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    externalID: false,
    status: 0,
    contactName: false,
    contactEmail: false,
    contactNumber: false,
    isContactNumValid: false,
  });

  //Input Validations
  const validateInput = (name, text) => {
    var characters = /^[A-Za-z\s]*$/;
    var numbers = /^(?!(0))[0-9]*$/;
    var alphaNum = /^[0-9a-zA-Z\s]*$/;

    if (name === "shipperName" || name === "state" || name === "city") {
      return characters.test(text);
    } else if (
      name === "shipperCode" ||
      name === "contactName" ||
      name === "address"
    ) {
      return alphaNum.test(text);
    } else if (name === "zipCode" || name === "externalID") {
      return numbers.test(text);
    } else {
      return true;
    }
  };

  //Input Handle OnChange
  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      setCarrierData({
        ...carrierData,
        [e.target.name]: e.target.value,
      });
      setIsEmpty({
        shipperName: false,
        shipperCode: false,
        address: false,
        city: false,
        state: false,
        zipCode: false,
        externalID: false,
        status: 0,
        contactName: false,
        contactEmail: false,
      });
    }
  };
  const handlePhoneOncChange = (e) => {
    // Setting User Input Into States
    setCarrierData({
      ...carrierData,
      contactNumber: e,
    });
    setIsEmpty({
      ...isEmpty,
      contactNumber: false,
      isContactNumValid: false,
    });

    // Setting State For Is Empty To FALSE
  };

  //For Validating Email
  const validateEmail = (email) => {
    var emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailRegex.test(email);
  };

  //Input Empty Validations
  const isEmptyCarrierData = () => {
    let isContactValid = phonevalidator(carrierData.contactNumber).isValid;

    if (carrierData.shipperName === "") {
      setIsEmpty({ ...isEmpty, shipperName: true });
      return true;
    } else if (carrierData.shipperCode === "") {
      setIsEmpty({ ...isEmpty, shipperCode: true });
      return true;
    } else if (carrierData.address === "") {
      setIsEmpty({ ...isEmpty, address: true });
      return true;
    } else if (carrierData.city === "") {
      setIsEmpty({ ...isEmpty, city: true });
      return true;
    } else if (carrierData.state === "") {
      setIsEmpty({ ...isEmpty, state: true });
      return true;
    } else if (carrierData.zipCode === "") {
      setIsEmpty({ ...isEmpty, zipCode: true });
      return true;
    } else if (carrierData.externalID === "") {
      setIsEmpty({ ...isEmpty, externalID: true });
      return true;
    } else if (carrierData.contactName === "") {
      setIsEmpty({ ...isEmpty, contactName: true });
      return true;
    } else if (carrierData.contactEmail === "") {
      setIsEmpty({ ...isEmpty, contactEmail: true });
      return true;
    } else if (!validateEmail(carrierData.contactEmail)) {
      setIsEmpty({ ...isEmpty, isEmailValid: true });
      return true;
    } else if (carrierData.contactNumber === "") {
      setIsEmpty({ ...isEmpty, contactNumber: true, isContactNumValid: false });
      return true;
    } else if (!isContactValid) {
      if (!isContactValid) {
        setIsEmpty({
          ...isEmpty,
          isContactNumValid: true,
          contactNumber: false,
        });
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  //Create Payload
  const createPayload = () => {
    let payload = {
      shipper_name: carrierData.shipperName,
      shipper_code: carrierData.shipperCode,
      city: carrierData.city,
      state: carrierData.state,
      zip_code: carrierData.zipCode,
      external_id: carrierData.externalID,
      address: carrierData.address,
      status: carrierData.status,
      primary_contact_name: carrierData.contactName,
      primary_contact_email: carrierData.contactEmail,
      primary_contact_phone: carrierData.contactNumber,
    };
    return payload;
  };

  //On Button Click Too Add Carrier
  const onPressAddCarrier = () => {
    if (!isEmptyCarrierData()) {
      setLoading(true);
      let payload = createPayload();
      console.log("payload", payload);
      addNewCarrier(payload)
        .then((res) => {
          navigate("/supply-chain/carriers");
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error 2 --->", error?.response);
          setLoading(false);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: error?.response?.data?.message,
            });
          }
          if (error?.response?.data?.errors?.shipper_code) {
            setErrShipCode(error?.response?.data?.errors?.shipper_code[0]);
          }
          if (error?.response?.data?.errors?.external_id) {
            setErrExternalID(error?.response?.data?.errors?.external_id[0]);
          }
        });
    }
  };

  //OnPress Edit Existing Carrier
  const onPressEditCarrier = () => {
    if (!isEmptyCarrierData()) {
      setLoading(true);
      let paylaod = createPayload();
      paylaod = {
        ...paylaod,
        uuid: carrier?.uuid,
      };
      updateCarrier(paylaod)
        .then((response) => {
          console.log(response);
          setLoading(false);
          navigate("/supply-chain/carriers");
        })
        .catch((error) => {
          setLoading(false);
          // setError(true);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: error?.response?.data?.message,
            });
          }
          if (error?.response?.data?.errors?.shipper_code) {
            setErrShipCode(error?.response?.data?.errors?.shipper_code[0]);
          }
          if (error?.response?.data?.errors?.external_id) {
            setErrExternalID(error?.response?.data?.errors?.external_id[0]);
          }
        });
    }
  };

  //OnPress Add or Delete Carrier

  const onPressAddOrEditCarrier = () => {
    if (!id) {
      onPressAddCarrier();
    }
    if (id) {
      onPressEditCarrier();
    }
  };

  //Validate Delete Model DropDown
  const validateDelete = () => {
    if (assignCarrier === "") {
      setIsAssignCarierEmpty(true);
      return true;
    } else {
      return false;
    }
  };
  // Delet OnChange
  const handleDeleteOnChange = (event) => {
    if (event.target.name === "assingCarrier") {
      setAssignCarrier(event.target.value);
      setIsAssignCarierEmpty(false);
    }
  };

  //Handle Delete

  const handleDeleteCarrier = () => {
    let payload = {
      id: carrier?.uuid,
      shipper_reassign: assignCarrier,
    };
    if (!validateDelete()) {
      setDeleteLoading(true);
      deleteCarrier(payload)
        .then((res) => {
          setDeleteLoading(false);
          navigate("/supply-chain/carriers");
        })
        .catch((error) => {
          setDeleteLoading(false);
          setIsError(error?.response?.data?.message);
        });
    }
  };

  //Handle Cancel Delete
  const handleCancelDelete = () => {
    setIsDelete(false);
    setAssignCarrier("");
    setIsAssignCarierEmpty("");
    setIsError("");
  };
  //End Buttons
  const Buttons = () => {
    return (
      <div
        className={`mt-4 py-4 bg-white overflow-auto d-flex border-t border-lightGray ${
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
              Delete Carrier
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
            disabled={loading}
            onClick={() => navigate("/supply-chain/carriers")}>
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
            onClick={onPressAddOrEditCarrier}>
            {id ? "Save Carrier" : "Add Carrier"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between h-[100vh] bg-bgGray">
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
                  name: "Carriers",
                  route: "/supply-chain/carriers",
                  color: true,
                },
                { name: id ? carrier?.shipper_name : "Add New Carrier" },
              ]}
            />
            {id ? (
              <div>
                <Edit className="mb-1 mr-1" color="primary" />
                Edit : {carrier?.shipper_name}
              </div>
            ) : (
              <div>
                <Add className="mb-1" color="primary" />
                Add New Carrier
              </div>
            )}
          </div>
        </div>

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
                {!error && errorObj?.msg}
                {error && errExternalID}
                {errExternalID !== "" && <br />}
                {error && errShipCode}
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
                    setErrExternalID("");
                    setErrShipCode("");
                  }}>
                  {"Ok"}
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Custom Modal For Delete  */}
        <AssignDeleteModal
          open={isDelete}
          setOpen={setIsDelete}
          headTitle="Delete Shipper"
          warningMsg=""
          confirmationPrompt={<span>Before you can delete <b>"{carrier?.shipper_name}"</b>, you must first reassign their products to another shipper:</span>}
          onClose={handleCancelDelete}
          onDelete={() => {
            handleDeleteCarrier();
            setIsError("");
          }}
          loading={deleteLoading}
          errorMsg={isError}
        >
          <div className="form-row mx-4">
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                className={`${isAssingCarrierEmpty ? "text-danger" : primaryColor
                  }`}>
                Assign Shipper
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={assignCarrier}
                label="Assign Shipper"
                name="assingCarrier"
                size="medium"
                color={isAssingCarrierEmpty ? "danger" : "primary"}
                onChange={handleDeleteOnChange}
                error={
                  isAssingCarrierEmpty
                    ? "Please assign assign to a shipper before deleting selected one."
                    : ""
                }>
                {carriersList.map((item, index) => {
                  return (
                    <MenuItem value={item.uuid} key={index}>
                      {item.shipperName}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText className="text-danger">
                {isAssingCarrierEmpty &&
                  "Please assign a assign to a shipper before deleting selected one."}
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
                      label="Shipper Name"
                      type={"text"}
                      name="shipperName"
                      value={carrierData.shipperName}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty.shipperName ? "Shipper Name is required" : ""
                      }
                      error={isEmpty.shipperName ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Shipper Code"
                      type={"text"}
                      name="shipperCode"
                      value={carrierData.shipperCode}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty.shipperCode ? "Shipper Code is required" : ""
                      }
                      error={isEmpty.shipperCode ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Address"
                      type={"text"}
                      name="address"
                      value={carrierData.address.toUpperCase()}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={isEmpty.address ? "Address is required" : ""}
                      error={isEmpty.address ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="City"
                      type={"text"}
                      name="city"
                      value={carrierData.city}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={isEmpty.city ? "City is required" : ""}
                      error={isEmpty.city ? true : false}
                    />
                  </div>
                </div>
                {/* Right Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3 flex gap-3">
                    <div className="flex-[4]">
                      <TextField
                        size="small"
                        label="State"
                        type="text"
                        fullWidth
                        name="state"
                        value={carrierData.state}
                        onChange={handleOnChange}
                        helperText={isEmpty.state ? "State is required" : ""}
                        error={isEmpty.state ? true : false}
                      />
                    </div>
                    <div className="flex-[2]">
                      <TextField
                        size="small"
                        label="ZIP"
                        type="text"
                        fullWidth
                        name="zipCode"
                        value={carrierData.zipCode}
                        onChange={handleOnChange}
                        helperText={
                          isEmpty.zipCode ? "Zipcode is required" : ""
                        }
                        error={isEmpty.zipCode ? true : false}
                      />
                    </div>
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="External ID"
                      type="text"
                      fullWidth
                      name="externalID"
                      value={carrierData.externalID}
                      onChange={handleOnChange}
                      helperText={
                        isEmpty.externalID ? "External ID is required" : ""
                      }
                      error={isEmpty.externalID ? true : false}
                    />
                  </div>
                  <div>
                    <div className="form-row mb-3">
                      <p className="mt-2">Status</p>
                      <div className="d-flex items-center">
                        <MuiSwitch
                          checked={carrierData.status === 1 ? true : false}
                          value={carrierData.status}
                          onChange={(event) =>
                            setCarrierData({
                              ...carrierData,
                              status: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                        <span color="secondary">
                          {carrierData.status ? "Active" : "Inactive"}
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
                      value={carrierData.contactName}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty.contactName ? "Contact Name is required" : ""
                      }
                      error={isEmpty.contactName ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Contact Email"
                      type={"text"}
                      name="contactEmail"
                      value={carrierData.contactEmail}
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
                      value={carrierData.contactNumber}
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
export default AddNewCarrier;
