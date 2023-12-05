// Library Imports
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Add, Delete, Edit, Error } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import MuiPhoneNumber from "material-ui-phone-number";
import { phone as phonevalidator } from "phone";
// Local Imports
import {
  BreadCrumb,
  TextField,
  Button,
  CustomModal,
  Typography,
  MuiSwitch,
} from "../../../../shared";
import {
  addNewVendor,
  deleteVendor,
  updateVendor,
} from "../../../../api/vendorsApi";
import { SimpleDeleteModal } from "../../../../helpers/SimpleDeleteModal";

const AddNewVendor = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const vendor = state?.vendor;
  const navigate = useNavigate();
  //All States
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });

  //from Data
  const [vendorData, setVendorData] = useState({
    companyName: id ? vendor?.company_name : "",
    dbaName: id ? vendor?.dba_name : "",
    address: id ? vendor?.address : "",
    city: id ? vendor?.city : "",
    state: id ? vendor?.state : "",
    zipCode: id ? vendor?.zip_code : "",
    status: id ? vendor?.status : 0,
    contactName: id ? vendor?.primary_contacts?.name : "",
    contactEmail: id ? vendor?.primary_contacts?.email : "",
    contactNumber: id ? vendor?.primary_contacts?.phone : "",
  });

  //Input Validations
  const validateInput = (name, text) => {
    var characters = /^[A-Za-z\s]*$/;
    var numbers = /^(?!(0))[0-9]*$/;
    var alphaNum = /^[0-9a-zA-Z\s]*$/;

    if (name === "companyName" || name === "state" || name === "city") {
      return characters.test(text);
    } else if (
      name === "dbaName" ||
      name === "contactName" ||
      name === "address"
    ) {
      return alphaNum.test(text);
    } else if (name === "zipCode") {
      return numbers.test(text);
    } else {
      return true;
    }
  };
  //When State is Empty
  const [isEmpty, setIsEmpty] = useState({
    companyName: false,
    dbaName: false,
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

  //Input Handle OnChange
  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      setVendorData({
        ...vendorData,
        [e.target.name]: e.target.value,
      });
      setIsEmpty({
        companyName: false,
        dbaName: false,
        address: false,
        city: false,
        state: false,
        zipCode: false,
        status: 0,
        contactName: false,
        contactEmail: false,
      });
    }
  };
  //Handle OnChange Phone Field
  const handlePhoneOncChange = (e) => {
    // Setting User Input Into States
    setVendorData({
      ...vendorData,
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

  //Input Empty Validations
  const isEmptyVendorData = () => {
    let isContactValid = phonevalidator(vendorData.contactNumber).isValid;

    if (vendorData.companyName === "") {
      setIsEmpty({ ...isEmpty, companyName: true });
      return true;
    } else if (vendorData.dbaName === "") {
      setIsEmpty({ ...isEmpty, dbaName: true });
      return true;
    } else if (vendorData.address === "") {
      setIsEmpty({ ...isEmpty, address: true });
      return true;
    } else if (vendorData.city === "") {
      setIsEmpty({ ...isEmpty, city: true });
      return true;
    } else if (vendorData.state === "") {
      setIsEmpty({ ...isEmpty, state: true });
      return true;
    } else if (vendorData.zipCode === "") {
      setIsEmpty({ ...isEmpty, zipCode: true });
      return true;
    } else if (vendorData.contactName === "") {
      setIsEmpty({ ...isEmpty, contactName: true });
      return true;
    } else if (vendorData.contactEmail === "") {
      setIsEmpty({ ...isEmpty, contactEmail: true });
      return true;
    } else if (!validateEmail(vendorData.contactEmail)) {
      setIsEmpty({ ...isEmpty, isEmailValid: true });
      return true;
    } else if (vendorData.contactNumber === "") {
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

  const createPayload = () => {
    let payload = {
      company_name: vendorData.companyName,
      dba_name: vendorData.dbaName,
      city: vendorData.city,
      state: vendorData.state,
      zip_code: vendorData.zipCode,
      address: vendorData.address,
      status: vendorData.status,
      primary_contact_name: vendorData.companyName,
      primary_contact_email: vendorData.contactEmail,
      primary_contact_phone: vendorData.contactNumber,
    };
    return payload;
  };

  //On Press Add Venor
  const onPressAddVendor = () => {
    if (!isEmptyVendorData()) {
      setLoading(true);
      let payload = createPayload();
      addNewVendor(payload)
        .then((response) => {
          setLoading(false);
          navigate("/supply-chain/vendors");
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: error?.response?.data?.errors?.company_name[0],
            });
          }
        });
    }
  };

  //On Press Edit Vendor

  const onPressEditVendor = () => {
    if (!isEmptyVendorData()) {
      setLoading(true);
      let payload = createPayload();
      payload = {
        ...payload,
        uuid: vendor?.uuid,
      };
      updateVendor(payload)
        .then((response) => {
          console.log("update response", response);
          setLoading(false);
          navigate("/supply-chain/vendors");
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: error?.response?.data?.errors?.company_name[0],
            });
          }
        });
    }
  };
  //On Press Add or Edit Vendor
  const onPressAddOrEditVendor = () => {
    if (!id) {
      onPressAddVendor();
    }
    if (id) {
      onPressEditVendor();
    }
  };

  //Hanlde Delete Vendor

  const handleDeleteVendor = () => {
    let payload = {
      id: vendor?.uuid,
    };
    setDeleteLoading(true);
    deleteVendor(payload)
      .then((res) => {
        navigate("/supply-chain/vendors");
        setDeleteLoading(false);
      })
      .catch((error) => {
        setDeleteLoading(false);
        console.log("error", error);
      });
  };

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
              Delete Vendor
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
            onClick={() => navigate("/supply-chain/vendors")}>
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
            onClick={onPressAddOrEditVendor}>
            {id ? "Save Vendor" : "Add Vendor"}
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
                  name: "Vendors",
                  route: "/supply-chain/vendors",
                  color: true,
                },
                { name: id ? vendor?.company_name : "Add New Vendor" },
              ]}
            />
            {id ? (
              <div>
                <Edit className="mb-1 mr-1" color="primary" />
                Edit : {vendor?.company_name}
              </div>
            ) : (
              <div>
                <Add className="mb-1" color="primary" />
                Add New Vendor
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

        {/* Custom Modal For Delete  */}
        <SimpleDeleteModal
          states={{
            open: isDelete,
            setOpen: setIsDelete,
            headTitle: "Delete Vendor",
            deleteName: vendor?.company_name,
            loading: deleteLoading,
            deleteMethod: () => handleDeleteVendor(),
          }}
        />

        {/* Form */}
        <div className="flex flex-col pt-[20px]">
          {/* Basic Info */}
          <div className="border rounded bg-white pb-0.5 mx-4">
            <h6 className="px-3 py-3">Vendor Information</h6>
            <form className="px-3">
              <div className=" row">
                {/* Left Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Company Name"
                      type={"text"}
                      name="companyName"
                      value={vendorData.companyName}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty.companyName ? "Company Name is required" : ""
                      }
                      error={isEmpty.companyName ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="DBA Name"
                      type={"text"}
                      name="dbaName"
                      value={vendorData.dbaName}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={isEmpty.dbaName ? "DBA Name is required" : ""}
                      error={isEmpty.dbaName ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Address"
                      type={"text"}
                      name="address"
                      value={vendorData.address.toUpperCase()}
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
                      value={vendorData.city}
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
                        value={vendorData.state}
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
                        value={vendorData.zipCode}
                        onChange={handleOnChange}
                        helperText={
                          isEmpty.zipCode ? "Zipcode is required" : ""
                        }
                        error={isEmpty.zipCode ? true : false}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-row mb-3">
                      <p className="mt-2">Status</p>
                      <div className="d-flex items-center">
                        <MuiSwitch
                          checked={vendorData.status === 1 ? true : false}
                          value={vendorData.status}
                          onChange={(event) =>
                            setVendorData({
                              ...vendorData,
                              status: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                        <span color="secondary">
                          {vendorData.status ? "Active" : "Inactive"}
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
                      value={vendorData.contactName}
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
                      value={vendorData.contactEmail}
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
                      value={vendorData.contactNumber}
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
export default AddNewVendor;
