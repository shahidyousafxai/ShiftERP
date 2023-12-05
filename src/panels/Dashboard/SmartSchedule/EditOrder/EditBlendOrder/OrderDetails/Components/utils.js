/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
// Library Imports
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Delete, Edit } from "@mui/icons-material";
import { Popover, Stack } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// Local Imports
import {
  Button,
  CustomModal,
  MaterialDropdown,
  Typography,
  MultiDropDown,
} from "../../../../../../../shared";
import usePostRequest from "../../../../../../../helpers/usePostRequest";
import { updateOrderDetails } from "../../../../../../../api/smartSchedule";
import CustomPopoverButton from "../../../../../../../shared/PopOver";
import { danger } from "../../../../../../../helpers/GlobalVariables";

//validate Input
const validateInput = (name, text) => {
  const numbers = /^(?!(0))[0-9]*$/;
  const alphaNum = /^[0-9a-zA-Z\s]*$/;

  if (name === "poNumber" || name === "releaseNumber" || name === "amount") {
    return numbers.test(text);
  } else if (name === "notes") {
    return alphaNum.test(text);
  } else {
    return true;
  }
};

//Customer Input Component
function Input({
  id,
  type,
  name,
  value,
  placeholder,
  input_classes,
  label,
  label_classes,
  disabled,
  readonly,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={"text"}
        name={name}
        value={value}
        placeholder={placeholder}
        className={`block pl-3 pr-1 py-[10px] w-full text-sm border-borderGray border-[1px] text-black bg-transparent focus:outline-none focus:ring-0 peer rounded-[4px] disabled:bg-lightGray disabled:cursor-not-allowed ${input_classes}`}
        disabled={disabled}
        readOnly={readonly}
      />
      <label
        htmlFor={id}
        className={`!text-darkGray absolute ml-[3px] duration-300 origin-[0] top-[4px] scale-75 -translate-y-4 bg-gradient-to-t from-slate-100 px-1 to-white border-t-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-focus:px-2 peer-focus:top-[6px] peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:bg-white peer-disabled:cursor-not-allowed left-1 cursor-text ${label_classes}`}>
        {label}
      </label>
    </div>
  );
}

//Edit Basic Info
export const BasicInfoModal = ({
  setOpenBasicInfoModal,
  openBasicInfoModal,
  orderDetailsData,
  getSingleDetails,
  id,
}) => {
  //States
  const [basicInfoData, setBasicInfoData] = useState({
    amount: "",
  });
  const [date, setDate] = useState(orderDetailsData?.date);
  const [time, setTime] = useState(orderDetailsData?.time);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [isEmpty, setIsEmpty] = useState([]);
  const { loading, data, UsePost } = usePostRequest();

  //handleTime change
  const handleTimeChange = (newValue) => {
    let changeDate = `${newValue?.$D}-${newValue?.$M + 1}-${newValue?.$y}`;
    const currTime = `${newValue?.$H}:${newValue?.$m}:${newValue?.$s}`;
    setValue(newValue);
    setDate(changeDate);
    setTime(currTime);
  };

  //handleChange All TextField
  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      setBasicInfoData({
        ...basicInfoData,
        [e.target.name]: e.target.value,
      });
      setIsEmpty({
        ...isEmpty,
        [e.target.name]: false,
      });
      setError("");
    }
  };

  //Validating Every input If Empty
  const basicInfoDetailsEmpty = () => {
    let isEmpty;
    // Storing values in object if they have empty values
    Object.values(basicInfoData).map((item, index) => {
      if (item === null || item === "") {
        isEmpty = {
          ...isEmpty,
          [Object.keys(basicInfoData)[index]]: true,
        };
      }
    });

    setIsEmpty(isEmpty);
    return isEmpty ? (Object.keys(isEmpty).length === 0 ? false : true) : false;
  };

  //canceButton
  const CancelBasicInfoButton = () => {
    setOpenBasicInfoModal(false);
    setError("");
    getSingleDetails();
  };

  //onSaveBasicInfo
  const onSaveBasicInfo = () => {
    if (!basicInfoDetailsEmpty()) {
      let payload = {
        order_id: id,
        type: "basic_info",
        date: date,
        time: time,
        amount: basicInfoData?.amount,
      };
      UsePost(updateOrderDetails, payload);
    }
  };

  //useEffect for setting value
  useEffect(() => {
    setValue(dayjs(`${orderDetailsData?.date}T${orderDetailsData?.time}`));
    setBasicInfoData({
      amount: orderDetailsData?.blendOrder?.quantity,
    });
    setDate(orderDetailsData?.date);
    setTime(orderDetailsData?.time);
  }, [orderDetailsData]);

  //Buttons Component
  const Buttons = () => {
    return (
      <div className={`bg-white overflow-auto d-flex justify-end`}>
        <div className="buttons d-flex py-1">
          <Button
            size="medium"
            className="capitalize w-20 mr-[10px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={CancelBasicInfoButton}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="capitalize w-20 mr-[5px]"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading}
            onClick={onSaveBasicInfo}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (data !== null) {
      if (data?.status) {
        setOpenBasicInfoModal(false);
        getSingleDetails();
      } else {
        setError(data?.data?.data?.message);
        console.log("error in Basic infor", data?.data?.data?.message);
        setOpenBasicInfoModal(true);
      }
    }
  }, [data]);

  return (
    <CustomModal
      open={openBasicInfoModal}
      width={window.innerWidth * 0.35}
      close={() => {
        setOpenBasicInfoModal(true);
        setError("");
      }}>
      <div className="px-[20px] pb-[20px] pt-2 flex flex-col ">
        <div className="flex justify-between pb-3">
          <div className="d-flex flex-row justify-content-between align-items-center text-center font-bold">
            <div className="pointer">
              <Edit className="mx-2" color="primary" fontSize="small" />
            </div>
            Edit Blend Order Details
          </div>
          <IconButton
            className=" cursor-pointer"
            onClick={CancelBasicInfoButton}>
            <CloseRoundedIcon className="text-secondaryColor" />
          </IconButton>
        </div>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <form className="px-1 w-full">
            <div className="row">
              <div className="form-group">
                <div className="form-row mb-3">
                  <Input
                    id="my-input"
                    type="text"
                    name="customerUUID"
                    value={orderDetailsData?.customer?.name}
                    placeholder="Customer Name"
                    input_classes="my-input-class"
                    label="Customer Name"
                    label_classes="my-label-class"
                    disabled={true}
                    readonly={false}
                  />
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
                            <TextField
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
                            <TextField
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

                <div className="form-row mb-3">
                  <TextField
                    size="small"
                    label="Amount"
                    type={"text"}
                    name="amount"
                    value={basicInfoData?.amount}
                    fullWidth
                    onChange={handleOnChange}
                    helperText={isEmpty?.amount ? "Amount is required" : ""}
                    error={isEmpty?.amount ? true : false}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <Typography
          variant="body1"
          fontSize={15}
          fontWeight="light"
          color={danger}>
          {error}
        </Typography>
        <Buttons />
      </div>
    </CustomModal>
  );
};

