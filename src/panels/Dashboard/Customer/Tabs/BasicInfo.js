// Library Imports
import React, { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import MuiPhoneNumber from "material-ui-phone-number";
import { Add, Delete, Error } from "@mui/icons-material";

// Local Imports
import {
  TextField,
  Typography,
  Alert,
  Select as DropDown,
  MuiSwitch as Switch,
  Button,
} from "../../../../shared";

import { useOnClickOutside } from "../../../../helpers/useOutSideClick";

const BasicInfo = ({
  customerDetails,
  setCustomerDetails,
  isEmpty,
  setIsEmpty,
  from,
  allFacilities,
  userDetail,
  setUserDetail,
  itemsCounter,
  setItemsCounter,
}) => {
  const ref = useRef();

  const [changeAllergensHeight, setChangeAllergensHeight] = useState(false);
  // To Check Input Not Containing Special Charactrers
  const validateInput = (name, text) => {
    // Only Accept Characters
    var characters = /^[a-zA-Z ]*$/;
    // Only Accept Numbers
    var numbers = /^[0-9+]*$/;
    // Only Accept Characters And Numbers
    var alphaNum = /^[A-Za-z0-9_]*$/;

    if (
      name === "customerName" ||
      name === "primaryName" ||
      name === "city" ||
      name === "state"
    ) {
      return characters.test(text);
    } else if (name === "customerCode") {
      return alphaNum.test(text);
    } else if (name === "primaryPhone" || name === "recurringCharge") {
      return numbers.test(text);
    } else {
      return true;
    }
  };

  // To Capture Form OnChange
  const handleOnChange = (e) => {
    // Validate User Input
    if (validateInput(e.target.name, e.target.value)) {
      // Setting User Input Into States
      setCustomerDetails({
        ...customerDetails,
        [e.target.name]: e.target.value,
      });
    }

    // Setting State For Is Empty To FALSE
    if (
      e.target.name !== "shippingLogic" ||
      e.target.name !== "productionLogic" ||
      e.target.name !== "recurringCharge" ||
      e.target.name !== "status"
    ) {
      setIsEmpty({
        ...isEmpty,
        [e.target.name]: false,
        isEmailValid: false,
        showErrorOnTabHeader: false,
        customerCodeTaken: false,
      });
    }
  };

  useOnClickOutside(ref, () => setChangeAllergensHeight(false));

  //handle Facilitites change
  const handleMultiOnChange = (selectedOption) => {
    let array = [];
    if (allFacilities) {
      allFacilities.map((item) => {
        selectedOption.map((option) => {
          if (item.uuid === option.value) {
            array.push({
              value: item.uuid,
              label: item.name,
              facilityAdminEmail: item.primary_contact.email,
              facilityAdminPhone: item.primary_contact.phone,
            });
          }
        });
      });
    }

    setCustomerDetails({
      ...customerDetails,
      facilityArray: array,
    });
    setIsEmpty({
      ...isEmpty,
      facilityArray: false,
      showErrorOnTabHeader: false,
    });
  };

  // Primary Contact Number OnChange
  const handlePhoneOncChange = (e) => {
    // Setting User Input Into States
    setCustomerDetails({
      ...customerDetails,
      primaryPhone: e,
    });

    // Setting State For Is Empty To FALSE
    setIsEmpty({
      ...isEmpty,
      isContactNumValid: false,
      showErrorOnTabHeader: false,
    });
  };

  //Facility Table Component
  const FacilityListTable = () => {
    return (
      <div className="mx-auto w-[97.4%] bg-white py-3 border h-full rounded  pb-0.5">
        {/* <p className="mb-3 text-base font-semibold"></p> */}

        <div className="mx-3 max-h-52 overflow-y-auto">
          <table
            className="bg-white text-black table-fixed w-full shadow-none"
            width="100%">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b-2">
                <th className="text-darkGray text-[13px] font-[500] w-[10%] ">
                  Sr#
                </th>
                <th className="text-darkGray text-[13px] font-[500] w-[35%] ">
                  Facility Name
                </th>
                {/* <th className="text-darkGray text-[13px] font-[500] w-[25%]">
                  Facility Admin
                </th> */}
                <th className="text-darkGray text-[13px] font-[500] w-[35%]">
                  Email
                </th>
                <th className="text-darkGray text-[13px] font-[500]  w-[20%] ">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              <>
                {customerDetails?.facilityArray?.map((item, index) => {
                  return (
                    <tr
                      className={`!rounded-[10px] ${index % 2 !== 0 ? "bg-lightGray" : "bg-white"}`}
                      key={index}>
                      <td className="py-2 text-[13px] !ml-10">{index + 1}</td>
                      <td className="py-2 text-[13px]">{item?.label}</td>
                      {/* <td className=" py-2 text-[13px]">
                        {item?.facilityAdminName?.length > 0
                          ? item?.facilityAdminName
                          : "-"}
                      </td> */}
                      <td className=" py-2 text-[13px]">
                        {item?.facilityAdminEmail}
                      </td>
                      <td className=" py-2 text-[13px]">
                        {item?.facilityAdminPhone}
                      </td>
                    </tr>
                  );
                })}
              </>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const itemOnChange = (e, itemNum) => {
    if (userDetail?.items) {
      if (`${itemNum}` in userDetail?.items) {
        let existingItem = userDetail?.items?.[itemNum];
        // third time
        if (e?.target) {
          if (e.target.name === "itemfName") {
            e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "");
            e.target.value.charAt(0) === "0"
              ? (e.target.value = "")
              : (e.target.value = e.target.value);
            existingItem.fName = e.target.value;
            let data = { ...userDetail?.items, [itemNum]: existingItem };
            setUserDetail({ ...userDetail, items: data });
          }

          if (e.target.name === "itemlName") {
            e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "");
            e.target.value.charAt(0) === "0"
              ? (e.target.value = "")
              : (e.target.value = e.target.value);
            existingItem.lName = e.target.value;
            let data = { ...userDetail?.items, [itemNum]: existingItem };
            setUserDetail({ ...userDetail, items: data });
          }
          if (e.target.name === "itemEmail") {
            // e.target.value = e.target.value.replace(
            //   /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g,
            //   ""
            // );
            e.target.value.charAt(0) === "0"
              ? (e.target.value = "")
              : (e.target.value = e.target.value);
            existingItem.email = e.target.value;
            let data = { ...userDetail?.items, [itemNum]: existingItem };
            setUserDetail({ ...userDetail, items: data });
          }
        } else {
          existingItem.phone = e;
          let data = { ...userDetail?.items, [itemNum]: existingItem };
          setUserDetail({ ...userDetail, items: data });
        }
      } else {
        //second time
        if (e?.target) {
          if (e.target.name === "itemfName") {
            e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "");
            e.target.value.charAt(0) === "0"
              ? (e.target.value = "")
              : (e.target.value = e.target.value);
            let data = {
              ...userDetail?.items,
              [itemNum]: { fName: e.target.value },
            };
            setUserDetail({ ...userDetail, items: data });
          }
          if (e.target.name === "itemlName") {
            e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "");
            e.target.value.charAt(0) === "0"
              ? (e.target.value = "")
              : (e.target.value = e.target.value);
            let data = {
              ...userDetail?.items,
              [itemNum]: { lName: e.target.value },
            };
            setUserDetail({ ...userDetail, items: data });
          }
          if (e.target.name === "itemEmail") {
            // e.target.value = e.target.value.replace(
            //   /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g,
            //   ""
            // );
            e.target.value.charAt(0) === "0"
              ? (e.target.value = "")
              : (e.target.value = e.target.value);
            let data = {
              ...userDetail?.items,
              [itemNum]: { email: e.target.value },
            };
            setUserDetail({ ...userDetail, items: data });
          }
        } else {
          let data = {
            ...userDetail?.items,
            [itemNum]: { phone: e },
          };
          setUserDetail({ ...userDetail, items: data });
        }
      }
    } else {
      //first time
      if (e?.target) {
        if (e.target.name === "itemfName") {
          e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = { [itemNum]: { fName: e.target.value } };
          setUserDetail({ ...userDetail, items: data });
        }
        if (e.target.name === "itemlName") {
          e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = { [itemNum]: { lName: e.target.value } };
          setUserDetail({ ...userDetail, items: data });
        }
        if (e.target.name === "itemEmail") {
          // e.target.value = e.target.value.replace(
          //   /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g,
          //   ""
          // );
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = { [itemNum]: { email: e.target.value } };
          setUserDetail({ ...userDetail, items: data });
        }
      } else {
        let data = { [itemNum]: { phone: e } };
        setUserDetail({ ...userDetail, items: data });
      }
    }

    setIsEmpty({
      ...isEmpty,
      items: false,
      itemsEmpty: false,
      isItemEmailValid: false,
      showErrorOnTabHeader: false,
    });
  };
  const getItemsRowValues = (from, type, itemNum) => {
    if (from === "First Name") {
      return type === "value" &&
        userDetail?.items &&
        userDetail?.items[itemNum]?.fName
        ? userDetail?.items[itemNum]?.fName
        : "";
    }
    if (from === "Last Name") {
      return type === "value" &&
        userDetail?.items &&
        userDetail?.items[itemNum]?.lName
        ? userDetail?.items[itemNum]?.lName
        : "";
    }
    if (from === "Email") {
      return type === "value" &&
        userDetail?.items &&
        userDetail?.items[itemNum]?.email
        ? userDetail?.items[itemNum]?.email
        : "";
    }
    if (from === "Phone Number") {
      return type === "value" &&
        userDetail?.items &&
        userDetail?.items[itemNum]?.phone
        ? userDetail?.items[itemNum]?.phone
        : "";
    }
  };

  const itemOnDelete = (index, item) => {
    setItemsCounter(
      itemsCounter.filter((_, i) => i !== index).map((_, i) => i + 1)
    );
    // Deleting Row Data From State
    let data = userDetail?.items;
    delete data?.[item];

    // Update the indexing in kitData
    let newData = {};
    Object.keys(data).forEach((key, newIndex) => {
      newData[newIndex + 1] = data[key];
    });
    // Setting State
    setUserDetail({ ...userDetail, items: newData });
  };

  return (
    <div className="flex flex-col justify-between p-[20px] bg-bgGray">
      {/* Customer Details Form View Start */}
      <div className="border rounded bg-white pb-0.5">
        <p className="px-3 py-3 text-base font-semibold">Basic Info</p>
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
            {/* <br /> */}
          </div>
        )}
        <form className="px-3">
          <div className="row">
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Customer Name"
                  fullWidth
                  helperText={
                    isEmpty?.customerName ? "Customer Name is required" : ""
                  }
                  error={isEmpty?.customerName ? true : false}
                  name="customerName"
                  value={customerDetails.customerName}
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Customer Code"
                  fullWidth
                  helperText={
                    isEmpty?.customerCode
                      ? "Customer Code is required"
                      : isEmpty?.customerCodeTaken
                      ? "The customer code has already been taken."
                      : ""
                  }
                  error={
                    isEmpty?.customerCode
                      ? true
                      : isEmpty?.customerCodeTaken
                      ? true
                      : false
                  }
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  disabled={from === "editCustomer" ? true : false}
                  name="customerCode"
                  value={customerDetails.customerCode}
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="City"
                  fullWidth
                  helperText={isEmpty?.city ? "City is required" : ""}
                  error={isEmpty?.city ? true : false}
                  name="city"
                  value={customerDetails.city}
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Shipping Pick Logic(Optional)"
                  fullWidth
                  name="shippingLogic"
                  value={customerDetails.shippingLogic}
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <div className="ml-2 text-[11px] text-darkGray">
                  Active Status
                </div>
                <div className="-mt-1 text-[13px]">
                  <Switch
                    checked={customerDetails.status === 1 ? true : false}
                    onChange={(event) => {
                      setCustomerDetails({
                        ...customerDetails,
                        status: event.target.checked ? 1 : 0,
                      });
                    }}
                    value={customerDetails.status}
                  />
                  {customerDetails.status ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Production Pick Logic(Optional)"
                  fullWidth
                  name="productionLogic"
                  value={customerDetails.productionLogic}
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Minimum Charge on Recurring(Optional)"
                  fullWidth
                  name="recurringCharge"
                  value={customerDetails.recurringCharge}
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="State"
                  fullWidth
                  helperText={isEmpty?.state ? "State is required" : ""}
                  error={isEmpty?.state ? true : false}
                  name="state"
                  value={customerDetails.state}
                  onChange={handleOnChange}
                />
              </div>
              <div className="form-row mb-3" ref={ref}>
                <DropDown
                  className=""
                  multiple={true}
                  placeholder={"Facilities"}
                  value={customerDetails?.facilityArray}
                  onChange={handleMultiOnChange}
                  onFocus={() => setChangeAllergensHeight(true)}
                  options={
                    allFacilities?.length > 0
                      ? allFacilities?.map((facility) => ({
                        value: facility.uuid,
                        label: facility.name,
                      }))
                      : []
                  }
                // error={isEmpty?.facilityArray ? true : false}
                // errorMsg={
                //   isEmpty?.facilityArray ? "Facilities is required" : ""
                // }
                />
              </div>
              
            </div>
          </div>
        </form>
      </div>

      {/* Customer Details Primary Contact Form View Start */}
      <div className="border rounded bg-white pb-0.5 mt-3">
        <p className="px-3 py-3 text-base font-semibold">Primary Contact</p>
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
            {/* <br /> */}
          </div>
        )}

        <form className="px-3">
          <div className=" row">
            <div className="form-group col-md-6">
              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Contact Name"
                  fullWidth
                  helperText={
                    isEmpty?.primaryName ? "Contact Name is required" : ""
                  }
                  error={isEmpty?.primaryName ? true : false}
                  name="primaryName"
                  value={customerDetails.primaryName}
                  onChange={handleOnChange}
                />
              </div>

              <div className="form-row mb-3">
                <TextField
                  size="small"
                  label="Contact Email"
                  type="email"
                  fullWidth
                  helperText={
                    isEmpty?.primaryEmail
                      ? "Contact email is required"
                      : isEmpty?.isEmailValid
                      ? "Contact email is not valid"
                      : ""
                  }
                  error={
                    isEmpty?.primaryEmail
                      ? true
                      : isEmpty?.isEmailValid
                      ? true
                      : false
                  }
                  name="primaryEmail"
                  value={customerDetails.primaryEmail}
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
                    isEmpty?.primaryPhone
                      ? "Contact number is required"
                      : isEmpty?.isContactNumValid
                      ? "Contact number is not valid"
                      : ""
                  }
                  error={
                    isEmpty?.primaryPhone
                      ? true
                      : isEmpty?.isContactNumValid
                      ? true
                      : false
                  }
                  disableAreaCodes
                  value={customerDetails.primaryPhone}
                  onChange={handlePhoneOncChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Facilities Details And its Primary Contact View Start */}
      {/* <div
        className={`border rounded pb-0.5 my-3 overflow-hidden bg-white ${
          changeAllergensHeight ? "h-[20rem]" : "h-unset"
        }`}>
        <p className="px-3 py-3 text-base font-semibold">Facilities</p>

        <div className="px-3">
          <div className=" row">
            <div className="form-group col-md-10">
              <div className="form-row mb-3" ref={ref}>
                <DropDown
                  className=""
                  multiple={true}
                  placeholder={"Facilities"}
                  value={customerDetails?.facilityArray}
                  onChange={handleMultiOnChange}
                  onFocus={() => setChangeAllergensHeight(true)}
                  options={
                    allFacilities?.length > 0
                      ? allFacilities?.map((facility) => ({
                          value: facility.uuid,
                          label: facility.name,
                        }))
                      : []
                  }
                  // error={isEmpty?.facilityArray ? true : false}
                  // errorMsg={
                  //   isEmpty?.facilityArray ? "Facilities is required" : ""
                  // }
                />
              </div>
            </div>

            {customerDetails?.facilityArray?.length > 0 && (
              <FacilityListTable />
            )}
          </div>
        </div>
      </div> */}

      {/* Customer Users Section */}

      <div className="border rounded bg-white p-3 mt-3">
        <div className="flex items-center">
          <h6>Additional Users</h6>
          {isEmpty?.items && (
            <div className="ml-3 flex items-center">
              <Error color="danger" fontSize="small" />
              <p className="ml-2 text-danger text-sm font-semibold">
                {isEmpty?.itemsEmpty
                  ? "Add at least one User"
                  : "All fields of User are required."}
              </p>
            </div>
          )}
          {isEmpty?.isItemEmailValid && (
            <div className="ml-3 flex items-center">
              <Error color="danger" fontSize="small" />
              <p className="ml-2 text-danger text-sm font-semibold">
                {isEmpty?.isItemEmailValid && "Email is not valid"}
              </p>
            </div>
          )}
        </div>

        <div>
          {itemsCounter?.length > 0 &&
            itemsCounter?.map((item, index) => {
              return (
                <form key={index} className="mt-3">
                  <div className="flex items-center w-full gap-2 ">
                    <div className="w-[20%]">
                      <TextField
                        fullWidth
                        size="small"
                        label="First Name"
                        name="itemfName"
                        value={getItemsRowValues("First Name", "value", item)}
                        onChange={(e) => itemOnChange(e, item)}
                        error={
                          isEmpty?.itemsEmpty || isEmpty?.items ? true : false
                        }
                      />
                    </div>

                    <div className="w-[20%]">
                      <TextField
                        fullWidth
                        size="small"
                        label="Last Name"
                        name="itemlName"
                        value={getItemsRowValues("Last Name", "value", item)}
                        onChange={(e) => itemOnChange(e, item)}
                        error={
                          isEmpty?.itemsEmpty || isEmpty?.items ? true : false
                        }
                      />
                    </div>

                    <div className="w-[30%]">
                      <TextField
                        fullWidth
                        size="small"
                        label="Email"
                        type={"email"}
                        name="itemEmail"
                        value={getItemsRowValues("Email", "value", item)}
                        onChange={(e) => itemOnChange(e, item)}
                        error={
                          isEmpty?.itemsEmpty || isEmpty?.items ? true : false
                        }
                      />
                    </div>

                    <div className="w-[25%]">
                      <MuiPhoneNumber
                        fullWidth
                        defaultCountry="us"
                        variant="outlined"
                        size="small"
                        label="Phone Number"
                        name="itemPhone"
                        value={getItemsRowValues("Phone Number", "value", item)}
                        onChange={(e) => itemOnChange(e, item)}
                        error={
                          isEmpty?.itemsEmpty || isEmpty?.items ? true : false
                        }
                        disableAreaCodes
                      />
                    </div>

                    {itemsCounter?.length > 1 && (
                      <div
                        onClick={() => {
                          itemOnDelete(index, item);
                          setIsEmpty({
                            ...isEmpty,
                            items: false,
                            itemsEmpty: false,
                            isItemEmailValid: false,
                            showErrorOnTabHeader: false,
                          });
                        }}
                        className="ml-4 w-[5%]">
                        <Delete className="cursor-pointer" color="secondary" />
                      </div>
                    )}
                  </div>
                </form>
              );
            })}
        </div>
        {itemsCounter?.length < 5 && (
          <div className="mt-3">
            <Button
              startIcon={<Add color="primary" />}
              className="capitalize text-black text-[13px]"
              onClick={() =>
                setItemsCounter([...itemsCounter, itemsCounter.length + 1])
              }
              component="span"
              color="secondary"
              variant="outlined">
              Additional User
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default BasicInfo;
