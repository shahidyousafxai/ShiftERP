/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
// Library Imports
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Add } from "@mui/icons-material";
import { Switch, Stack, TextField as TimeField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// Local Imports
import {
  BreadCrumb,
  MaterialDropdown,
  TextField,
  Button,
} from "../../../../shared";
import { getAddProductionOrder } from "../../../../api/universalModelData";
import {
  GetKitParentListing,
  GetKitParentLoading,
} from "../../../../redux/universalKits/selectors";
import { getKitParent } from "../../../../redux/universalKits/action";
import useAllDependencies from "../../../../redux/dependencies/getAllDependencies";

const AddNewProductionOrder = () => {
  const dispatch = useDispatch();
  const { dependences, loadingDepend, allDependences } = useAllDependencies();
  const loadingKits = GetKitParentLoading();
  const kitParent = GetKitParentListing();
  const units = dependences?.units;
  const customers = dependences?.customer;

  //States
  const [drivers, setDrivers] = useState([]);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState([]);

  //Navigations
  const navigate = useNavigate();

  //current Date and Time
  var currentdate = new Date();
  var currDate =
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear();

  var currTime =
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  //Time states
  const [date, setDate] = useState(currDate);
  const [time, setTime] = useState(currTime);
  //Form Data
  const [productionOrderData, setProductionOrderData] = useState({
    customerName: "",
    customerUUID: "",
    kitParentName: "",
    kitParentUUID: "",
    uomUUID: "",
    uomName: "",
    quantity: "",
    remotePick: 0,
    allergenPick: 0,
    notes: "",
    poNotes: "",
    driver_1: "",
    driver_1UUID: "",
    driver_1Obj: "",
    driver_2: "",
    driver_2UUID: "",
    driver_2Obj: "",
  });

  //validate Input
  const validateInput = (name, text) => {
    var numbers = /^(?!(0))[0-9]*$/;
    var alphaNum = /^[0-9a-zA-Z\s]*$/;

    if (name === "poNotes" || name === "notes") {
      return alphaNum.test(text);
    } else if (name === "quantity") {
      return numbers.test(text);
    } else {
      return true;
    }
  };

  //handleTime change
  const handleTimeChange = (newValue) => {
    let changeDate = `${newValue?.$D}-${newValue?.$M + 1}-${newValue?.$y}`;
    const currTime = `${newValue?.$H}:${newValue?.$m}:${newValue?.$s}`;
    setValue(newValue);
    setDate(changeDate);
    setTime(currTime);
  };

  //handle customer and parent kit
  const handleCustomerChange = (e) => {
    if ((e.target.name, e.target.value)) {
      if (e.target.name === "customerUUID") {
        let name = "";
        customers?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setProductionOrderData({
          ...productionOrderData,
          customerName: name,
          [e.target.name]: e.target.value,
          kitParentUUID: "",
        });
      } else if (e.target.name === "kitParentUUID") {
        let name = "";
        kitParent?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
          // console.log("value", e.target.value);
        });

        setProductionOrderData({
          ...productionOrderData,
          kitParentName: name,
          [e.target.name]: e.target.value,
        });
      } else {
        setProductionOrderData({
          ...productionOrderData,
          [e.target.name]: e.target.value,
        });
      }
    }
    setIsEmpty({
      ...isEmpty,
      [e.target.name]: false,
    });
  };

  //handle change amount, notes poNotes
  const handleChangeQuantityAndNotes = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      setProductionOrderData({
        ...productionOrderData,
        [e.target.name]: e.target.value,
      });
    }
    setIsEmpty({
      ...isEmpty,
      [e.target.name]: false,
    });
  };

  //handle change Units
  const handleChangeUnits = (e) => {
    if ((e.target.name, e.target.value)) {
      if (e.target.name === "uomUUID") {
        let name = "";
        units?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setProductionOrderData({
          ...productionOrderData,
          uomName: name,
          [e.target.name]: e.target.value,
        });
      } else {
        setProductionOrderData({
          ...productionOrderData,
          [e.target.name]: e.target.value,
        });
      }
    }
    setIsEmpty({
      ...isEmpty,
      [e.target.name]: false,
    });
  };

  //handle change of drivers
  const shippingOnChange = (existing, event) => {
    const { name, value } = event?.target;
    const driverName = name.replace("UUID", "");
    const driverObj = name.replace("UUID", "Obj");

    const selectedItem = dependences?.drivers
      ?.map((item, index) => {
        if (item?.uuid === value) {
          const obj = {
            item: item,
            index: index,
          };
          return obj;
        }
      })
      .filter((item) => item !== undefined);

    setProductionOrderData({
      ...productionOrderData,
      [driverName]: selectedItem[0]?.item?.name,
      [name]: selectedItem[0]?.item?.uuid,
      [driverObj]: selectedItem[0]?.item,
    });

    setIsEmpty({
      ...isEmpty,
      [event.target.name]: false,
    });
  };

  //Validating Every input If Empty
  const productionOrderDetailsEmpty = () => {
    let isEmpty;
    // Storing values in object if they have empty values
    Object.values(productionOrderData).map((item, index) => {
      if (item === null || item === "") {
        isEmpty = {
          ...isEmpty,
          [Object.keys(productionOrderData)[index]]: true,
        };
      }
    });

    setIsEmpty(isEmpty);

    return isEmpty ? (Object.keys(isEmpty).length === 0 ? false : true) : false;
  };

  const createPayload = () => {
    let payload = {
      customer_id: productionOrderData.customerUUID,
      kit_id: productionOrderData.kitParentUUID,
      driver1_id: productionOrderData.driver_1UUID,
      driver2_id: productionOrderData.driver_2UUID,
      date: date,
      time: time,
      po_notes: productionOrderData.poNotes,
      notes: productionOrderData.notes,
      quantity: productionOrderData.quantity,
      unit_id: productionOrderData.uomUUID,
      is_remote_pick: productionOrderData.remotePick,
      is_allergen_pick: productionOrderData.allergenPick,
    };
    return payload;
  };

  //On Press Add New production Order
  const onPressAddNewProductionOrder = () => {
    if (!productionOrderDetailsEmpty()) {
      setLoading(true);
      let payload = createPayload();
      getAddProductionOrder(payload)
        .then((res) => {
          setLoading(false);
          navigate("/smart-schedule");
        })
        .catch((error) => {
          console.log(error?.response);
          setLoading(false);
        });
    }
  };
  //End Buttons
  const Buttons = () => {
    return (
      <div className="buttons d-flex">
        <Button
          size="medium"
          className="capitalize mr-[10px]"
          component="span"
          variant="outlined"
          color="secondary"
          disabled={loading}
          onClick={() => navigate("/smart-schedule")}>
          Cancel
        </Button>
        <Button
          size="medium"
          className="capitalize mr-[10px]"
          component="span"
          color="primary"
          variant="contained"
          loading={loading}
          disabled={loading}
          onClick={onPressAddNewProductionOrder}>
          Save
        </Button>
      </div>
    );
  };

  //UseEffect For Get All The Dependencies
  useEffect(() => {
    allDependences({
      type: "production",
    });
  }, []);

  //UseEffect For Set Drivers
  useEffect(() => {
    const remainingDrivers = dependences?.drivers?.filter((item) => {
      if (
        item?.uuid !== productionOrderData?.driver_1UUID &&
        item?.uuid !== productionOrderData?.driver_2UUID
      ) {
        return item;
      }
    });
    setDrivers(remainingDrivers);
  }, [
    dependences,
    productionOrderData?.driver_1UUID,
    productionOrderData?.driver_2UUID,
  ]);

  //Get Kits
  useEffect(() => {
    if (productionOrderData?.customerUUID !== "") {
      dispatch(
        getKitParent({ customer_id: productionOrderData?.customerUUID })
      );
    }
  }, [productionOrderData?.customerUUID]);

  return (
    <div className="flex flex-col justify-between h-[100vh]">
      <div>
        {/* Bread Crums Start*/}
        <div className="flex justify-between items-center p-3 bg-white border-bottom">
          <div>
            <BreadCrumb
              routes={[
                {
                  name: "ShiftERP",
                  route: "/dashboard",
                  color: true,
                },
                {
                  name: "Smart Schedule",
                  route: "/smart-schedule",
                  color: true,
                },
                {
                  name: "Add New Production Order",
                },
              ]}
            />
            <div>
              <Add className="mb-1" color="primary" />
              <span className="font-semibold">Add New Production Order</span>
            </div>
          </div>
          <Buttons />
        </div>
        {/* Bread Crums End*/}

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
                    <MaterialDropdown
                      multiple={false}
                      options={customers}
                      value={productionOrderData.customerUUID}
                      label={"Customer"}
                      name="customerUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleCustomerChange}
                      userRoleToShow={productionOrderData.customerName}
                      error={
                        isEmpty?.customerUUID ? "Customer is required" : ""
                      }
                      errorMsg={
                        isEmpty?.customerUUID ? "Customer is required" : ""
                      }
                      errorState={isEmpty?.customerUUID}
                    />
                    {loadingDepend ? (
                      <span className="text-[12px] text-success">
                        Loading...
                      </span>
                    ) : customers?.length === 0 ? (
                      <span className="ml-1 text-[12px] text-danger">
                        Please add Customer First
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="form-row mb-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={0}>
                        <div className="flex justify-between">
                          <DesktopDatePicker
                            className="w-full"
                            label="Date"
                            inputFormat="DD/MM/YYYY"
                            value={value}
                            onChange={handleTimeChange}
                            renderInput={(params) => (
                              <TimeField
                                sx={{
                                  width: "500px",
                                }}
                                id="inputDate"
                                {...params}
                              />
                            )}
                          />
                          <TimePicker
                            label="Time"
                            value={value}
                            onChange={handleTimeChange}
                            renderInput={(params) => (
                              <TimeField
                                sx={{
                                  marginLeft: "10px",
                                }}
                                id="inputDate"
                                {...params}
                              />
                            )}
                          />
                        </div>
                      </Stack>
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Shipping */}
          <div className="border rounded bg-white pb-0.5 mx-4 mt-[20px]">
            <h6 className="px-3 py-3">Shipping</h6>
            <form className="px-3">
              <div className=" row">
                {/* Left Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={drivers}
                      value={productionOrderData.driver_1UUID}
                      label={"Driver 1"}
                      name="driver_1UUID"
                      withRenderValue
                      fullWidth
                      onChange={(e) =>
                        shippingOnChange(productionOrderData.driver_1UUID, e)
                      }
                      userRoleToShow={productionOrderData.driver_1}
                      error={
                        isEmpty?.driver_1UUID ? "Driver 1 is required" : ""
                      }
                      errorMsg={
                        isEmpty?.driver_1UUID ? "Driver 1 is required" : ""
                      }
                      errorState={isEmpty?.driver_1UUID}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={drivers}
                      value={productionOrderData.driver_2UUID}
                      label={"Driver 2"}
                      name="driver_2UUID"
                      withRenderValue
                      fullWidth
                      onChange={(e) =>
                        shippingOnChange(productionOrderData.driver_1UUID, e)
                      }
                      userRoleToShow={productionOrderData.driver_2}
                      error={
                        isEmpty?.driver_2UUID ? "Driver 2 is required" : ""
                      }
                      errorMsg={
                        isEmpty?.driver_2UUID ? "Driver 2 is required" : ""
                      }
                      errorState={isEmpty?.driver_2UUID}
                    />
                  </div>
                </div>
                {/* Right Section */}
              </div>
            </form>
          </div>

          {/* Products */}
          <div className="border rounded bg-white pb-0.5 mx-4 mt-[20px]">
            <h6 className="px-3 py-3">Products</h6>
            <form className="px-3">
              <div className=" row">
                {/* Left Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={kitParent}
                      value={productionOrderData.kitParentUUID}
                      label={"Kit Parent"}
                      name="kitParentUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleCustomerChange}
                      userRoleToShow={productionOrderData.kitParentName}
                      error={
                        isEmpty?.kitParentUUID ? "Kit Parent is required" : ""
                      }
                      errorMsg={
                        isEmpty?.kitParentUUID ? "Kit Parent is required" : ""
                      }
                      errorState={isEmpty?.kitParentUUID}
                    />
                    {productionOrderData?.customerName.length === 0 ? (
                      <span className="text-[12px] text-danger">
                        Please Select Customer First
                      </span>
                    ) : (
                      ""
                    )}
                    {loadingKits ? (
                      <span className="text-[12px] text-success">
                        Loading...
                      </span>
                    ) : productionOrderData?.customerUUID !== "" &&
                      kitParent?.length === 0 ? (
                      <span className="text-[12px] text-danger">
                        Note: This Customer Have No Kit Parent
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="form-row mb-3">
                    <div className="flex gap-2 justify-between">
                      <div className="w-9/12">
                        <TextField
                          size="small"
                          label="Amount"
                          type={"text"}
                          name="quantity"
                          value={productionOrderData.quantity}
                          fullWidth
                          onChange={handleChangeQuantityAndNotes}
                          helperText={
                            isEmpty?.quantity ? "Amount is required" : ""
                          }
                          error={isEmpty?.quantity ? true : false}
                        />
                      </div>

                      <div className="w-3/12 ml-2">
                        <MaterialDropdown
                          multiple={false}
                          options={units}
                          value={productionOrderData.uomUUID}
                          label={"UOM"}
                          name="uomUUID"
                          withRenderValue
                          fullWidth
                          onChange={handleChangeUnits}
                          userRoleToShow={productionOrderData.uomName}
                          error={isEmpty?.uomUUID ? "UOM is required" : ""}
                          errorMsg={isEmpty?.uomUUID ? "UOM is required" : ""}
                          errorState={isEmpty?.uomUUID}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-row mb-3">
                    <div className="border rounded col-12 row ml-0">
                      <div className="border-bottom flex flex-row justify-between h-10">
                        <p className="mt-2">Remote Pick</p>
                        <Switch
                          checked={
                            productionOrderData.remotePick === 1 ? true : false
                          }
                          value={productionOrderData.remotePick}
                          onChange={(event) =>
                            setProductionOrderData({
                              ...productionOrderData,
                              remotePick: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                      </div>
                      <div className="border-bottom flex flex-row justify-between h-10">
                        <p className="mt-2">Allergen Pick</p>
                        <Switch
                          checked={
                            productionOrderData.allergenPick === 1
                              ? true
                              : false
                          }
                          value={productionOrderData.allergenPick}
                          onChange={(event) =>
                            setProductionOrderData({
                              ...productionOrderData,
                              allergenPick: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Notes"
                      type={"text"}
                      name="notes"
                      value={productionOrderData.notes}
                      fullWidth
                      onChange={handleChangeQuantityAndNotes}
                      helperText={isEmpty?.notes ? "Notes is required" : ""}
                      error={isEmpty?.notes ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="PO Notes"
                      type={"text"}
                      name="poNotes"
                      value={productionOrderData.poNotes}
                      fullWidth
                      onChange={handleChangeQuantityAndNotes}
                      helperText={
                        isEmpty?.poNotes ? "PO Notes is required" : ""
                      }
                      error={isEmpty?.poNotes ? true : false}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewProductionOrder;
