/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { Add, Delete, Error } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack, TextField as TimeField } from "@mui/material";
import {
  MaterialDropdown,
  BreadCrumb,
  CustomModal,
  Button,
  MuiSwitch as Switch,
  TextField,
  Typography,
  MultiDropDown,
} from "../../../../shared";
import { getAddShippingOrder } from "../../../../api/universalModelData";
import { getAllDependencyOrder } from "../../../../api/smartSchedule";

const AddNewShippingOrder = () => {
  let navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [shipper, setShipper] = useState([]);
  const [ship_To, setShip_To] = useState([]);
  const [charge_Type, setCharge_Type] = useState([]);
  const [stack_Type, setStack_Type] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [dependencyLoading, setDependencyLoading] = useState(false);
  const [dependenciesArray, setDependenciesArray] = useState([]);

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
  const [value, setValue] = useState();
  const [isEmpty, setIsEmpty] = useState({
    customerUUID: false,
    poNumber: false,
    releaseNumber: false,
    facilities: false,
    shipperUUID: false,
    shipToUUID: false,
    driver1UUID: false,
    driver2UUID: false,
    stackTypeUUID: false,
    chargeTypeUUID: false,
    notes: false,
    poNotes: false,
    itemsEmpty: false,
    items: false,
  });
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });

  //Form Data
  const [shippingOrderData, setShippingOrderData] = useState({
    customerName: "",
    customerUUID: "",
    poNumber: "",
    releaseNumber: "",
    shipperName: "",
    shipperUUID: "",
    facilities: [],
    driver1: "",
    driver1UUID: "",
    driver1Obj: "",
    driver2: "",
    driver2UUID: "",
    driver2Obj: "",
    shipToName: "",
    shipToUUID: "",
    stackTypeName: "",
    stackTypeUUID: "",
    chargeTypeName: "",
    chargeTypeUUID: "",
    remotePick: 0,
    allergenPick: 0,
    customerCalled: 0,
    notes: "",
    poNotes: "",
    items: "",
  });

  const [items, setItems] = useState([1]);
  const [itemsDropdownData, setItemsDropdownData] = useState({
    items: [],
    unit: [],
  });

  const [remainingProducts, setRemainingProducts] = useState([]);
  //validate Input
  const validateInput = (name, text) => {
    var numbers = /^(?!(0))[0-9]*$/;
    var alphaNum = /^[0-9a-zA-Z\s]*$/;

    if (name === "poNumber" || name === "releaseNumber") {
      return numbers.test(text);
    } else if (name === "notes" || name === "poNotes") {
      return alphaNum.test(text);
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

  //handle change customer,shipper,shipTo,Stacktype,chargeType
  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      if (e.target.name === "customerUUID") {
        if (
          shippingOrderData?.customerUUID !== "" &&
          shippingOrderData?.customerName !== "" &&
          (Object.keys(shippingOrderData.items).length > 0 ||
            shippingOrderData?.facilities?.length > 0)
        ) {
          setIsOpenModal(true);
        } else {
          let name = "";
          customers?.filter((item) => {
            if (item?.uuid === e.target.value) {
              name = item?.name;
              return item?.name;
            }
          });

          setShippingOrderData({
            ...shippingOrderData,
            customerName: name,
            [e.target.name]: e.target.value,
          });
        }
      } else if (e.target.name === "shipperUUID") {
        let name = "";
        shipper?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.shipper_name;
            return item?.shipper_name;
          }
        });

        setShippingOrderData({
          ...shippingOrderData,
          shipperName: name,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.name === "shipToUUID") {
        let name = "";
        ship_To?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setShippingOrderData({
          ...shippingOrderData,
          shipToName: name,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.name === "stackTypeUUID") {
        let name = "";
        stack_Type?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setShippingOrderData({
          ...shippingOrderData,
          stackTypeName: name,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.name === "chargeTypeUUID") {
        let name = "";
        charge_Type?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setShippingOrderData({
          ...shippingOrderData,
          chargeTypeName: name,
          [e.target.name]: e.target.value,
        });
      } else {
        setShippingOrderData({
          ...shippingOrderData,
          [e.target.name]: e.target.value,
        });
      }
    }
    setIsEmpty({
      ...isEmpty,
      customerUUID: false,
      poNumber: false,
      releaseNumber: false,
      shipperUUID: false,
      shipToUUID: false,
      stackTypeUUID: false,
      chargeTypeUUID: false,
      notes: false,
      poNotes: false,
    });
  };

  //handle multiple facilities
  const handleMultiChange = (e, newValue) => {
    setShippingOrderData({
      ...shippingOrderData,
      facilities: newValue,
    });
    setIsEmpty({
      ...isEmpty,
      facilities: false,
    });
  };

  const itemOnChange = (e, itemNum) => {
    if (shippingOrderData?.items) {
      if (`${itemNum}` in shippingOrderData?.items) {
        let existingItem = shippingOrderData?.items?.[itemNum];
        if (e.target.name === "itemNotes") {
          existingItem.notes = e.target.value;
          let data = { ...shippingOrderData?.items, [itemNum]: existingItem };
          setShippingOrderData({ ...shippingOrderData, items: data });
        }
        if (e.target.name === "item") {
          let selectedItem = itemsDropdownData?.items?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          if (existingItem?.item !== undefined) {
            let newArray = [...remainingProducts, existingItem?.item];
            let newRemaingArray = newArray.filter(
              (item) => item?.uuid !== selectedItem?.uuid
            );
            setRemainingProducts(newRemaingArray);
          }
          existingItem.item = selectedItem;
          let data = { ...shippingOrderData?.items, [itemNum]: existingItem };
          setShippingOrderData({ ...shippingOrderData, items: data });
        }
        if (e.target.name === "itemAmount") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          existingItem.amount = e.target.value;
          let data = { ...shippingOrderData?.items, [itemNum]: existingItem };
          setShippingOrderData({ ...shippingOrderData, items: data });
        }
        if (e.target.name === "unit") {
          let selectedUnit = itemsDropdownData?.unit?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          existingItem.unit = selectedUnit;
          let data = { ...shippingOrderData?.items, [itemNum]: existingItem };
          setShippingOrderData({ ...shippingOrderData, items: data });
        }
      } else {
        if (e.target.name === "itemNotes") {
          let data = {
            ...shippingOrderData?.items,
            [itemNum]: { notes: e.target.value },
          };
          setShippingOrderData({ ...shippingOrderData, items: data });
        }
        if (e.target.name === "item") {
          let selectedItem = itemsDropdownData?.items?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          let data = {
            ...shippingOrderData?.items,
            [itemNum]: { item: selectedItem },
          };
          setShippingOrderData({ ...shippingOrderData, items: data });
        }
        if (e.target.name === "itemAmount") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = {
            ...shippingOrderData?.items,
            [itemNum]: { amount: e.target.value },
          };
          setShippingOrderData({ ...shippingOrderData, items: data });
        }
        if (e.target.name === "unit") {
          let selectedUnit = itemsDropdownData?.unit?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          let data = {
            ...shippingOrderData?.items,
            [itemNum]: { item: selectedUnit },
          };
          setShippingOrderData({ ...shippingOrderData, items: data });
        }
      }
    } else {
      if (e.target.name === "itemNotes") {
        let data = { [itemNum]: { notes: e.target.value } };
        setShippingOrderData({ ...shippingOrderData, items: data });
      }
      if (e.target.name === "item") {
        let selectedItem = itemsDropdownData?.items?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { item: selectedItem } };
        setShippingOrderData({ ...shippingOrderData, items: data });
      }
      if (e.target.name === "itemAmount") {
        e.target.value = e.target.value.replace(/[^\d]/g, "");
        e.target.value.charAt(0) === "0"
          ? (e.target.value = "")
          : (e.target.value = e.target.value);
        let data = { [itemNum]: { amount: e.target.value } };
        setShippingOrderData({ ...shippingOrderData, items: data });
      }
      if (e.target.name === "unit") {
        let selectedUnit = itemsDropdownData?.unit?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { unit: selectedUnit } };
        setShippingOrderData({ ...shippingOrderData, items: data });
      }
    }

    setIsEmpty({
      ...isEmpty,
      itemsEmpty: false,
      items: false,
    });
  };

  const getItemsRowValues = (from, type, itemNum) => {
    if (from === "Notes") {
      return type === "value" &&
        shippingOrderData?.items &&
        shippingOrderData?.items[itemNum]?.notes
        ? shippingOrderData?.items[itemNum]?.notes
        : "";
    }
    if (from === "Item") {
      return type === "value"
        ? shippingOrderData?.items &&
          shippingOrderData?.items[itemNum]?.item?.uuid
          ? shippingOrderData?.items[itemNum]?.item?.uuid
          : ""
        : shippingOrderData?.items &&
          shippingOrderData?.items[itemNum]?.item?.name
        ? `${shippingOrderData?.items[itemNum]?.item?.name} - ${shippingOrderData?.items[itemNum]?.item?.description}`
        : "";
    }
    if (from === "Amount") {
      return type === "value" &&
        shippingOrderData?.items &&
        shippingOrderData?.items[itemNum]?.amount
        ? shippingOrderData?.items[itemNum]?.amount
        : "";
    }
    if (from === "Unit") {
      return type === "value"
        ? shippingOrderData?.items &&
          shippingOrderData?.items[itemNum]?.unit?.uuid
          ? shippingOrderData?.items[itemNum]?.unit?.uuid
          : ""
        : shippingOrderData?.items &&
          shippingOrderData?.items[itemNum]?.unit?.name
        ? shippingOrderData?.items[itemNum]?.unit?.name
        : "";
    }
  };

  const itemOnDelete = (index, item) => {
    setItems(items.filter((_, i) => i !== index).map((_, i) => i + 1));
    // Deleting Row Data From State
    let data = shippingOrderData?.items;
    if (data?.[item]?.item) {
      let selectedItem = data?.[item]?.item;
      let newArray = [...remainingProducts, selectedItem];
      setRemainingProducts(newArray);
    }

    delete data?.[item];

    // Update the indexing in kitData
    let newData = {};
    Object.keys(data).forEach((key, newIndex) => {
      newData[newIndex + 1] = data[key];
    });
    // Setting State
    setShippingOrderData({ ...shippingOrderData, items: newData });
  };

  //handle change of drivers
  const shippingOnChange = (existing, event) => {
    const { name, value } = event?.target;
    const driverName = name.replace("UUID", "");
    const driverObj = name.replace("UUID", "Obj");

    const selectedItem = dependenciesArray
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

    setShippingOrderData({
      ...shippingOrderData,
      [driverName]: selectedItem[0]?.item?.name,
      [name]: selectedItem[0]?.item?.uuid,
      [driverObj]: selectedItem[0]?.item,
    });

    setIsEmpty({
      ...isEmpty,
      driver1UUID: false,
      driver2UUID: false,
    });
  };

  const createPayload = () => {
    const products = Object.values(shippingOrderData?.items).map((item) => {
      const obj = {
        product_id: item?.item?.uuid,
        unit_id: item?.unit?.uuid,
        notes: item?.notes,
        amount: item?.amount,
      };
      return obj;
    });
    let payload = {
      customer_id: shippingOrderData.customerUUID,
      driver1_id: shippingOrderData.driver1UUID,
      driver2_id: shippingOrderData.driver2UUID,
      date: date,
      time: time,
      po_number: shippingOrderData.poNumber,
      release_number: shippingOrderData.releaseNumber,
      po_notes: shippingOrderData.poNotes,
      notes: shippingOrderData.notes,
      ship_to_id: shippingOrderData.shipToUUID,
      shipper_id: shippingOrderData.shipperUUID,
      stack_type_id: shippingOrderData.stackTypeUUID,
      charge_type_id: shippingOrderData.chargeTypeUUID,
      unit_id: shippingOrderData.uomUUID,
      is_remote_pick: shippingOrderData.remotePick,
      is_allergen_pick: shippingOrderData.allergenPick,
      is_customer_called: shippingOrderData.customerCalled,
      facility_ids: shippingOrderData?.facilities?.map((item) => {
        return item?.uuid;
      }),
      products: products,
    };
    return payload;
  };

  //Validating Every input If Empty
  const shippingOrderDetailsEmpty = () => {
    if (
      shippingOrderData.customerUUID === "" ||
      shippingOrderData.customerName === ""
    ) {
      setIsEmpty({ ...isEmpty, customerUUID: true });
      return true;
    } else if (shippingOrderData.poNumber === "") {
      setIsEmpty({ ...isEmpty, poNumber: true });
      return true;
    } else if (shippingOrderData.releaseNumber === "") {
      setIsEmpty({ ...isEmpty, releaseNumber: true });
      return true;
    } else if (shippingOrderData?.facilities.length === 0) {
      setIsEmpty({ ...isEmpty, facilities: true });
      return true;
    } else if (
      shippingOrderData.shipperUUID === "" ||
      shippingOrderData?.shipperName === ""
    ) {
      setIsEmpty({ ...isEmpty, shipperUUID: true });
      return true;
    } else if (
      shippingOrderData.driver1 === "" ||
      shippingOrderData?.driver1UUID === ""
    ) {
      setIsEmpty({ ...isEmpty, driver1UUID: true });
      return true;
    } else if (
      shippingOrderData.driver2 === "" ||
      shippingOrderData?.driver2UUID === ""
    ) {
      setIsEmpty({ ...isEmpty, driver2UUID: true });
      return true;
    } else if (
      shippingOrderData.shipToUUID === "" ||
      shippingOrderData?.shipToName === ""
    ) {
      setIsEmpty({ ...isEmpty, shipToUUID: true });
      return true;
    } else if (
      shippingOrderData.stackTypeName === "" ||
      shippingOrderData?.stackTypeUUID === ""
    ) {
      setIsEmpty({ ...isEmpty, stackTypeUUID: true });
      return true;
    } else if (
      shippingOrderData.chargeTypeName === "" ||
      shippingOrderData?.chargeTypeUUID === ""
    ) {
      setIsEmpty({ ...isEmpty, chargeTypeUUID: true });
      return true;
    } else if (shippingOrderData.notes === "") {
      setIsEmpty({ ...isEmpty, notes: true });
      return true;
    } else if (shippingOrderData.poNotes === "") {
      setIsEmpty({ ...isEmpty, poNotes: true });
      return true;
    } else if (
      !shippingOrderData.items ||
      Object.keys(shippingOrderData.items).length === 0
    ) {
      setIsEmpty({ ...isEmpty, items: true, itemsEmpty: true });
      return true;
    } else if (Object.keys(shippingOrderData.items).length !== 0) {
      let check = Object.values(shippingOrderData?.items).map((item) => {
        if (
          !("notes" in item) ||
          item?.notes === "" ||
          (!("item" in item) && item?.item === "") ||
          !("amount" in item) ||
          item?.amount === "" ||
          (!("unit" in item) && item?.unit === "")
        ) {
          setIsEmpty({ ...isEmpty, items: true });
          return true;
        } else {
          return false;
        }
      });
      return check?.includes(true) ? true : false;
    } else {
      return false;
    }
  };
  const onPressAddNewShippingOrder = () => {
    if (!shippingOrderDetailsEmpty()) {
      setLoading(true);
      let payload = createPayload();
      console.log(
        "%c🚀AddPayloadShippingOrderData:",
        "color: blue;  font-family:sans-serif; font-size: 20px; font-weight: 700;",
        payload
      );
      getAddShippingOrder(payload)
        .then((res) => {
          setLoading(false);
          navigate("/smart-schedule");
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
        });
    }
  };

  const getDependencyList = () => {
    setDependencyLoading(true);
    getAllDependencyOrder({
      type: "shipping",
    })
      .then((res) => {
        let data = res?.data?.data;
        setCustomers(data?.customer);
        setDependenciesArray(data?.drivers);
        setStack_Type(data?.stack_types);
        setCharge_Type(data?.charge_types);
        setItemsDropdownData({
          ...itemsDropdownData,
          unit: data?.units,
        });
        setDependencyLoading(false);
      })
      .catch((error) => {
        setDependencyLoading(false);
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  const getCustomerProducts = (customerUUID) => {
    setDependencyLoading(true);
    getAllDependencyOrder({
      type: "shipping",
      customer_id: customerUUID,
    })
      .then((res) => {
        let data = res?.data?.data;
        setFacilities(data?.facilities);
        setShipper(data?.shipper);
        setShip_To(data?.shipTo);
        setItemsDropdownData({
          ...itemsDropdownData,
          items: data?.products,
        });
        setRemainingProducts(data?.products);
        setDependencyLoading(false);
      })
      .catch((error) => {
        setDependencyLoading(false);
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  const handleCustomerChangeModal = () => {
    setIsOpenModal(false);
    setShippingOrderData({
      ...shippingOrderData,
      customerUUID: "",
      customerName: "",
      shipperName: "",
      shipperUUID: "",
      shipToName: "",
      shipToUUID: "",
      facilities: [],
      items: "",
    });
    setItemsDropdownData({
      ...itemsDropdownData,
      items: [],
    });
    setItems([1]);
    setFacilities([]);
    setShip_To([]);
    setShipper([]);
  };
  const handleCancelCustomerChangeModal = () => {
    setIsOpenModal(false);
  };

  //End Buttons
  const Buttons = () => {
    return (
      <div className="buttons d-flex">
        <Button
          size="medium"
          className="capitalize mr-[10px] w-[80px]"
          component="span"
          variant="outlined"
          color="secondary"
          disabled={loading}
          onClick={() => navigate("/smart-schedule")}>
          Close
        </Button>
        <Button
          size="medium"
          className="capitalize mr-[10px] w-[80px]"
          component="span"
          color="primary"
          variant="contained"
          loading={loading}
          disabled={loading}
          onClick={onPressAddNewShippingOrder}>
          Save
        </Button>
      </div>
    );
  };

  //UseEffect For All Dependencies
  useEffect(() => {
    getDependencyList();
  }, []);

  useEffect(() => {
    const remainingDrivers = dependenciesArray?.filter((item) => {
      if (
        item?.uuid !== shippingOrderData?.driver1UUID &&
        item?.uuid !== shippingOrderData?.driver2UUID
      ) {
        return item;
      }
    });
    setDrivers(remainingDrivers);
  }, [
    dependenciesArray,
    shippingOrderData?.driver1UUID,
    shippingOrderData?.driver2UUID,
  ]);

  useEffect(() => {
    if (shippingOrderData?.customerUUID) {
      getCustomerProducts(shippingOrderData?.customerUUID);
    }
  }, [shippingOrderData?.customerUUID]);

  useEffect(() => {
    //orignalArray 'expect parentkit and item includes in it'
    const productRemaining = [...itemsDropdownData?.items];
    const productItem = shippingOrderData?.items;

    if (productItem && Object.values(productItem).length > 0) {
      const subItemIds = remainingProducts?.filter((subItem) => {
        return !Object.values(productItem).some(
          (item) => item?.item?.uuid === subItem?.uuid
        );
      });
      console.log("if");
      setRemainingProducts(subItemIds);
    } else {
      console.log("else");
      setRemainingProducts(productRemaining);
    }
  }, [shippingOrderData?.items]);

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
                  name: "Add New Shipping Order",
                },
              ]}
            />
            <div>
              <Add className="mb-1" color="primary" />
              <span className="font-semibold">Add New Shipping Order</span>
            </div>
          </div>
          <Buttons />
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
                  {"OK"}
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Change Customer Modal */}
        <CustomModal
          open={isOpenModal}
          close={() => setIsOpenModal(!isOpenModal)}
          width={window.innerWidth * 0.4}>
          <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row justify-content-between align-items-center text-center">
                <b className="mx-[20px] mb-1">Change Company/Facility</b>
              </div>
              <div
                className="pointer mx-3"
                onClick={handleCancelCustomerChangeModal}>
                <ClearIcon color="secondary" fontSize="small" />
              </div>
            </div>
            <div className="my-3 mx-4">
              <Typography variant="body1" fontSize={15} fontWeight="light">
                Are you sure you would like to change the Customer?
              </Typography>
            </div>
            <div className="my-3">
              <div className="form-row mx-4"></div>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  component="span"
                  color="primary"
                  className="capitalize text-white mr-[10px]"
                  variant="contained"
                  onClick={handleCustomerChangeModal}>
                  Yes
                </Button>
                <Button
                  component="span"
                  color="secondary"
                  className="capitalize"
                  variant="outlined"
                  onClick={handleCancelCustomerChangeModal}>
                  No
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Form Start*/}
        <div className="flex flex-col py-[20px] gap-4">
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
                      value={shippingOrderData.customerUUID}
                      label={"Customer"}
                      name="customerUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleOnChange}
                      userRoleToShow={shippingOrderData.customerName}
                      error={
                        isEmpty?.customerUUID ? "Customer is required" : ""
                      }
                      errorMsg={
                        isEmpty?.customerUUID ? "Customer is required" : ""
                      }
                      errorState={isEmpty?.customerUUID}
                    />
                    {dependencyLoading ? (
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
                  <div className="form-row mb-3">
                    <MultiDropDown
                      multiple={true}
                      placeholder={"Facilities"}
                      optionsArray={facilities}
                      value={shippingOrderData?.facilities}
                      // disabled={facilityUser ? true : false}
                      onChange={handleMultiChange}
                      error={isEmpty.facilities ? true : false}
                      errorMsg={isEmpty.facilities && "Facilities is required"}
                    />
                    {dependencyLoading ? (
                      <p className=" mt-[0px] text-[12px] text-success ">
                        Loading...
                      </p>
                    ) : !shippingOrderData?.customerUUID ? (
                      <p className="mt-[0px] text-[12px] text-danger ">
                        Please Select Customer First
                      </p>
                    ) : shippingOrderData?.customerUUID &&
                      facilities?.length === 0 ? (
                      <p className="mt-[0px] text-[12px] text-danger ">
                        Note: This Customer is not added in any Facilities
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Right Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="PO Number"
                      type={"text"}
                      name="poNumber"
                      value={shippingOrderData.poNumber}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty?.poNumber ? "PO Number is required" : ""
                      }
                      error={isEmpty?.poNumber ? true : false}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Release Number"
                      type={"text"}
                      name="releaseNumber"
                      value={shippingOrderData.releaseNumber}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty?.releaseNumber
                          ? "Released Number is required"
                          : ""
                      }
                      error={isEmpty?.releaseNumber ? true : false}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Shipper/Driver*/}
          <div className="border rounded bg-white pb-0.5 mx-4">
            <h6 className="px-3 py-3">Shipper/Drivers</h6>
            <form className="px-3">
              <div className=" row">
                {/* Left Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={shipper}
                      value={shippingOrderData.shipperUUID}
                      label={"Shipper"}
                      name="shipperUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleOnChange}
                      userRoleToShow={shippingOrderData.shipperName}
                      error={
                        isEmpty?.shipperUUID ? "Shipper Name is required" : ""
                      }
                      errorMsg={
                        isEmpty?.shipperUUID ? "Shipper Name is required" : ""
                      }
                      errorState={isEmpty?.shipperUUID}
                    />
                    {dependencyLoading ? (
                      <span className="text-[12px] text-success">
                        Loading...
                      </span>
                    ) : !shippingOrderData?.customerUUID ? (
                      <span className="ml-1 text-[12px] text-danger">
                        Please Select the Customer
                      </span>
                    ) : shipper?.length === 0 ? (
                      <span className="ml-1 text-[12px] text-danger">
                        This customer has no Shipper.
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={drivers}
                      value={shippingOrderData.driver1UUID}
                      label={"Driver 1"}
                      name="driver1UUID"
                      withRenderValue
                      fullWidth
                      onChange={(e) =>
                        shippingOnChange(shippingOrderData.driver1UUID, e)
                      }
                      userRoleToShow={shippingOrderData.driver1}
                      error={isEmpty?.driver1UUID ? "Driver 1 is required" : ""}
                      errorMsg={
                        isEmpty?.driver1UUID ? "Driver 1 is required" : ""
                      }
                      errorState={isEmpty?.driver1UUID}
                    />
                  </div>
                </div>

                {/* Right Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={drivers}
                      value={shippingOrderData.driver2UUID}
                      label={"Driver 2"}
                      name="driver2UUID"
                      withRenderValue
                      fullWidth
                      onChange={(e) =>
                        shippingOnChange(shippingOrderData.driver2UUID, e)
                      }
                      userRoleToShow={shippingOrderData.driver2}
                      error={isEmpty?.driver2UUID ? "Driver 2 is required" : ""}
                      errorMsg={
                        isEmpty?.driver2UUID ? "Driver 2 is required" : ""
                      }
                      errorState={isEmpty?.driver2UUID}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={ship_To}
                      value={shippingOrderData.shipToUUID}
                      label={"Ship To"}
                      name="shipToUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleOnChange}
                      userRoleToShow={shippingOrderData.shipToName}
                      error={
                        isEmpty?.shipToUUID ? "ShipTo Name is required" : ""
                      }
                      errorMsg={
                        isEmpty?.shipToUUID ? "ShipTo Name is required" : ""
                      }
                      errorState={isEmpty?.shipToUUID}
                    />
                    {dependencyLoading ? (
                      <span className="text-[12px] text-success">
                        Loading...
                      </span>
                    ) : !shippingOrderData?.customerUUID ? (
                      <span className="ml-1 text-[12px] text-danger">
                        Please Select the Customer
                      </span>
                    ) : ship_To?.length === 0 ? (
                      <span className="ml-1 text-[12px] text-danger">
                        This customer has no ShipTo
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Products */}
          <div className="border rounded bg-white py-3 px-3 mt-4 mx-4">
            <div className="flex items-center">
              <h6>Product(s)</h6>
              {isEmpty?.items && (
                <div className="ml-3 flex items-center">
                  <Error color="danger" fontSize="small" />
                  <p className="ml-2 text-danger text-sm font-semibold">
                    {isEmpty?.itemsEmpty
                      ? "Add at least one item"
                      : "All fields of items are required."}
                  </p>
                </div>
              )}
            </div>

            <div
              className={`${
                items?.length > 4 && "max-h-44 overflow-y-scroll"
              }`}>
              {items?.length > 0 &&
                items?.map((item, index) => {
                  return (
                    <form key={index} className="mt-4">
                      <div className="flex items-center w-full">
                        <div className="w-[35%] h-[40px]">
                          <MaterialDropdown
                            fullWidth
                            withRenderValue
                            multiple={false}
                            label="Item"
                            name="item"
                            options={remainingProducts}
                            value={getItemsRowValues("Item", "value", item)}
                            userRoleToShow={getItemsRowValues("Item", "", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                          {dependencyLoading ? (
                            <p className="  text-[12px] text-success ">
                              Loading...
                            </p>
                          ) : !shippingOrderData?.customerUUID ? (
                            <p className="text-[12px] text-danger">
                              Please Select Customer First
                            </p>
                          ) : shippingOrderData?.customerUUID &&
                            remainingProducts?.length === 0 &&
                            !shippingOrderData?.items[item]?.item ? (
                            <p className="text-[12px] text-danger ">
                              Note: This Customer has no Product Left
                            </p>
                          ) : null}
                        </div>

                        <div className="ml-2 w-[15%]">
                          <TextField
                            fullWidth
                            size="small"
                            label="Amount"
                            name="itemAmount"
                            value={getItemsRowValues("Amount", "value", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="ml-2 w-[15%]">
                          <MaterialDropdown
                            fullWidth
                            withRenderValue
                            multiple={false}
                            label="Unit"
                            name="unit"
                            options={itemsDropdownData?.unit}
                            value={getItemsRowValues("Unit", "value", item)}
                            userRoleToShow={getItemsRowValues("Unit", "", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="ml-2 w-[30%]">
                          <TextField
                            fullWidth
                            size="small"
                            label="Notes"
                            name="itemNotes"
                            value={getItemsRowValues("Notes", "value", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        {items?.length > 1 && (
                          <div
                            onClick={() => itemOnDelete(index, item)}
                            className="ml-2 w-[5%]">
                            <Delete
                              className="cursor-pointer"
                              color="secondary"
                            />
                          </div>
                        )}
                      </div>
                    </form>
                  );
                })}
            </div>

            <div className="mt-3">
              <Button
                startIcon={<Add color="secondary" />}
                className="capitalize text-black text-[13px] "
                onClick={() => setItems([...items, items.length + 1])}
                component="span"
                color="secondary"
                variant="outlined"
                disabled={loading}>
                Add Product
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="border rounded bg-white pb-0.5 mx-4">
            <h6 className="px-3 py-3">Details</h6>
            <form className="px-3">
              <div className=" row">
                {/* Left Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={stack_Type}
                      value={shippingOrderData.stackTypeUUID}
                      label={"Stack Type"}
                      name="stackTypeUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleOnChange}
                      userRoleToShow={shippingOrderData.stackTypeName}
                      error={
                        isEmpty?.stackTypeUUID ? "Stack Type is required" : ""
                      }
                      errorMsg={
                        isEmpty?.stackTypeUUID ? "Stack Type is required" : ""
                      }
                      errorState={isEmpty?.stackTypeUUID}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={charge_Type}
                      value={shippingOrderData.chargeTypeUUID}
                      label={"Charge Type"}
                      name="chargeTypeUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleOnChange}
                      userRoleToShow={shippingOrderData.chargeTypeName}
                      error={
                        isEmpty?.chargeTypeUUID ? "Charge Type is required" : ""
                      }
                      errorMsg={
                        isEmpty?.chargeTypeUUID ? "Charge Type is required" : ""
                      }
                      errorState={isEmpty?.chargeTypeUUID}
                    />
                  </div>
                  <div className="form-row mb-3">
                    <div className="border rounded col-12 row ml-0">
                      <div className="border-bottom flex flex-row justify-between h-10">
                        <p className="mt-2">Remote Pick</p>
                        <Switch
                          checked={
                            shippingOrderData.remotePick === 1 ? true : false
                          }
                          value={shippingOrderData.remotePick}
                          onChange={(event) =>
                            setShippingOrderData({
                              ...shippingOrderData,
                              remotePick: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                      </div>
                      <div className="border-bottom flex flex-row justify-between h-10">
                        <p className="mt-2">Allergen Pick</p>
                        <Switch
                          checked={
                            shippingOrderData.allergenPick === 1 ? true : false
                          }
                          value={shippingOrderData.allergenPick}
                          onChange={(event) =>
                            setShippingOrderData({
                              ...shippingOrderData,
                              allergenPick: event.target.checked ? 1 : 0,
                            })
                          }
                        />
                      </div>
                      <div className="border-bottom flex flex-row justify-between h-10">
                        <p className="mt-2">Customer Called</p>
                        <Switch
                          checked={
                            shippingOrderData.customerCalled === 1
                              ? true
                              : false
                          }
                          value={shippingOrderData.customerCalled}
                          onChange={(event) =>
                            setShippingOrderData({
                              ...shippingOrderData,
                              customerCalled: event.target.checked ? 1 : 0,
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
                      value={shippingOrderData.notes}
                      fullWidth
                      onChange={handleOnChange}
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
                      value={shippingOrderData.poNotes}
                      fullWidth
                      onChange={handleOnChange}
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
        {/* Form End*/}
      </div>
    </div>
  );
};

export default AddNewShippingOrder;
