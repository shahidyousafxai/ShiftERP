// Library Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Add, Edit, Error, Delete } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

// Local Imports
import {
  Button,
  BreadCrumb,
  TextField,
  CustomModal,
  Typography,
  MaterialDropdown,
} from "../../../../shared";
import { getAllDependenciesAccounting } from "../../../../api/allDependencies";
import usePostRequest from "../../../../helpers/usePostRequest";
import { addNewPricing, updatePricing } from "../../../../api/pricingApi";
import { GetPricingListing } from "../../../../redux/Pricing/selectors";

const AddNewPricingRule = () => {
  //Navigations
  const navigate = useNavigate();
  let { id } = useParams();
  const { state } = useLocation();
  const pricing = state?.pricingRule;
  const fromModal = state?.fromModal;
  let pricingList = GetPricingListing();
  pricingList = pricingList?.filter((item) => item.uuid !== pricing?.uuid);
  const { loading, data, UsePost } = usePostRequest();
  //All States
  const [isloading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState({
    pricingName: false,
    customerUUID: false,
    chargeTypeUUID: false,
    pricePerUnit: false,
    uomUUID: false,
    gracePeriod: false,
    anniversaryPeriod: false,
    handlingPrice: false,
  });
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });
  const [assignPricing, setAssignPricing] = useState("");
  const [isAssignedValEmpty, setIsAssignedEmpty] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [assignErr, setAssignErr] = useState(false);
  const [units, setUnits] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [chargeType, setChargeType] = useState([]);
  const [categoryProduct, setCategoryProduct] = useState([]);

  const [items, setItems] = useState([1]);
  const [itemsDropdownData, setItemsDropdownData] = useState({
    itemCategory: [],
    items: [],
  });

  //Form Data State
  const [pricingRuleData, setPricingRuleData] = useState({
    pricingName: id ? pricing?.name : "",
    customerName: id ? pricing?.customer?.name : "",
    customerUUID: id ? pricing?.customer?.uuid : "",
    chargeTypeName: "",
    chargeTypeUUID: "",
    pricePerUnit: id ? pricing?.price_per_unit : "",
    uomName: id ? pricing?.unit?.name : "",
    uomUUID: id ? pricing?.unit?.uuid : "",
    gracePeriod: id ? pricing?.grace_period : "",
    anniversaryPeriod: id ? pricing?.min_charge : "",
    handlingPrice: id ? pricing?.handlingPrice : 0,
    items: "",
  });
  console.log("🚀  pricingRuleData:", pricingRuleData);

  //Input Validations
  const validateInput = (name, text) => {
    var alphaNum = /^[0-9a-zA-Z\s]*$/;
    var numbers = /^(?!(0))[0-9]{0,15}$/;

    if (name === "pricingNames") {
      return alphaNum.test(text);
    } else if (
      name === "anniversaryPeriod" ||
      name === "pricePerUnit" ||
      name === "gracePeriod" ||
      name === "handlingPrice"
    ) {
      return numbers.test(text);
    } else {
      return true;
    }
  };

  //Validating Every input If Empty
  const isPricingRuleDetailsEmpty = () => {
    if (pricingRuleData?.chargeTypeName === "Recurring Pricing") {
      if (
        pricingRuleData.chargeTypeName === "" ||
        pricingRuleData.chargeTypeUUID === ""
      ) {
        setIsEmpty({ ...isEmpty, chargeTypeUUID: true });
        return true;
      } else if (
        pricingRuleData.customerUUID === "" ||
        pricingRuleData.customerName === ""
      ) {
        setIsEmpty({ ...isEmpty, customerUUID: true });
        return true;
      } else if (pricingRuleData.pricingName === "") {
        setIsEmpty({ ...isEmpty, pricingName: true });
        return true;
      } else if (pricingRuleData.pricePerUnit === "") {
        setIsEmpty({ ...isEmpty, pricePerUnit: true });
        return true;
      } else if (
        pricingRuleData.uomUUID === "" ||
        pricingRuleData.uomName === ""
      ) {
        setIsEmpty({ ...isEmpty, uomUUID: true });
        return true;
      } else if (pricingRuleData.gracePeriod === "") {
        setIsEmpty({ ...isEmpty, gracePeriod: true });
        return true;
      } else if (pricingRuleData?.anniversaryPeriod === "") {
        setIsEmpty({ ...isEmpty, anniversaryPeriod: true });
        return true;
      } else if (
        !pricingRuleData.items ||
        Object.keys(pricingRuleData.items).length === 0
      ) {
        setIsEmpty({ ...isEmpty, items: true, itemsEmpty: true });
        return true;
      } else if (Object.keys(pricingRuleData.items).length !== 0) {
        let check = Object.values(pricingRuleData?.items).map((item) => {
          if (
            !("lotNumber" in item) ||
            item?.lotNumber === "" ||
            !("item" in item) ||
            item?.item === undefined ||
            !("lotId1" in item) ||
            item?.lotId1 === "" ||
            !("lotId2" in item) ||
            item?.lotId2 === "" ||
            !("itemCategory" in item) ||
            item?.itemCategory === undefined
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
    } else {
      if (
        pricingRuleData.chargeTypeName === "" ||
        pricingRuleData.chargeTypeUUID === ""
      ) {
        setIsEmpty({ ...isEmpty, chargeTypeUUID: true });
        return true;
      } else if (
        pricingRuleData.customerUUID === "" ||
        pricingRuleData.customerName === ""
      ) {
        setIsEmpty({ ...isEmpty, customerUUID: true });
        return true;
      } else if (pricingRuleData.pricingName === "") {
        setIsEmpty({ ...isEmpty, pricingName: true });
        return true;
      } else if (pricingRuleData.handlingPrice === "") {
        setIsEmpty({ ...isEmpty, handlingPrice: true });
        return true;
      } else if (
        !pricingRuleData.items ||
        Object.keys(pricingRuleData.items).length === 0
      ) {
        setIsEmpty({ ...isEmpty, items: true, itemsEmpty: true });
        return true;
      } else if (Object.keys(pricingRuleData.items).length !== 0) {
        let check = Object.values(pricingRuleData?.items).map((item) => {
          if (
            !("lotNumber" in item) ||
            item?.lotNumber === "" ||
            !("item" in item) ||
            item?.item === undefined ||
            !("lotId1" in item) ||
            item?.lotId1 === "" ||
            !("lotId2" in item) ||
            item?.lotId2 === "" ||
            !("itemCategory" in item) ||
            item?.itemCategory === undefined
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
    }
  };

  //handle change all dependancies
  const handleOnChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      if (e.target.name === "uomUUID") {
        let name = "";
        units?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setPricingRuleData({
          ...pricingRuleData,
          uomName: name,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.name === "customerUUID") {
        if (
          pricingRuleData?.customerUUID !== "" &&
          pricingRuleData?.customerName !== "" &&
          Object.keys(pricingRuleData.items).length > 0
        ) {
          setIsOpenModal(true);
        } else {
          let name = "";
          customer?.filter((item) => {
            if (item?.uuid === e.target.value) {
              name = item?.name;
              return item?.name;
            }
          });

          setPricingRuleData({
            ...pricingRuleData,
            customerName: name,
            [e.target.name]: e.target.value,
          });
        }
      } else if (e.target.name === "chargeTypeUUID") {
        let name = "";
        chargeType?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setPricingRuleData({
          ...pricingRuleData,
          chargeTypeName: name,
          [e.target.name]: e.target.value,
          pricePerUnit: "",
          uomName: "",
          uomUUID: "",
          gracePeriod: "",
          gracePeriodsaryPeriod: "",
          anniversaryPeriod: "",
          handlingPrice: "",
        });
      } else {
        setPricingRuleData({
          ...pricingRuleData,
          [e.target.name]: e.target.value,
        });
      }
    }
    setIsEmpty({
      ...isEmpty,
      pricingName: false,
      customerUUID: false,
      chargeTypeUUID: false,
      pricePerUnit: false,
      uomUUID: false,
      gracePeriod: false,
      anniversaryPeriod: false,
      handlingPrice: false,
    });
  };
  //Create Payload Function
  const createPayload = () => {
    const products = Object.values(pricingRuleData?.items).map((item) => {
      const obj = {
        category_id: item?.itemCategory?.uuid,
        product_id: item?.item?.uuid,
        lot_number: item?.lotNumber,
        lot_id1: item?.lotId1,
        lot_id2: item?.lotId2,
      };
      return obj;
    });

    if (pricingRuleData?.chargeTypeName === "Recurring Pricing") {
      let payload = {
        name: pricingRuleData?.pricingName,
        customer_id: pricingRuleData?.customerUUID,
        charge_type_id: pricingRuleData?.chargeTypeUUID,
        price_per_unit: pricingRuleData?.pricePerUnit,
        anniversary_period: pricingRuleData?.anniversaryPeriod,
        grace_period: pricingRuleData?.gracePeriod,
        unit_id: pricingRuleData?.uomUUID,
        products: products,
      };
      return payload;
    } else {
      let payload = {
        name: pricingRuleData?.pricingName,
        customer_id: pricingRuleData?.customerUUID,
        charge_type_id: pricingRuleData?.chargeTypeUUID,
        price_per_unit: pricingRuleData?.handlingPrice,
        products: products,
      };
      return payload;
    }
  };

  //On Press Add New PricingRule
  const onPressAddNewPricingRule = () => {
    if (!isPricingRuleDetailsEmpty()) {
      setIsLoading(true);
      console.log("add");
      let payload = createPayload();
      console.log("🚀 payload:", payload);
      addNewPricing(payload)
        .then((res) => {
          setIsLoading(false);
          navigate("/accounting/pricing");
        })
        .catch((error) => {
          console.log(error?.response);
          setIsLoading(false);
          if (error?.response?.data) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: (
                <div className="text-black">
                  {error?.response?.data?.message} <br />
                </div>
              ),
            });
          }
        });
    }
  };

  //OnPress Edit Pricing Rule
  const onPressEditPricingRule = () => {
    if (!isPricingRuleDetailsEmpty()) {
      setIsLoading(true);
      let payload = createPayload();
      payload = {
        ...payload,
        uuid: pricing?.uuid,
      };
      updatePricing(payload)
        .then((resp) => {
          setIsLoading(false);
          navigate("/accounting/pricing");
        })
        .catch((error) => {
          console.log(error?.response);
          setIsLoading(false);
          if (error?.response?.data?.message) {
            setError(true);
            setErrorMsg({
              type: "error",
              title: "Error",
              msg: (
                <div className="text-black">
                  {error?.response?.data?.errors?.name[0]}
                </div>
              ),
            });
          }
        });
    }
  };

  //OnPress AddOrEditProductionExtra
  const onPressAddOrEditPricingRule = () => {
    if (!id) {
      onPressAddNewPricingRule();
    }
    // if (id) {
    //   onPressEditPricingRule();
    // }
  };

  //Handle OnChange For Delete
  const handleOnChangeDeletePricingRule = (event) => {
    if (event.target.name === "assigningPricing") {
      setAssignPricing(event.target.value);
      setIsAssignedEmpty(false);
      setAssignErr(false);
    }
  };

  //Validate Delete Input
  const validateDeleteInput = () => {
    if (assignPricing === "") {
      setIsAssignedEmpty(true);
      return true;
    } else {
      return false;
    }
  };

  //Handle Delete
  const handleDelete = () => {
    let payload = {
      pricing_uuid: pricing?.uuid,
      pricing_reassign_uuid: assignPricing,
    };
    // if (!validateDeleteInput()) {
    //   setDeleteLoading(true);
    //   deletePricing(payload)
    //     .then((res) => {
    //       setDeleteLoading(false);
    //       setIsDelete(!isDelete);
    //       navigate("/accounting/pricing");
    //       setIsError("");
    //       setAssignPricing("");
    //       setIsAssignedEmpty(false);
    //       setAssignErr(false);
    //     })
    //     .catch((error) => {
    //       setDeleteLoading(false);
    //       setAssignErr(true);
    //       if (error?.response?.data) {
    //         setIsError(error?.response?.data?.message);
    //       }
    //     });
    // }
  };

  //Handle Cancel Delete
  const handleCancelDelete = () => {
    setIsDelete(!isDelete);
    setIsError("");
    setAssignPricing("");
    setIsAssignedEmpty(false);
    setAssignErr(false);
  };

  //Handle Cancel Pricing Rule
  const handleCancelPricingRule = () => {
    if (fromModal) {
      navigate("/accounting/pricing", {
        state: { fromModal: fromModal },
      });
    } else {
      navigate("/accounting/pricing");
    }
  };

  //End Buttons
  const Buttons = () => {
    return (
      <div className={`bg-white flex justify-end`}>
        {id && (
          <div className="mx-4">
            <Button
              size="medium"
              className="capitalize mr-[20px]"
              component="span"
              variant="outlined"
              color="danger"
              onClick={() => setIsDelete(!isDelete)}>
              Delete Pricing Rule
            </Button>
          </div>
        )}
        <div className="buttons d-flex">
          <Button
            size="medium"
            className="capitalize mr-[10px] "
            component="span"
            variant="outlined"
            color="secondary"
            // disabled={loading || deleteLoading}
            // onClick={handleCancelPricingRule}
            onClick={() => navigate("/accounting/pricing")}>
            Close
          </Button>

          <Button
            size="medium"
            className="capitalize mr-[10px] "
            component="span"
            variant="outlined"
            color="primary"
            // disabled={loading || deleteLoading}
            // onClick={handleCancelPricingRule}
          >
            Preview
          </Button>

          <Button
            size="medium"
            className={`${id ? "w-24" : "unset"} mr-[10px] capitalize`}
            component="span"
            color="primary"
            variant="contained"
            loading={isloading}
            disabled={isloading || deleteLoading}
            onClick={onPressAddOrEditPricingRule}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  const itemOnChange = (e, itemNum) => {
    if (pricingRuleData?.items) {
      if (`${itemNum}` in pricingRuleData?.items) {
        let existingItem = pricingRuleData?.items?.[itemNum];

        if (e.target.name === "item") {
          let selectedItem;

          for (const category of Object.values(categoryProduct)) {
            selectedItem = category.find(
              (item) => item.uuid === e.target.value
            );
            if (selectedItem) {
              break; // Exit the loop once a match is found
            }
          }
          // let selectedItem = itemsDropdownData?.items?.find((el) => {
          //   if (el.uuid === e.target.value) return el;
          // });
          existingItem.item = selectedItem;
          let data = { ...pricingRuleData?.items, [itemNum]: existingItem };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
        if (e.target.name === "itemLotNumber") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          existingItem.lotNumber = e.target.value;
          let data = { ...pricingRuleData?.items, [itemNum]: existingItem };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
        if (e.target.name === "itemLotId1") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          existingItem.lotId1 = e.target.value;
          let data = { ...pricingRuleData?.items, [itemNum]: existingItem };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
        if (e.target.name === "itemLotId2") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          existingItem.lotId2 = e.target.value;
          let data = { ...pricingRuleData?.items, [itemNum]: existingItem };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
        if (e.target.name === "itemCategory") {
          console.log("change already existing");
          let selectedItem = itemsDropdownData?.itemCategory?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          existingItem.itemCategory = selectedItem;
          existingItem.item = undefined;
          let data = { ...pricingRuleData?.items, [itemNum]: existingItem };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
      } else {
        if (e.target.name === "item") {
          let selectedItem;

          for (const category of Object.values(categoryProduct)) {
            selectedItem = category.find(
              (item) => item.uuid === e.target.value
            );
            if (selectedItem) {
              break; // Exit the loop once a match is found
            }
          }

          // let selectedItem = itemsDropdownData?.items?.find((el) => {
          //   if (el.uuid === e.target.value) return el;
          // });
          let data = {
            ...pricingRuleData?.items,
            [itemNum]: { item: selectedItem },
          };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
        if (e.target.name === "itemLotNumber") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = {
            ...pricingRuleData?.items,
            [itemNum]: { lotNumber: e.target.value },
          };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
        if (e.target.name === "itemLotId1") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = {
            ...pricingRuleData?.items,
            [itemNum]: { lotId1: e.target.value },
          };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
        if (e.target.name === "itemLotId2") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = {
            ...pricingRuleData?.items,
            [itemNum]: { lotId2: e.target.value },
          };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
        if (e.target.name === "itemCategory") {
          console.log("change next new row");
          let selectedItem = itemsDropdownData?.itemCategory?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          let data = {
            ...pricingRuleData?.items,
            [itemNum]: { itemCategory: selectedItem },
          };
          setPricingRuleData({ ...pricingRuleData, items: data });
        }
      }
    } else {
      if (e.target.name === "item") {
        let selectedItem;

        for (const category of Object.values(categoryProduct)) {
          selectedItem = category.find((item) => item.uuid === e.target.value);
          if (selectedItem) {
            break; // Exit the loop once a match is found
          }
        }
        // let selectedItem = itemsDropdownData?.items?.find((el) => {
        //   if (el.uuid === e.target.value) return el;
        // });
        let data = { [itemNum]: { item: selectedItem } };
        setPricingRuleData({ ...pricingRuleData, items: data });
      }
      if (e.target.name === "itemLotNumber") {
        e.target.value = e.target.value.replace(/[^\d]/g, "");
        e.target.value.charAt(0) === "0"
          ? (e.target.value = "")
          : (e.target.value = e.target.value);
        let data = { [itemNum]: { lotNumber: e.target.value } };
        setPricingRuleData({ ...pricingRuleData, items: data });
      }
      if (e.target.name === "itemLotId1") {
        e.target.value = e.target.value.replace(/[^\d]/g, "");
        e.target.value.charAt(0) === "0"
          ? (e.target.value = "")
          : (e.target.value = e.target.value);
        let data = { [itemNum]: { lotId1: e.target.value } };
        setPricingRuleData({ ...pricingRuleData, items: data });
      }
      if (e.target.name === "itemLotId2") {
        e.target.value = e.target.value.replace(/[^\d]/g, "");
        e.target.value.charAt(0) === "0"
          ? (e.target.value = "")
          : (e.target.value = e.target.value);
        let data = { [itemNum]: { lotId2: e.target.value } };
        setPricingRuleData({ ...pricingRuleData, items: data });
      }

      if (e.target.name === "itemCategory") {
        console.log("change 1st time");
        let selectedItemCategory = itemsDropdownData?.itemCategory?.find(
          (el) => {
            if (el.uuid === e.target.value) return el;
          }
        );
        let data = { [itemNum]: { itemCategory: selectedItemCategory } };
        setPricingRuleData({ ...pricingRuleData, items: data });
      }
    }

    setIsEmpty({
      ...isEmpty,
      itemsEmpty: false,
      items: false,
    });
  };

  const getItemsRowValues = (from, type, itemNum) => {
    if (from === "Item") {
      return type === "value"
        ? pricingRuleData?.items && pricingRuleData?.items[itemNum]?.item?.uuid
          ? pricingRuleData?.items[itemNum]?.item?.uuid
          : ""
        : pricingRuleData?.items && pricingRuleData?.items[itemNum]?.item?.name
        ? pricingRuleData?.items[itemNum]?.item?.name
        : "";
    }
    if (from === "LotNumber") {
      return type === "value" &&
        pricingRuleData?.items &&
        pricingRuleData?.items[itemNum]?.lotNumber
        ? pricingRuleData?.items[itemNum]?.lotNumber
        : "";
    }

    if (from === "LotID1") {
      return type === "value" &&
        pricingRuleData?.items &&
        pricingRuleData?.items[itemNum]?.lotId1
        ? pricingRuleData?.items[itemNum]?.lotId1
        : "";
    }

    if (from === "LotID2") {
      return type === "value" &&
        pricingRuleData?.items &&
        pricingRuleData?.items[itemNum]?.lotId2
        ? pricingRuleData?.items[itemNum]?.lotId2
        : "";
    }

    if (from === "Item Category") {
      return type === "value"
        ? pricingRuleData?.items &&
          pricingRuleData?.items[itemNum]?.itemCategory?.uuid
          ? pricingRuleData?.items[itemNum]?.itemCategory?.uuid
          : ""
        : pricingRuleData?.items &&
          pricingRuleData?.items[itemNum]?.itemCategory?.name
        ? pricingRuleData?.items[itemNum]?.itemCategory?.name
        : "";
    }
  };

  const itemOnDelete = (index, item) => {
    setItems(items.filter((_, i) => i !== index).map((_, i) => i + 1));
    // Deleting Row Data From State
    let data = pricingRuleData?.items;
    delete data?.[item];

    // Update the indexing in kitData
    let newData = {};
    Object.keys(data).forEach((key, newIndex) => {
      newData[newIndex + 1] = data[key];
    });
    // Setting State
    setPricingRuleData({ ...pricingRuleData, items: newData });
  };

  const handleCustomerChangeModal = () => {
    setIsOpenModal(false);
    setPricingRuleData({
      ...pricingRuleData,
      customerUUID: "",
      customerName: "",
      items: "",
    });
    setItems([1]);
  };

  const handleCancelCustomerChangeModal = () => {
    setIsOpenModal(false);
  };

  //UseEffect for Call Listing
  useEffect(() => {
    UsePost(getAllDependenciesAccounting, {
      name: "pricing",
      customer_id: pricingRuleData.customerUUID,
    });
  }, [pricingRuleData?.customerUUID]);

  //Get All Accounting Dependencies
  useEffect(() => {
    if (data?.data) {
      // const dependancies = {
      //   category: [
      //     {
      //       id: 1,
      //       uuid: "35d380f1de48423dab04f04f930aec97",
      //       name: "Finished Good",
      //     },
      //     {
      //       id: 2,
      //       uuid: "f0b37112c18840318e9535f9cf261ae5",
      //       name: "Raw Material",
      //     },
      //     {
      //       id: 3,
      //       uuid: "cae78747352d4b1bb44a2a059aa95aa5",
      //       name: "Storage",
      //     },
      //     {
      //       id: 4,
      //       uuid: "5312dddcd9164f5691fa1ebe31dd8441",
      //       name: "Storage Dry",
      //     },
      //     {
      //       id: 5,
      //       uuid: "5dfcdaaf7ba2452e8c0b614fe7782ed3",
      //       name: "Box",
      //     },
      //     {
      //       id: 6,
      //       uuid: "c1d85f04807c43c298dc38834c45cc4b",
      //       name: "Cup",
      //     },
      //     {
      //       id: 7,
      //       uuid: "4e61c4a27d2140929f0f266555121956",
      //       name: "IM Finished/Blend",
      //     },
      //     {
      //       id: 8,
      //       uuid: "adfd59d079ee473289942c10fec926ac",
      //       name: "Label",
      //     },
      //     {
      //       id: 9,
      //       uuid: "a83d820abee64cae94c6015cb9960d97",
      //       name: "LID",
      //     },
      //     {
      //       id: 10,
      //       uuid: "449a012e029d4cba8a8fb42d3e37f31a",
      //       name: "Liner",
      //     },
      //     {
      //       id: 11,
      //       uuid: "2a9e97a535c643fe99e81e26bd708d22",
      //       name: "Pallet",
      //     },
      //     {
      //       id: 12,
      //       uuid: "c05e6199b2384b1090229121106fe429",
      //       name: "Poly",
      //     },
      //     {
      //       id: 13,
      //       uuid: "01289407ac224fe8b68ca838f6490dc1",
      //       name: "SlipSheet",
      //     },
      //     {
      //       id: 14,
      //       uuid: "a07e07de19b947cf96c27612c9ef6c69",
      //       name: "Tote",
      //     },
      //     {
      //       id: 15,
      //       uuid: "94fc09c534ab4fd9a669447f5d5fffec",
      //       name: "Tray",
      //     },
      //   ],
      //   products: [
      //     {
      //       uuid: "0bfb653b81ac4ec28f8cd7a658288d35",
      //       name: "Mr. Weldon Bayer",
      //       category_id: 12,
      //     },
      //     {
      //       uuid: "abcb653b81ac4ec28f8cd7a658288d35",
      //       name: "Mr. James Waters",
      //       category_id: 12,
      //     },
      //     {
      //       uuid: "51e6db38cea14ffeb68e7ad1724e1898",
      //       name: "Vivianne Dickinson III",
      //       category_id: 10,
      //     },
      //     {
      //       uuid: "b58c2e726c4e4a5d960ecb7b46644700",
      //       name: "Antwan Torp",
      //       category_id: 14,
      //     },
      //   ],
      //   chargeType: [
      //     {
      //       uuid: "1",
      //       name: "Recurring Charge",
      //     },
      //     {
      //       uuid: "2",
      //       name: "Handling Fee",
      //     },
      //   ],
      //   customers: [
      //     {
      //       uuid: "121212",
      //       name: "Customer 1",
      //     },
      //     {
      //       uuid: "121213",
      //       name: "Customer 2",
      //     },
      //     {
      //       uuid: "121214",
      //       name: "Customer 3",
      //     },
      //   ],
      //   units: [
      //     {
      //       uuid: "1211",
      //       name: "Unit 1",
      //     },
      //     {
      //       uuid: "1212",
      //       name: "Unit 2",
      //     },
      //     {
      //       uuid: "1213",
      //       name: "Unit 3",
      //     },
      //   ],
      // };
      setUnits(data?.data?.units[0]?.units);
      setCustomer(data?.data?.customer);
      setChargeType(data?.data?.charge_types);
      if (!pricingRuleData?.customerUUID) {
        let chargeTypeName = data?.data?.charge_types[0]?.name?.includes(
          "Recurring"
        )
          ? data?.data?.charge_types[0]?.name
          : data?.data?.charge_types[1]?.name;
        let chargeTypeUUID = data?.data?.charge_types[0]?.name?.includes(
          "Recurring"
        )
          ? data?.data?.charge_types[0]?.uuid
          : data?.data?.charge_types[1]?.uuid;

        setPricingRuleData({
          ...pricingRuleData,
          chargeTypeName: chargeTypeName,
          chargeTypeUUID: chargeTypeUUID,
        });
      }
      if (data?.data?.products?.length > 0) {
        const categoryProd = data?.data?.category?.reduce(
          (result, category) => {
            result[category?.id] = [];
            return result;
          },
          {}
        );

        // Populate the arrays with products based on category ID
        data?.data?.products?.forEach((product) => {
          const categoryId = product?.category_id;
          categoryProd[categoryId].push(product);
        });
        setCategoryProduct(categoryProd);
        setItemsDropdownData({
          ...itemsDropdownData,
          itemCategory: data?.data?.category,
        });
      }
    }
  }, [data, pricingRuleData?.customerUUID]);

  return (
    <div className="flex flex-col justify-between h-[100vh]">
      <div>
        {/* Bread Crums Start*/}
        <div className="flex justify-between items-center p-3 bg-white border-bottom">
          <div>
            <BreadCrumb
              routes={[
                {
                  name: "Accounting",
                  route: "/accounting/production-extras",
                  color: true,
                },
                {
                  name: "Pricing",
                  route: "/accounting/pricing",
                  color: true,
                },
                {
                  name: id ? pricing?.name : "Add New Pricing Rule",
                },
              ]}
            />
            {id ? (
              <div>
                <Edit className="mb-1 mr-1" color="primary" />
                Edit : {pricing?.name}
              </div>
            ) : (
              <div>
                <Add className="mb-1" color="primary" />
                Add New Pricing Rule
              </div>
            )}
          </div>
          <Buttons />
        </div>
        {/* Bread Crums End*/}

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

        {/* Delete Modal*/}
        <CustomModal
          open={isDelete}
          close={() => setIsDelete(!isDelete)}
          width={window.innerWidth * 0.4}>
          <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row justify-content-between align-items-center text-center">
                <div className="pointer">
                  <Delete
                    className="mx-3 mb-1"
                    color="danger"
                    fontSize="small"
                  />
                </div>
                <b>Delete Pricing Rule</b>
              </div>
              <div
                className="pointer mx-3"
                onClick={() => {
                  setIsDelete(!isDelete);
                  setIsError("");
                  setAssignPricing("");
                  setIsAssignedEmpty(false);
                  setAssignErr(false);
                }}>
                <ClearIcon color="secondary" fontSize="small" />
              </div>
            </div>
            <div className="my-3 mx-4">
              <Typography variant="body1" fontSize={15} fontWeight="light">
                Before you can delete <b>'{pricing?.name}'</b> select a
                different Pricing Rule to use or{" "}
                <span
                  className="!text-primaryColor cursor-pointer"
                  onClick={() =>
                    navigate("/accounting/pricing/add-new-pricing-rule")
                  }>
                  add new pricing rule
                </span>
                :
              </Typography>
            </div>

            <div className="my-3">
              <div className="form-row mx-4">
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    className={`${
                      isAssignedValEmpty
                        ? "text-danger"
                        : assignErr
                        ? "text-danger"
                        : "unset"
                    }`}>
                    Assign Pricing Rule
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={assignPricing}
                    label="Assign Pricing Rule"
                    name="assigningPricing"
                    className={`${
                      isAssignedValEmpty
                        ? "text-danger"
                        : assignErr
                        ? "text-danger"
                        : "unset"
                    }`}
                    onChange={handleOnChangeDeletePricingRule}
                    error={
                      isAssignedValEmpty
                        ? "Please assign Pricing Rule before deleting selected one."
                        : assignErr
                        ? isError
                        : ""
                    }>
                    {pricingList.map((item, index) => {
                      return (
                        <MenuItem value={item.uuid} key={index}>
                          {item.pricingName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText className="text-danger">
                    {isAssignedValEmpty
                      ? "Please assign Pricing Rule before deleting selected one."
                      : assignErr
                      ? isError
                      : ""}
                  </FormHelperText>
                </FormControl>
              </div>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  component="span"
                  color="secondary"
                  className="capitalize mr-[10px]"
                  variant="outlined"
                  loading={deleteLoading}
                  disabled={deleteLoading}
                  onClick={() => handleCancelDelete()}>
                  Cancel
                </Button>
                <Button
                  component="span"
                  color="danger"
                  className="capitalize text-white"
                  variant="contained"
                  loading={deleteLoading}
                  disabled={deleteLoading}
                  onClick={() => handleDelete()}>
                  Delete and Reassign
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Form */}
        <div className="flex flex-col">
          {/* Basic Info */}
          <div className="border rounded bg-white pb-0.5 mx-4 mt-[20px]">
            <h6 className="px-3 py-3">Basic Info</h6>
            <form className="px-3">
              <div className=" row">
                {/* Left Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <MaterialDropdown
                      multiple={false}
                      options={chargeType}
                      value={pricingRuleData.chargeTypeUUID}
                      label={"Charge Type"}
                      name="chargeTypeUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleOnChange}
                      userRoleToShow={pricingRuleData.chargeTypeName}
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
                    <MaterialDropdown
                      multiple={false}
                      options={customer}
                      value={pricingRuleData.customerUUID}
                      label={"Customer"}
                      name="customerUUID"
                      withRenderValue
                      fullWidth
                      onChange={handleOnChange}
                      userRoleToShow={pricingRuleData.customerName}
                      error={
                        isEmpty?.customerUUID ? "Customer is required" : ""
                      }
                      errorMsg={
                        isEmpty?.customerUUID ? "Customer is required" : ""
                      }
                      errorState={isEmpty?.customerUUID}
                    />
                    {loading && (
                      <div className="text-success text-sm">Loading...</div>
                    )}
                  </div>
                </div>

                {/* Right Section */}
                <div className="form-group col-md-6">
                  <div className="form-row mb-3">
                    <TextField
                      size="small"
                      label="Pricing Name"
                      type={"text"}
                      name="pricingName"
                      value={pricingRuleData.pricingName}
                      fullWidth
                      onChange={handleOnChange}
                      helperText={
                        isEmpty?.pricingName ? "Pricing Name is required" : ""
                      }
                      error={isEmpty?.pricingName ? true : false}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Details */}
          <div className="border rounded bg-white pb-0.5 mx-4 mt-[20px]">
            <h6 className="px-3 py-3">Details</h6>
            <form className="px-3">
              {pricingRuleData?.chargeTypeName === "Handling Fees" ? (
                <div className=" row">
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="Price"
                        type={"text"}
                        name="handlingPrice"
                        value={pricingRuleData.handlingPrice}
                        fullWidth
                        onChange={handleOnChange}
                        helperText={
                          isEmpty?.handlingPrice ? "Price is required" : ""
                        }
                        error={isEmpty?.handlingPrice ? true : false}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className=" row">
                  {/* Left Section */}
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="Price Per Unit"
                        type={"text"}
                        name="pricePerUnit"
                        value={pricingRuleData.pricePerUnit}
                        fullWidth
                        onChange={handleOnChange}
                        helperText={
                          isEmpty?.pricePerUnit
                            ? "Price Per Unit Name is required"
                            : ""
                        }
                        error={isEmpty?.pricePerUnit ? true : false}
                      />
                    </div>

                    <div className="form-row mb-3">
                      <MaterialDropdown
                        multiple={false}
                        options={units}
                        value={pricingRuleData.uomUUID}
                        label={"Unit of Measure"}
                        name="uomUUID"
                        withRenderValue
                        fullWidth
                        onChange={handleOnChange}
                        userRoleToShow={pricingRuleData.uomName}
                        error={isEmpty?.uomUUID ? "UOM is required" : ""}
                        errorMsg={isEmpty?.uomUUID ? "UOM is required" : ""}
                        errorState={isEmpty?.uomUUID}
                      />
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="Grace Period"
                        type={"text"}
                        name="gracePeriod"
                        value={pricingRuleData.gracePeriod}
                        fullWidth
                        onChange={handleOnChange}
                        helperText={
                          isEmpty?.gracePeriod ? "Grace Period is required" : ""
                        }
                        error={isEmpty?.gracePeriod ? true : false}
                      />
                    </div>

                    <div className="form-row mb-3">
                      <TextField
                        size="small"
                        label="Anniversary Period"
                        type={"text"}
                        name="anniversaryPeriod"
                        value={pricingRuleData.anniversaryPeriod}
                        fullWidth
                        onChange={handleOnChange}
                        helperText={
                          isEmpty?.anniversaryPeriod
                            ? "anniversaryPeriod is required"
                            : ""
                        }
                        error={isEmpty?.anniversaryPeriod ? true : false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Items */}
          <div className="border rounded bg-white py-3 px-3 my-[20px] mx-4">
            <div className="flex items-center">
              <h6>Item(s)</h6>
              {isEmpty?.items && (
                <div className="ml-3 flex items-center">
                  <Error color="danger" fontSize="small" />
                  <p className="ml-2 text-red-700 text-sm font-semibold">
                    {isEmpty?.itemsEmpty
                      ? "Add at least one item"
                      : "All fields of items are required."}
                  </p>
                </div>
              )}
              {!pricingRuleData?.customerUUID ? (
                <p className="ml-2 text-[14px] text-danger ">
                  Please Select the customer First
                </p>
              ) : null}
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
                        <div className=" w-[25%]">
                          <MaterialDropdown
                            fullWidth
                            withRenderValue
                            multiple={false}
                            label="Item Category"
                            name="itemCategory"
                            options={
                              pricingRuleData?.customerUUID
                                ? itemsDropdownData?.itemCategory
                                : []
                            }
                            value={getItemsRowValues(
                              "Item Category",
                              "value",
                              item
                            )}
                            userRoleToShow={getItemsRowValues(
                              "Item Category",
                              "",
                              item
                            )}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="ml-2 w-[25%] h-[40px]">
                          <MaterialDropdown
                            fullWidth
                            withRenderValue
                            multiple={false}
                            label="Item"
                            name="item"
                            options={
                              categoryProduct[
                                pricingRuleData?.items[item]?.itemCategory?.id
                              ]?.length > 0
                                ? categoryProduct[
                                    pricingRuleData?.items[item]?.itemCategory
                                      ?.id
                                  ]
                                : []
                            }
                            value={getItemsRowValues("Item", "value", item)}
                            userRoleToShow={getItemsRowValues("Item", "", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                          {!pricingRuleData?.customerUUID ? (
                            ""
                          ) : pricingRuleData?.customerUUID &&
                            categoryProduct[
                              pricingRuleData?.items[item]?.itemCategory?.id
                            ]?.length === 0 ? (
                            <p className="text-[12px] text-danger">
                              Selected item category has no Product
                            </p>
                          ) : !pricingRuleData?.items[item]?.itemCategory ? (
                            <p className="text-[12px] text-danger ">
                              Please selected item category First
                            </p>
                          ) : null}
                        </div>

                        <div className="ml-2 w-[15%]">
                          <TextField
                            fullWidth
                            size="small"
                            label="Lot #"
                            name="itemLotNumber"
                            value={getItemsRowValues(
                              "LotNumber",
                              "value",
                              item
                            )}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="ml-2 w-[15%]">
                          <TextField
                            fullWidth
                            size="small"
                            label="Lot ID 1"
                            name="itemLotId1"
                            value={getItemsRowValues("LotID1", "value", item)}
                            onChange={(e) => itemOnChange(e, item)}
                            error={
                              isEmpty.itemsEmpty || isEmpty?.items
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="ml-2 w-[15%]">
                          <TextField
                            fullWidth
                            size="small"
                            label="Lot ID 2"
                            name="itemLotId2"
                            value={getItemsRowValues("LotID2", "value", item)}
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
                startIcon={<Add color="primary" />}
                className="capitalize text-[13px] "
                onClick={() => setItems([...items, items.length + 1])}
                component="span"
                color="primary"
                variant="outlined"
                // disabled={loading}
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddNewPricingRule;