//Edit Shipping Details
export const ShippingDetailsModal = ({
  setShippingDetailsModal,
  shippingDetailsModal,
  orderDetailsData,
  id,
  getSingleDetails,
  dependences,
}) => {
  const { loading, data, UsePost } = usePostRequest();
  const shipper = dependences?.shipper;
  const ship_To = dependences?.shipTo;
  const stackType = dependences?.stack_types;
  const chargeType = dependences?.charge_types;

  const [drivers, setDrivers] = useState([]);
  const [isEmpty, setIsEmpty] = useState([]);
  const [error, setError] = useState("");

  //shipping Data State
  const [shippingDetailsData, setShippingDetailsData] = useState({
    shipperName: "",
    shipperUUID: "",
    driver1: "",
    driver1UUID: "",
    driver1Obj: {
      name: "",
      uuid: "",
    },
    driver2: "",
    driver2UUID: "",
    driver2Obj: {
      name: "",
      uuid: "",
    },
    shipToName: "",
    shipToUUID: "",
    stackTypeName: "",
    stackTypeUUID: "",
    chargeTypeName: "",
    chargeTypeUUID: "",
    notes: "",
  });

  //handleChangeDependancies except drivers
  const handleDependanciesChange = (e) => {
    if ((e.target.name, e.target.value)) {
      if (e.target.name === "shipperUUID") {
        let name = "";
        shipper?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.shipper_name;
            return item?.shipper_name;
          }
        });

        setShippingDetailsData({
          ...shippingDetailsData,
          shipperName: name,
          [e.target.name]: e.target.value,
        });
        setError("");
      } else if (e.target.name === "shipToUUID") {
        let name = "";
        ship_To?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setShippingDetailsData({
          ...shippingDetailsData,
          shipToName: name,
          [e.target.name]: e.target.value,
        });
        setError("");
      } else if (e.target.name === "stackTypeUUID") {
        let name = "";
        stackType?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setShippingDetailsData({
          ...shippingDetailsData,
          stackTypeName: name,
          [e.target.name]: e.target.value,
        });
        setError("");
      } else if (e.target.name === "chargeTypeUUID") {
        let name = "";
        chargeType?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setShippingDetailsData({
          ...shippingDetailsData,
          chargeTypeName: name,
          [e.target.name]: e.target.value,
        });
        setError("");
      } else {
        setShippingDetailsData({
          ...shippingDetailsData,
          [e.target.name]: e.target.value,
        });
        setError("");
      }
    }
    setIsEmpty({
      ...isEmpty,
      [e.target.name]: false,
    });
  };

  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      setShippingDetailsData({
        ...shippingDetailsData,
        [e.target.name]: e.target.value,
      });
      setIsEmpty({
        notes: false,
      });
      setError("");
    }
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

    setShippingDetailsData({
      ...shippingDetailsData,
      [driverName]: selectedItem[0]?.item?.name,
      [name]: selectedItem[0]?.item?.uuid,
      [driverObj]: selectedItem[0]?.item,
    });

    setIsEmpty({
      ...isEmpty,
      [event.target.name]: false,
    });
  };

  //canceButton
  const CancelBasicInfoButton = () => {
    setShippingDetailsModal(false);
    getSingleDetails();
  };

  //onSaveBasicInfo
  const onSaveShippingDetails = () => {
    let payload = {
      order_id: id,
      type: "shipping",
      driver1_id: shippingDetailsData?.driver1UUID,
      driver2_id: shippingDetailsData?.driver2UUID,
      ship_to_id: shippingDetailsData?.shipToUUID,
      shipper_id: shippingDetailsData?.shipperUUID,
      stack_type_id: shippingDetailsData?.stackTypeUUID,
      charge_type_id: shippingDetailsData?.chargeTypeUUID,
      notes: shippingDetailsData?.notes,
    };
    if (payload?.driver1_id && payload?.driver2_id && payload?.notes !== "") {
      UsePost(updateOrderDetails, payload);
    } else if (payload?.driver1_id && !payload?.driver2_id) {
      setIsEmpty({ driver2UUID: true });
    } else if (!payload?.driver1_id && payload?.driver2_id) {
      setIsEmpty({ driver1UUID: true });
    } else if (payload.notes === "") {
      setIsEmpty({ notes: true });
    }
  };

  //Buttons
  const Buttons = () => {
    return (
      <div className={`bg-white overflow-auto d-flex justify-end`}>
        <div className="buttons d-flex py-1">
          <Button
            size="medium"
            className="capitalize w-20 mr-[10px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={CancelBasicInfoButton}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="capitalize w-20 mr-[5px]"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading}
            onClick={onSaveShippingDetails}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  //UseEffect For Drivers
  useEffect(() => {
    const remainingDrivers = dependences?.drivers?.filter((item) => {
      if (
        item?.uuid !== shippingDetailsData?.driver1UUID &&
        item?.uuid !== shippingDetailsData?.driver2UUID
      ) {
        return item;
      }
    });
    setDrivers(remainingDrivers);
  }, [
    dependences,
    shippingDetailsData?.driver1UUID,
    shippingDetailsData?.driver2UUID,
  ]);

  useEffect(() => {
    if (data !== null) {
      if (data?.status) {
        setShippingDetailsModal(false);
        getSingleDetails();
      } else {
        setError(data?.data?.data?.message);
        console.log("error in shipping details", data?.data);
        setShippingDetailsModal(true);
      }
    }
  }, [data]);

  //useEffect for setting value
  useEffect(() => {
    setShippingDetailsData({
      shipperName:
        orderDetailsData?.shipping_order?.shipper?.name ||
        orderDetailsData?.receiving_order?.shipper?.name,
      shipperUUID:
        orderDetailsData?.shipping_order?.shipper?.uuid ||
        orderDetailsData?.receiving_order?.shipper?.uuid,
      driver1: orderDetailsData?.driver1?.name,
      driver1UUID: orderDetailsData?.driver1?.uuid,
      driver1Obj: {
        name: orderDetailsData?.driver1?.name,
        uuid: orderDetailsData?.driver1?.uuid,
      },
      driver2: orderDetailsData?.driver2?.name,
      driver2UUID: orderDetailsData?.driver2?.uuid,
      driver2Obj: {
        name: orderDetailsData?.driver2?.name,
        uuid: orderDetailsData?.driver2?.uuid,
      },
      shipToName: orderDetailsData?.shipping_order?.shipTo?.name,
      shipToUUID: orderDetailsData?.shipping_order?.shipTo?.uuid,
      stackTypeName: orderDetailsData?.shipping_order?.stackType?.name,
      stackTypeUUID: orderDetailsData?.shipping_order?.stackType?.uuid,
      chargeTypeName: orderDetailsData?.shipping_order?.chargeType?.name,
      chargeTypeUUID: orderDetailsData?.shipping_order?.chargeType?.uuid,
      notes: orderDetailsData?.notes,
    });
  }, [orderDetailsData]);

  return (
    <CustomModal
      open={shippingDetailsModal}
      width={window.innerWidth * 0.35}
      close={() => {
        setShippingDetailsModal(true);
        setError("");
      }}>
      <div className="px-[20px] pb-[20px] pt-2 flex flex-col ">
        <div className="flex justify-between pb-3">
          <div className="d-flex flex-row justify-content-between align-items-center text-center font-bold">
            <div className="pointer">
              <Edit className="mx-2" color="primary" fontSize="small" />
            </div>
            Edit Shipping Details
          </div>
          <IconButton
            className=" cursor-pointer"
            onClick={CancelBasicInfoButton}>
            <CloseRoundedIcon className="text-secondaryColor" />
          </IconButton>
        </div>
        <div className="flex flex-col px-1 justify-center">
          <div className="form-row mb-3">
            <MaterialDropdown
              multiple={false}
              options={drivers}
              value={shippingDetailsData.driver1UUID}
              label={"Driver 1"}
              name="driver1UUID"
              withRenderValue
              fullWidth
              onChange={(e) =>
                shippingOnChange(shippingDetailsData.driver1Obj, e)
              }
              userRoleToShow={shippingDetailsData.driver1}
              error={isEmpty?.driver1UUID ? "Driver 1 is required" : ""}
              errorMsg={isEmpty?.driver1UUID ? "Driver 1 is required" : ""}
              errorState={isEmpty?.driver1UUID}
            />
          </div>

          <div className="form-row mb-3">
            <MaterialDropdown
              multiple={false}
              options={drivers}
              value={shippingDetailsData.driver2UUID}
              label={"Driver 2"}
              name="driver2UUID"
              withRenderValue
              fullWidth
              onChange={(e) =>
                shippingOnChange(shippingDetailsData.driver2Obj, e)
              }
              userRoleToShow={shippingDetailsData.driver2}
              error={isEmpty?.driver2UUID ? "Driver 2 is required" : ""}
              errorMsg={isEmpty?.driver2UUID ? "Driver 2 is required" : ""}
              errorState={isEmpty?.driver2UUID}
            />
          </div>
          {/* charge and stack type */}
          {/* <div className="mb-3 ">
            <MaterialDropdown
              multiple={false}
              options={chargeType}
              value={shippingDetailsData.chargeTypeUUID}
              label={"Charge Type"}
              name="chargeTypeUUID"
              withRenderValue
              fullWidth
              onChange={handleDependanciesChange}
              userRoleToShow={shippingDetailsData.chargeTypeName}
              error={isEmpty?.chargeTypeUUID ? "Charge Type is required" : ""}
              errorMsg={
                isEmpty?.chargeTypeUUID ? "Charge Type is required" : ""
              }
              errorState={isEmpty?.chargeTypeUUID}
            />
          </div>

          <div className="mb-3 ">
            <MaterialDropdown
              multiple={false}
              options={stackType}
              value={shippingDetailsData.stackTypeUUID}
              label={"Stack Type"}
              name="stackTypeUUID"
              withRenderValue
              fullWidth
              onChange={handleDependanciesChange}
              userRoleToShow={shippingDetailsData.stackTypeName}
              error={isEmpty?.stackTypeUUID ? "Stack Type is required" : ""}
              errorMsg={isEmpty?.stackTypeUUID ? "Stack Type is required" : ""}
              errorState={isEmpty?.stackTypeUUID}
            />
          </div> */}

          {/* Notes */}
          <div className="form-row mb-3">
            <TextField
              size="small"
              label="Notes"
              type={"text"}
              name="notes"
              value={shippingDetailsData.notes}
              fullWidth
              onChange={handleOnChange}
              helperText={isEmpty?.notes ? "Notes is required" : ""}
              error={isEmpty?.notes ? true : false}
            />
          </div>
        </div>
        <Typography
          variant="body1"
          fontSize={15}
          fontWeight="light"
          color={danger}>
          {error}
        </Typography>
        <Buttons />
      </div>
    </CustomModal>
  );
};

export const ManageItem = ({ id, removeItem }) => {
  const index = id;
  return (
    <div className="flex flex-row justify-center items-center">
      <CustomPopoverButton
        classes="w-6"
        icon={true}
        children={
          <div
            className={`pointer  ${
              index % 2 === 0 ? "!bg-white" : "!bg-lightGray"
            }`}>
            <SettingsIcon color="secondary" />
          </div>
        }
        placement="bottomEnd"
        speaker={
          <Popover>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col justify-center items-start">
                <div onClick={() => removeItem(index)} className="me-4 pointer">
                  <Delete color="secondary" className="me-2" />
                  Remove
                </div>
              </div>
            </div>
          </Popover>
        }
      />
    </div>
  );
};
