/* eslint-disable no-self-assign */
/* eslint-disable array-callback-return */
// Library Imports
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import { Edit, Add, Delete, Error, VpnLockSharp } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

// Local Imports
import {
  CustomModal,
  Typography,
  BreadCrumb,
  TextField,
  MaterialDropdown,
  Button,
  MultiDropDown,
  Spinner,
} from "../../../../shared";
import {
  addKit,
  deleteKit,
  getDependencies,
  getKitDetails,
  updateKit,
} from "../../../../api/kitsApi.js";
import ItemsTabel from "./Components/Table";
import { danger } from "../../../../helpers/GlobalVariables";
import { SimpleDeleteModal } from "../../../../helpers/SimpleDeleteModal";

const AddKits = () => {
  const { state } = useLocation();
  const { from } = state;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const companyAdmin = user?.currentUser?.role === "company_admin";
  const facility = user?.currentUser?.role === "facility_user";

  //************************* Add New Kit States And Methods Start *******************************/
  const [loading, setLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [disabledLoading, setDisabledLoading] = useState(false);
  const [dependencyLoading, setDependencyLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [addItemModal, setAddItemModal] = useState(false);
  const [addAlternativeItemIndex, setAddAlternativeItemIndex] = useState("");
  const [alternativeSelectedItemId, setAlternativeSelectedItemId] =
    useState("");
  const [addAlternativeModal, setAddAlternativeModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [kitDetails, setKitDetails] = useState();
  const [customers, setCustomers] = useState([]);
  const [kitParent, setkitParent] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [remainingProducts, setRemainingProducts] = useState([]);
  const [kitData, setKitData] = useState({
    kitName: "",
    customer: "",
    customerName: "",
    facilities: [],
    description: "",
    kitParent: "",
    kitParentName: "",
    items: "",
  });
  const [isEmpty, setIsEmpty] = useState({
    kitName: false,
    customer: false,
    description: false,
    kitParent: false,
    facilitiesUUID: false,
    itemsEmpty: false,
    items: false,
  });
  const [items, setItems] = useState([1]);
  const [itemsDropdownData, setItemsDropdownData] = useState({
    partType: [],
    items: [],
    unit: [],
  });

  const handleOnChange = (e) => {
    if (e.target.name === "customer") {
      if (kitDetails?.kit_products) {
        if (kitData?.customer !== "" && kitData?.customerUUID !== "") {
          setIsOpenModal(true);
        }
      } else {
        setKitData({
          ...kitData,
          customerName: customers?.map((item) => {
            if (item.uuid === e.target.value) {
              return item.name;
            }
          }),
          kitParent: "",
          kitParentName: "",
          facilities: [],
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name === "kitParent") {
      setKitData({
        ...kitData,
        kitParentName: kitParent?.map((item) => {
          if (item.uuid === e.target.value) {
            return item.name;
          }
        }),
        [e.target.name]: e.target.value,
      });
    } else {
      setKitData({
        ...kitData,
        [e.target.name]: e.target.value,
      });
    }
    setIsEmpty({
      ...isEmpty,
      kitName: false,
      customer: false,
      description: false,
      kitParent: false,
      // facilitiesUUID: false,
    });
  };

  const handleMultiChange = (e, newValue) => {
    setKitData({
      ...kitData,
      facilities: newValue,
    });
    setIsEmpty({
      ...isEmpty,
      facilitiesUUID: false,
    });
  };

  // Calling Dependency API for Part Type
  useEffect(() => {
    if (state?.kit) {
      getKitDetail();
      setDisabledButton(state?.kit ? true : false);
    } else {
      setDisabledButton(state?.kit ? true : false);
      getDependencyList();
      setLoadingList(false);
    }
  }, []);

  const getDependencyList = () => {
    setDependencyLoading(true);
    getDependencies()
      .then((res) => {
        setDependencyLoading(false);
        let data = res?.data?.data;
        setCustomers(data?.customers);
      })
      .catch((error) => {
        setDependencyLoading(false);
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  const getCustomerProducts = (customerUUID) => {
    setDependencyLoading(true);
    getDependencies({
      customer_id: customerUUID,
    })
      .then((res) => {
        let data = res?.data?.data;
        let kitParent = data?.products?.filter((item) => {
          return item?.is_kit_parent;
        });
        data.part_type = data?.part_types?.map((item) =>
          item?.name === "Raw1" ? (item.name = "Raw") : (item.name = item?.name)
        );
        let partType = data?.part_types;
        setItemsDropdownData({
          ...itemsDropdownData,
          partType: partType,
          unit:
            data?.unit_types[0]?.units === undefined
              ? []
              : data?.unit_types[0]?.units,
          items: data?.products,
        });
        setFacilities(data?.facilities);
        setkitParent(kitParent);
        setDependencyLoading(false);
        setDisabledLoading(state?.kit ? true : false);
        setLoadingList(false);
      })
      .catch((error) => {
        setDependencyLoading(false);
        setLoadingList(false);
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  //*********** Getter & Setter for kits Details For Edit *********/
  const getKitDetail = () => {
    getDependencyList();
    getKitDetails({ uuid: state?.kit?.uuid })
      .then((res) => {
        let data = res?.data?.data?.kit;
        setKitData({
          kitName: data?.name,
          customer: data?.customer?.uuid,
          customerName: data?.customer?.name,
          facilities: data?.facilities,
          description: data?.description,
          kitParent: data?.kit_parent?.uuid,
          kitParentName: data?.kit_parent?.name,
        });
        setKitDetails({ kit_products: data?.kit_products });
      })
      .catch((error) => {
        setLoadingList(false);
        console.log(
          "%cErrorINKitDetails",
          "color: red; font-family:sans-serif; font-size: 20px; font-weight: 700",
          error
        );
      });
  };

  //************************* Add New Kit States And Methods End *******************************/

  const [alertModal, setAlertModal] = useState(false);
  const [alternativeItemAlertModal, setAlternativeItemAlertModal] =
    useState(false);
  const [error, setError] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAlternativeLengthExceed, setIsAlternativeLengthExceed] =
    useState(false);
  const [totalItem, setTotalItem] = useState();
  const [errorObj, setErrorMsg] = useState({ type: "", title: "", msg: "" });

  const isKitDataEmpty = () => {
    if (kitData.kitName === "") {
      setIsEmpty({ ...isEmpty, kitName: true });
      return true;
    } else if (kitData.customer === "" || kitData?.customerName === "") {
      setIsEmpty({ ...isEmpty, customer: true });
      return true;
    } else if (kitData.description === "") {
      setIsEmpty({ ...isEmpty, description: true });
      return true;
    } else if (kitData.kitParent === "" || kitData?.kitParentName === "") {
      setIsEmpty({ ...isEmpty, kitParent: true });
      return true;
    } else if (kitData?.facilities.length === 0) {
      setIsEmpty({ ...isEmpty, facilitiesUUID: true });
      return true;
    } else if (
      kitDetails?.kit_products?.length === 0 ||
      // !("kit_products" in kitDetails) ||
      kitDetails === undefined
    ) {
      setError(true);
      setErrorMsg({
        type: "Kit Products",
        title: "Kit Products",
        msg: "Kit must have at least one product",
      });
      setIsError(false);
      return true;
    } else if (kitDetails?.kit_products) {
      let checkKitProducts = Object.values(kitDetails?.kit_products).map(
        (item) => {
          if (!("amount" in item) || item?.amount === "") {
            setIsError(true);
            return true;
          } else if (item?.product_alternative?.length > 0) {
            let checkAlternativeProduct = Object.values(
              item?.product_alternative
            ).map((item) => {
              if (!("amount" in item) || item?.amount === "") {
                setIsError(true);
                return true;
              } else {
                return false;
              }
            });
            if (checkAlternativeProduct?.includes(true)) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
      );

      if (checkKitProducts?.includes(true)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const createPayload = () => {
    const products = kitDetails?.kit_products?.map((item) => {
      const alternatives =
        item?.product_alternative?.length > 0
          ? item?.product_alternative?.map((item, index) => {
              const obj = {
                product_id: item?.product?.uuid,
                part_type_id: item?.part_type?.uuid,
                priority: index,
                unit_id: item?.unit?.uuid,
                amount: item?.amount,
              };
              return obj;
            })
          : [];
      const obj = {
        product_id: item?.product?.uuid,
        part_type_id: item?.part_type?.uuid,
        unit_id: item?.unit?.uuid,
        amount: item?.amount,
        alternatives: alternatives,
      };
      return obj;
    });

    const payload = {
      customer_id: kitData?.customer,
      name: kitData?.kitName,
      description: kitData?.description,
      kit_parent_id: kitData?.kitParent,
      facility_ids: kitData?.facilities?.map((item) => {
        return item?.uuid;
      }),
      products: products,
    };
    console.log(
      "🚀 %cpayload:",
      "color: Blue; font-family:sans-serif; font-size: 20px; font-weight: 700",
      payload
    );
    return payload;
  };

  const onPressAddKit = () => {
    setLoading(true);
    if (!isKitDataEmpty()) {
      const payload = createPayload();
      console.log(
        "%cFrom Add Kit Payload",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700",
        payload
      );
      addKit(payload)
        .then((res) => {
          navigate("/inventory/kits");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          setErrorMsg({
            type: "error",
            title: "Error",
            msg:
              err?.response?.data?.errors?.name || err?.response?.data?.message,
          });
        });
    } else {
      setLoading(false);
    }
  };

  const onPressEditKit = () => {
    setLoading(true);
    if (!isKitDataEmpty()) {
      let payload = createPayload();
      payload = {
        ...payload,
        uuid: state?.kit?.uuid,
      };
      console.log(
        "%cFrom Edit Kit Payload",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700",
        payload
      );
      updateKit(payload)
        .then((res) => {
          navigate("/inventory/kits");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          setErrorMsg({
            type: "error",
            title: "Error",
            msg:
              err?.response?.data?.errors?.name || err?.response?.data?.message,
          });
        });
    } else {
      setLoading(false);
    }
  };

  const handleCustomerChangeModal = () => {
    setIsOpenModal(false);
    setKitData({
      ...kitData,
      customer: "",
      customerName: "",
      items: "",
      facilities: [],
      kitParentName: "",
      kitParent: "",
    });
    setItems([1]);
    setKitDetails();
    setFacilities([]);
    setkitParent([]);
    setDisabledButton(false);
  };
  const handleCancelCustomerChangeModal = () => {
    setIsOpenModal(false);
  };

  const itemOnChange = (e, itemNum) => {
    if (kitData?.items) {
      if (`${itemNum}` in kitData?.items) {
        let existingItem = kitData?.items?.[itemNum];
        if (e.target.name === "partType") {
          let selectedPartType = itemsDropdownData?.partType?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          existingItem.partType = selectedPartType;
          let data = { ...kitData?.items, [itemNum]: existingItem };
          setKitData({ ...kitData, items: data });
        }
        if (e.target.name === "item") {
          if (addAlternativeModal) {
            console.log("third");
            let selectedItem = itemsDropdownData?.items?.find((el) => {
              if (el?.uuid === e.target.value) return el;
            });
            if (existingItem?.item !== undefined) {
              let newArray = [...remainingProducts, existingItem?.item];
              let newRemaingArray = newArray.filter(
                (item) => item?.uuid !== selectedItem?.uuid
              );
              setRemainingProducts(newRemaingArray);
            }
            existingItem.item = selectedItem;
            let data = { ...kitData?.items, [itemNum]: existingItem };
            setKitData({ ...kitData, items: data });
          } else {
            let selectedItem = itemsDropdownData?.items?.find((el) => {
              if (el.uuid === e.target.value) return el;
            });
            existingItem.item = selectedItem;
            let data = { ...kitData?.items, [itemNum]: existingItem };
            setKitData({ ...kitData, items: data });
          }
        }
        if (e.target.name === "itemAmount") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          existingItem.amount = e.target.value;
          let data = { ...kitData?.items, [itemNum]: existingItem };
          setKitData({ ...kitData, items: data });
        }
        if (e.target.name === "unit") {
          let selectedUnit = itemsDropdownData?.unit?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          existingItem.unit = selectedUnit;
          let data = { ...kitData?.items, [itemNum]: existingItem };
          setKitData({ ...kitData, items: data });
        }
      } else {
        if (e.target.name === "partType") {
          let selectedPartType = itemsDropdownData?.partType?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          let data = {
            ...kitData?.items,
            [itemNum]: { partType: selectedPartType },
          };
          setKitData({ ...kitData, items: data });
        }
        if (e.target.name === "item") {
          console.log("second");
          let selectedItem = itemsDropdownData?.items?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          let data = { ...kitData?.items, [itemNum]: { item: selectedItem } };
          setKitData({ ...kitData, items: data });
        }
        if (e.target.name === "itemAmount") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = {
            ...kitData?.items,
            [itemNum]: { amount: e.target.value },
          };
          setKitData({ ...kitData, items: data });
        }
        if (e.target.name === "unit") {
          let selectedUnit = itemsDropdownData?.unit?.find((el) => {
            if (el.uuid === e.target.value) return el;
          });
          let data = { ...kitData?.items, [itemNum]: { item: selectedUnit } };
          setKitData({ ...kitData, items: data });
        }
      }
    } else {
      if (e.target.name === "partType") {
        let selectedPartType = itemsDropdownData?.partType?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { partType: selectedPartType } };
        setKitData({ ...kitData, items: data });
      }
      if (e.target.name === "item") {
        console.log("first");
        let selectedItem = itemsDropdownData?.items?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { item: selectedItem } };
        setKitData({ ...kitData, items: data });
      }
      if (e.target.name === "itemAmount") {
        e.target.value = e.target.value.replace(/[^\d]/g, "");
        e.target.value.charAt(0) === "0"
          ? (e.target.value = "")
          : (e.target.value = e.target.value);
        let data = { [itemNum]: { amount: e.target.value } };
        setKitData({ ...kitData, items: data });
      }
      if (e.target.name === "unit") {
        let selectedUnit = itemsDropdownData?.unit?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { unit: selectedUnit } };
        setKitData({ ...kitData, items: data });
      }
    }
    setIsAlternativeLengthExceed(false);
    setIsEmpty({
      ...isEmpty,
      itemsEmpty: false,
      items: false,
    });
  };
  const itemOnDelete = (index, item) => {
    let deleteItem = kitData?.items[item]?.item;
    if (deleteItem !== undefined) {
      let newArray = [...remainingProducts, deleteItem];
      setRemainingProducts(newArray);
    }
    setItems(items.filter((_, i) => i !== index).map((_, i) => i + 1));
    setTotalItem(totalItem - 1);
    setIsAlternativeLengthExceed(false);
    // Deleting Row Data From State
    let data = kitData?.items;
    delete data?.[item];

    // Update the indexing in kitData
    let newData = {};
    Object.keys(data).forEach((key, newIndex) => {
      newData[newIndex + 1] = data[key];
    });
    // Setting State
    setKitData({ ...kitData, items: newData });
  };
  const getItemsRowValues = (from, type, itemNum) => {
    if (from === "Part Type") {
      return type === "value"
        ? kitData?.items && kitData?.items[itemNum]?.partType?.uuid
          ? kitData?.items[itemNum]?.partType?.uuid
          : ""
        : kitData?.items && kitData?.items[itemNum]?.partType?.name
        ? kitData?.items[itemNum]?.partType?.name
        : "";
    }
    if (from === "Item") {
      return type === "value"
        ? kitData?.items && kitData?.items[itemNum]?.item?.uuid
          ? kitData?.items[itemNum]?.item?.uuid
          : ""
        : kitData?.items && kitData?.items[itemNum]?.item?.name
        ? `${kitData?.items[itemNum]?.item?.name} - ${kitData?.items[itemNum]?.item?.description}`
        : "";
    }
    if (from === "Amount") {
      return type === "value" &&
        kitData?.items &&
        kitData?.items[itemNum]?.amount
        ? kitData?.items[itemNum]?.amount
        : "";
    }
    if (from === "Unit") {
      return type === "value"
        ? kitData?.items && kitData?.items[itemNum]?.unit?.uuid
          ? kitData?.items[itemNum]?.unit?.uuid
          : ""
        : kitData?.items && kitData?.items[itemNum]?.unit?.name
        ? kitData?.items[itemNum]?.unit?.name
        : "";
    }
  };
  const closeAddItemModal = () => {
    setAddItemModal(false);
    setAddAlternativeModal(false);
    setKitData({ ...kitData, items: "" });
    setItems([1]);
    setIsEmpty({
      ...isEmpty,
      items: false,
    });
    setIsAlternativeLengthExceed(false);
  };

  const removeAlternative = (indexItem, indexAlternative) => {
    // Deleting Row Data From State
    let items = kitDetails?.kit_products;
    items[indexItem].product_alternative.splice(indexAlternative, 1);
    let deleteItemAdd = items[0]?.product;

    let newArray = [...remainingProducts, deleteItemAdd];
    setRemainingProducts(newArray);

    // Setting State
    setKitDetails({ ...kitDetails, kit_products: items });
  };

  const removeItem = (index) => {
    // Deleting Row Data From State
    let data = kitDetails?.kit_products;
    data.splice(index, 1);
    // Setting State
    setKitDetails({ ...kitDetails, kit_products: data });
  };

  // OnClick Add Kit / Edit Kit Button
  const onPressAddOrEditKit = () => {
    // For Add New Customer from Basic Information
    if (from === "addKits") {
      console.log(
        "%cFrom Add Kit",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      onPressAddKit();
    }

    // For Edit Existing Customer from Basic Information
    if (from === "editKits") {
      console.log(
        "%cFrom Edit Kit",
        "color: green; font-family:sans-serif; font-size: 20px; font-weight: 700"
      );
      onPressEditKit();
    }
  };
  //************************* Button Component Start *******************************/
  const Buttons = () => {
    return (
      <div
        className={`flex mt-4 py-4 bg-white overflow-auto border-t border-lightGray
        ${
          from === "editKits" && companyAdmin
            ? "justify-between"
            : "justify-end"
        }
        `}>
        {state?.kit && companyAdmin && (
          <div className="mx-4">
            <Button
              size="medium"
              className="capitalize mr-[20px] w-[130px]"
              component="span"
              variant="outlined"
              color="danger"
              onClick={() => setDeleteModal(true)}>
              Delete Kit
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
            onClick={() => navigate("/inventory/kits")}>
            Cancel
          </Button>

          {!facility && (
            <div
              className={`mr-[20px] ${
                disabledButton ? "cursor-not-allowed" : "cursor-pointer"
              }`}>
              <Button
                size="medium"
                className="capitalize w-[130px]"
                component="span"
                color="primary"
                variant="contained"
                loading={loading}
                disabled={disabledButton}
                onClick={onPressAddOrEditKit}>
                {state?.kit ? "save" : "Add Kit"}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  //************************* Button Component End *******************************/

  const isItemsEmpty = () => {
    if (kitData.items) {
      let check = Object.values(kitData?.items).map((item) => {
        if (
          !("partType" in item) ||
          item?.partType === "" ||
          !("item" in item) ||
          item?.item === "" ||
          !("amount" in item) ||
          item?.amount === "" ||
          !("unit" in item) ||
          item?.unit === ""
        ) {
          setIsEmpty({ ...isEmpty, items: true });
          return true;
        } else {
          return false;
        }
      });
      if (check?.includes(true)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const addItemsPressFromModal = () => {
    if (!isItemsEmpty()) {
      const newItems = Object.values(kitData?.items).map((item) => {
        const obj = {
          amount: item?.amount,
          unit: item?.unit,
          part_type: item?.partType,
          product: item?.item,
          product_alternative: [],
        };
        return obj;
      });

      setKitDetails(() => {
        const oldItems =
          kitDetails?.kit_products?.length > 0 ? kitDetails?.kit_products : [];
        const itemsArray = [...oldItems, ...newItems];
        const obj = { ...kitDetails, kit_products: itemsArray };
        return obj;
      });
      closeAddItemModal();
    }
  };

  const addAlternativePress = () => {
    if (!isItemsEmpty()) {
      const newAlternatives = Object.values(kitData?.items).map((item) => {
        const obj = {
          amount: item?.amount,
          unit: item?.unit,
          part_type: item?.partType,
          product: item?.item,
        };
        return obj;
      });

      setKitDetails(() => {
        const oldAlternatives =
          kitDetails?.kit_products[addAlternativeItemIndex].product_alternative;
        const alternativesArray = [...oldAlternatives, ...newAlternatives];

        let items = kitDetails?.kit_products;
        items[addAlternativeItemIndex].product_alternative = alternativesArray;

        const obj = { ...kitDetails, kit_products: items };
        return obj;
      });
      closeAddItemModal();
    }
  };

  const KitButtons = ({ from }) => {
    return (
      <div
        className={`d-flex overflow-auto ${
          from === "bottom" ? "justify-between" : "justify-end"
        }
                    ${
                      from === "addItem" || from === "addAlternative"
                        ? "py-3"
                        : "py-4 mt-4"
                    }  ${
          from === "addItem" || from === "addAlternative" ? "none" : "border-t"
        } border-lightGray`}>
        <div className="">
          <Button
            size="medium"
            className="capitalize mr-[10px] w-[100px]"
            component="span"
            variant="outlined"
            color="secondary"
            // disabled={loading }
            onClick={() => {
              from === "addItem" || from === "addAlternative"
                ? closeAddItemModal()
                : navigate("/inventory/kits");
            }}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="capitalize mr-[20px] w-[130px]"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            // disabled={loading}
            onClick={() => {
              from === "addItem"
                ? addItemsPressFromModal()
                : addAlternativePress();
            }}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  // Delete Kit
  const handleDelete = (uuid) => {
    setDeleteLoading(true);
    let UUID = Array.isArray(uuid)
      ? uuid?.map((item) => {
          return item?.uuid;
        })
      : [uuid];

    deleteKit({ ids: UUID })
      .then((res) => {
        setDeleteLoading(false);
        navigate("/inventory/kits");
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error?.response?.data) {
          setIsError(error?.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (addAlternativeModal) {
      //orignalArray 'expect parentkit and item includes in it'
      let orignalArray = [];
      const productRemaining = [...itemsDropdownData?.items];
      productRemaining?.filter((item) => {
        if (
          item?.uuid !== kitData?.kitParent &&
          item?.uuid !== alternativeSelectedItemId
        ) {
          orignalArray.push(item);
        }
      });

      const kitItems = kitData?.items;

      if (kitItems && Object.values(kitItems).length > 0) {
        const subItemIds = remainingProducts?.filter((subItem) => {
          return !Object.values(kitItems).some(
            (item) => item?.item?.uuid === subItem?.uuid
          );
        });
        setRemainingProducts(subItemIds);
      } else {
        if (
          kitDetails?.kit_products[addAlternativeItemIndex]?.product_alternative
            ?.length > 0
        ) {
          const subItemIds = orignalArray?.filter((subItem) => {
            return !kitDetails?.kit_products[
              addAlternativeItemIndex
            ]?.product_alternative?.some(
              (item) => item?.product?.uuid === subItem?.uuid
            );
          });
          console.log("else if");
          setRemainingProducts(subItemIds);
        } else {
          console.log("else else");
          setRemainingProducts(orignalArray);
        }
      }
    }
  }, [addAlternativeModal && kitData?.items]);

  useEffect(() => {
    if (kitData?.customer) {
      getCustomerProducts(kitData?.customer);
    }
  }, [kitData?.customer]);

  useEffect(() => {
    if (disabledLoading) {
      setDisabledButton(false);
    }
  }, [kitData, kitDetails]);

  return (
    <div className="flex flex-col justify-between h-screen bg-bgGray">
      {/* Error Message Alert */}
      <CustomModal
        open={alertModal}
        close={() => setAlertModal(!alertModal)}
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
              {errorObj.title}
            </div>
            <div
              className="pointer mx-3"
              onClick={() => setAlertModal(!alertModal)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          {errorObj.type === "error" ? (
            <div className="my-3">
              <Typography
                className="d-flex flex-row align-items-center px-3"
                variant="body1"
                fontSize={15}
                marginBottom={1}
                marginTop={3}
                marginLeft={3}
                fontWeight="normal">
                {errorObj.msg}
              </Typography>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  className="capitalize mr-[10px]"
                  component="span"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setAlertModal(false)}>
                  {"Ok"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="my-3">
              <div className="border bg-danger/20 rounded mx-3 border-light">
                <Typography
                  className="d-flex flex-row align-items-center p-3"
                  variant="body1"
                  color={danger}
                  fontSize={15}
                  fontWeight="light">
                  The product is used in the active kit. The product must be
                  removed from the kit before you can delete this product
                </Typography>
              </div>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  className="capitalize mr-[10px]"
                  component="span"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setAlertModal(false)}>
                  {"Ok"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CustomModal>

      {/* Alternative Error Alert Modal */}
      <CustomModal
        open={alternativeItemAlertModal}
        close={() => setAlternativeItemAlertModal(false)}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                <Error className="mx-3 mb-1" color="danger" fontSize="small" />
              </div>
              Alternative Item
            </div>
            <div
              className="pointer mx-3"
              onClick={() => setAlternativeItemAlertModal(false)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>

          <div className="my-3">
            <div className="border bg-danger/20 rounded mx-3 border-light">
              <Typography
                className="d-flex flex-row align-items-center p-3"
                variant="body1"
                color={danger}
                fontSize={15}
                fontWeight="light">
                Please delete an alternative, only 3 alternatives can be added
                to item.
              </Typography>
            </div>
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Button
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={() => setAlternativeItemAlertModal(false)}>
                Close
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

      {/* Add Item Modal */}
      <CustomModal
        open={addItemModal || addAlternativeModal}
        width={window.innerWidth * 0.6}>
        <div>
          {/* Header Row */}
          <div className="d-flex flex-row justify-content-between align-items-center px-3">
            <div className="flex">
              <Add className="mr-1" fontSize="small" color="primary" /> Add{" "}
              {addAlternativeModal ? "Alternative" : "Item"}
              {isEmpty?.items && (
                <div className="ml-3 flex items-center">
                  <Error color="danger" fontSize="small" />
                  <p className="ml-2 text-danger text-sm font-semibold">
                    All fields of items are required.
                  </p>
                </div>
              )}
              {addItemModal &&
                itemsDropdownData?.items?.filter(
                  (item) => item?.uuid !== kitData?.kitParent
                ).length === 0 && (
                  <p className="ml-2 text-danger text-sm font-normal">
                    items are not available.
                  </p>
                )}
              {addAlternativeModal && remainingProducts?.length === 0 && (
                <p className="ml-2 text-danger text-sm font-normal">
                  items are not available.
                </p>
              )}
            </div>

            <div className="pointer" onClick={() => closeAddItemModal()}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>

          {/* Items View */}
          <div
            className={`${
              items?.length > 3 && "h-44 overflow-y-scroll"
            } px-3 pb-3`}>
            {items?.length > 0 &&
              items?.map((item, index) => {
                return (
                  <form key={index} className="mt-3">
                    <div className="flex items-center">
                      <div className="w-[20%]">
                        <MaterialDropdown
                          fullWidth
                          withRenderValue
                          multiple={false}
                          label="Part Type"
                          name="partType"
                          options={itemsDropdownData?.partType}
                          value={getItemsRowValues("Part Type", "value", item)}
                          userRoleToShow={getItemsRowValues(
                            "Part Type",
                            "",
                            item
                          )}
                          onChange={(e) => itemOnChange(e, item)}
                          error={
                            isEmpty.itemsEmpty || isEmpty?.items ? true : false
                          }
                        />
                      </div>

                      <div className="ml-3 w-[35%]">
                        <MaterialDropdown
                          fullWidth
                          withRenderValue
                          multiple={false}
                          label="Item"
                          name="item"
                          options={
                            addItemModal
                              ? itemsDropdownData?.items?.filter(
                                  (item) => item?.uuid !== kitData?.kitParent
                                )
                              : addAlternativeModal
                              ? remainingProducts
                              : []
                          }
                          value={getItemsRowValues("Item", "value", item)}
                          userRoleToShow={getItemsRowValues("Item", "", item)}
                          onChange={(e) => itemOnChange(e, item)}
                          error={
                            isEmpty.itemsEmpty || isEmpty?.items ? true : false
                          }
                        />
                      </div>

                      <div className="ml-3 w-[25%]">
                        <TextField
                          fullWidth
                          size="small"
                          label="Amount"
                          name="itemAmount"
                          value={getItemsRowValues("Amount", "value", item)}
                          onChange={(e) => itemOnChange(e, item)}
                          error={
                            isEmpty.itemsEmpty || isEmpty?.items ? true : false
                          }
                        />
                      </div>

                      <div className="ml-3 w-[15%]">
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
                            isEmpty.itemsEmpty || isEmpty?.items ? true : false
                          }
                        />
                      </div>

                      {items?.length > 1 && (
                        <div className="ml-4 w-[5%]">
                          <div
                            className="w-5"
                            onClick={() => itemOnDelete(index, item)}>
                            <Delete
                              className="cursor-pointer"
                              color="secondary"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                );
              })}
          </div>

          {/* Show Error */}
          {isAlternativeLengthExceed && (
            <Typography
              className="d-flex flex-row align-items-center pl-4 pb-2"
              variant="body1"
              color={danger}
              fontSize={15}
              fontWeight="light">
              Please delete an alternative, only 3 alternatives can be added to
              item.
            </Typography>
          )}
          {/* Add More button */}
          <Button
            size="medium"
            className="capitalize mx-3 mr-[10px] w-[96%]"
            component="span"
            variant="outlined"
            color="primary"
            disabled={loading}
            onClick={() => {
              if (addAlternativeModal) {
                let newTotalItem = totalItem;
                if (newTotalItem < 2) {
                  setItems([...items, items.length + 1]);
                  setTotalItem(totalItem + 1);
                } else {
                  setIsAlternativeLengthExceed(true);
                  console.log("length exceed");
                }
              } else {
                setItems([...items, items.length + 1]);
              }
            }}>
            <Add className="mr-1" fontSize="small" color="primary" /> Add More
          </Button>

          {/* Modal End Buttons */}
          <KitButtons
            from={addAlternativeModal ? "addAlternative" : "addItem"}
          />
        </div>
      </CustomModal>

      {/* Delete Kit Modal */}
      <SimpleDeleteModal
        states={{
          open: deleteModal,
          setOpen: setDeleteModal,
          errorMsg: isError,
          setErrorMsg: setIsError,
          headTitle: "Delete Kit",
          deleteName: state?.kit?.name,
          loading: deleteLoading,
          deleteMethod: () => handleDelete(state?.kit?.uuid),
        }}
      />


      <div>
        {/* BreadCrumbs */}
        <div className="flex justify-between items-center p-3 bg-white border-bottom">
          <div>
            <BreadCrumb
              routes={[
                {
                  name: "Inventory",
                  route: "/inventory/products",
                  color: true,
                },
                { name: "Kits", route: "/inventory/kits", color: true },
                { name: state?.kit ? state?.kit?.name : "Add New Kit" },
              ]}
            />
            <div>
              {state?.kit ? (
                <Edit className="mb-1" color="primary" />
              ) : (
                <Add className="mb-1" color="primary" />
              )}
              {state?.kit ? `Edit: ${state?.kit.name}` : "Add New Kit"}
            </div>
          </div>
        </div>

        {/* Add Kit Form View Start */}
        {loadingList ? (
          <Spinner />
        ) : (
          <div className="flex flex-col mt-4 ">
            {/* Basic Info View */}
            <div className="border rounded bg-white pb-0.5 mx-4">
              <h6 className="px-3 py-3">Basic Info</h6>

              <form className="px-3">
                <div className="row mb-3">
                  {/* Left section */}
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <TextField
                        fullWidth
                        size="small"
                        label="Kit Name"
                        name="kitName"
                        value={kitData.kitName}
                        onChange={handleOnChange}
                        helperText={
                          isEmpty.kitName ? "Kit Name is required" : ""
                        }
                        error={isEmpty.kitName ? true : false}
                      />
                    </div>

                    <div className="form-row mb-3">
                      <MaterialDropdown
                        fullWidth
                        withRenderValue
                        multiple={false}
                        label="Customer"
                        name="customer"
                        options={customers}
                        value={kitData.customer}
                        userRoleToShow={kitData.customerName}
                        onChange={handleOnChange}
                        error={isEmpty.customer ? true : false}
                        errorMsg={isEmpty.customer && "Customer is required"}
                      />
                    </div>

                    <div className="form-row mb-3">
                      <TextField
                        fullWidth
                        size="small"
                        label="Description"
                        name="description"
                        value={kitData.description}
                        onChange={handleOnChange}
                        helperText={
                          isEmpty.description ? "Description is required" : ""
                        }
                        error={isEmpty.description ? true : false}
                      />
                    </div>
                  </div>
                  {/* Right section */}
                  <div className="form-group col-md-6">
                    <div className="form-row mb-3">
                      <MaterialDropdown
                        fullWidth
                        withRenderValue
                        multiple={false}
                        label="Kit Parent / Finished Product"
                        name="kitParent"
                        options={kitParent}
                        value={kitData.kitParent}
                        userRoleToShow={kitData.kitParentName}
                        onChange={handleOnChange}
                        error={isEmpty.kitParent ? true : false}
                        errorMsg={isEmpty.kitParent && "Kit Parent is required"}
                      />
                      {dependencyLoading ? (
                        <p className="  text-[12px] text-success mr-20">
                          Loading...
                        </p>
                      ) : !kitData?.customer ? (
                        <p className="text-[12px] text-danger ">
                          Please select the customer first
                        </p>
                      ) : kitData?.customer &&
                        itemsDropdownData?.items?.length === 0 ? (
                        <p className="text-[12px] text-danger ">
                          Note: This Customer has no kit Parent
                        </p>
                      ) : kitParent?.length === 0 ? (
                        <p className="text-[12px] text-danger ">
                          The selected customer has no kit Parent
                        </p>
                      ) : null}
                    </div>
                    <div className="form-row mb-3">
                      <MultiDropDown
                        multiple={true}
                        placeholder={"Facilities"}
                        optionsArray={facilities}
                        value={kitData.facilities}
                        // disabled={facilityUser ? true : false}
                        onChange={handleMultiChange}
                        error={isEmpty.facilitiesUUID ? true : false}
                        errorMsg={
                          isEmpty.facilitiesUUID && "Facilities is required"
                        }
                      />
                      {dependencyLoading ? (
                        <p className="  text-[12px] text-success mr-20">
                          Loading...
                        </p>
                      ) : !kitData?.customer ? (
                        <p className="text-[12px] text-danger ">
                          Please select the customer first
                        </p>
                      ) : kitData?.customer &&
                        itemsDropdownData?.items?.length === 0 ? (
                        <p className="text-[12px] text-danger ">
                          Note: This Customer is not associated with any
                          facility.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className=" border rounded bg-white mt-4 mx-4 px-3">
              {/* Search Bar with Buttons */}
              <div className="flex flex-row justify-between align-items-center mt-2 mb-3">
                <div className="flex gap-2 ml-[2px]">
                  <h5>Items</h5>
                  {error ? (
                    <p className="mt-[2px] text-[14px] text-danger ">
                      {errorObj?.msg}
                    </p>
                  ) : null}
                  {isError ? (
                    <p className="mt-[2px] text-[14px] text-danger ">
                      Some Fields are empty!
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col items-end h-14">
                  {kitData?.customer &&
                  kitData?.kitParent &&
                  itemsDropdownData?.items?.length > 0 &&
                  kitParent?.length > 0 ? (
                    <Button
                      size="medium"
                      className="capitalize my-[10px] mr-5"
                      component="span"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setAddItemModal(true);
                        setError(false);
                      }}>
                      <Add className="mr-1" fontSize="small" color="primary" />{" "}
                      Add Item
                    </Button>
                  ) : (
                    <div className="oultline-primaryColor outline-1 !border border-primaryColor pl-2 pr-3 py-2 mr-5 rounded-[4px] text-primaryColor text-[14px] cursor-not-allowed mt-2 opacity-50">
                      <Add className="mx-2" fontSize="small" color="primary" />{" "}
                      Add Item
                    </div>
                  )}
                  {dependencyLoading ? (
                    <p className="  text-[12px] text-success mr-20">
                      Loading...
                    </p>
                  ) : !kitData?.customer ? (
                    <p className="text-[12px] text-danger ">
                      Please select the customer first
                    </p>
                  ) : !kitData?.kitParent ? (
                    <p className="text-[12px] text-danger ">
                      Please select the kit parent too
                    </p>
                  ) : kitData?.customer &&
                    itemsDropdownData?.items?.length === 0 ? (
                    <p className="text-[12px] text-danger ">
                      Note: This Customer has no Product
                    </p>
                  ) : kitParent?.length === 0 ? (
                    <p className="text-[12px] text-danger ">
                      Please selected customer who has kit Parent
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Table View */}
              <div className="!h-[300px] overflow-y-auto">
                <ItemsTabel
                  products={kitDetails?.kit_products}
                  dropdowndata={itemsDropdownData}
                  setAddAlternativeModal={setAddAlternativeModal}
                  kitDetails={kitDetails}
                  setKitData={setKitData}
                  kitData={kitData}
                  onRemoveItem={removeItem}
                  setKitDetails={setKitDetails}
                  setAddAlternativeItemIndex={setAddAlternativeItemIndex}
                  removeAlternative={removeAlternative}
                  setIsError={setIsError}
                  setAlternativeItemAlertModal={setAlternativeItemAlertModal}
                  alternativeItemAlertModal={alternativeItemAlertModal}
                  setTotalItem={setTotalItem}
                  setAlternativeSelectedItemId={setAlternativeSelectedItemId}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="">
        <Buttons />
      </div>
    </div>
  );
};

export default AddKits;
