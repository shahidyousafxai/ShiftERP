// Library Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add, Error, Delete } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
// Local Imports
import {
  MaterialDropdown,
  CustomModal,
  Button,
  Spinner,
  BreadCrumb,
  DatePicker,
  Typography,
  TextField,
} from "../../../../shared";
import RevenueItemCrud from "./RevenueItemCrud";
import { addNewRevenueExpense } from "../../../../api/revenueExpenseApi";
import { getAllDependenciesAccounting } from "../../../../api/allDependencies";
import { SimpleDeleteModal } from "../../../../helpers/SimpleDeleteModal";

const AddNewRevenueExpenses = () => {
  //Navigations
  const navigate = useNavigate();
  // States
  const [error, setError] = useState(false);
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });
  // Loading States
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  //RevenueItem crud States
  const [showAddNewItem, setShowAddNewItem] = useState(true);
  const [showAddNewItemInput, setShowAddNewItemInput] = useState(false);
  const [hoveredItem, setHoveredItem] = useState("");
  const [editItem, setEditItem] = useState("");
  const [revenueItemArray, setRevenueItemArray] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  //Modal States
  const [isDelete, setIsDelete] = useState(false);
  const [isFacilityChange, setIsFacilityChange] = useState(false);
  const [facilityLoading, setFacilityLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [facilities, setFacilities] = useState([]);

  //form Data
  const [revenueExpenseData, setRevenueExpenseData] = useState({
    date: new Date(),
    facilityName: "",
    facilityUUID: "",
    customerName: "",
    customerUUID: "",
    items: "",
  });

  const [isEmpty, setIsEmpty] = useState({
    date: false,
    customerUUID: false,
    facilityUUID: false,
    itemsEmpty: false,
    items: false,
  });
  const [items, setItems] = useState([1]);
  const [itemsDropdownData, setItemsDropdownData] = useState({
    revenueType: [],
    revenueItem: [],
  });

  const [deleteItemValue, setDeleteItemValue] = useState({});

  //handle change of customer,facility,date
  const handleOnChange = (e, name) => {
    if (e.target.name === "customerUUID") {
      if (
        Object.keys(revenueExpenseData.items).length > 0 &&
        revenueExpenseData.customerName !== "" &&
        revenueExpenseData.customerUUID !== ""
      ) {
        setIsFacilityChange(true);
      } else {
        let name = "";
        customers?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });
        setRevenueExpenseData({
          ...revenueExpenseData,
          customerName: name,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name === "facilityUUID") {
      if (
        Object.keys(revenueExpenseData.items).length > 0 &&
        revenueExpenseData.facilityName !== "" &&
        revenueExpenseData.facilityUUID !== "" &&
        revenueExpenseData.customerName !== "" &&
        revenueExpenseData.customerUUID !== ""
      ) {
        setIsFacilityChange(true);
      } else {
        let name = "";
        facilities?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setRevenueExpenseData({
          ...revenueExpenseData,
          facilityName: name,
          customerName: "",
          customerUUID: "",
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setRevenueExpenseData({
        ...revenueExpenseData,
      });
    }
    setIsEmpty({
      ...isEmpty,
      customerUUID: false,
      facilityUUID: false,
    });
  };

  //handle date change
  const handleDateChange = (e, name) => {
    setRevenueExpenseData({
      ...revenueExpenseData,
      [name]: e,
    });
    setIsEmpty({
      ...isEmpty,
      date: false,
    });
  };

  /******************************handleChange Revenue/Expense Item Start *********************************/
  const itemOnChange = (e, itemNum) => {
    if (revenueExpenseData?.items) {
      if (`${itemNum}` in revenueExpenseData?.items) {
        let existingItem = revenueExpenseData?.items?.[itemNum];
        if (e.target.name === "revenueType") {
          let selectedRevenueType = itemsDropdownData?.revenueType?.find(
            (el) => {
              if (el.uuid === e.target.value) return el;
            }
          );
          existingItem.revenueType = selectedRevenueType;
          let data = { ...revenueExpenseData?.items, [itemNum]: existingItem };
          setRevenueExpenseData({ ...revenueExpenseData, items: data });
        }
        if (e.target.name === "revenueItem") {
          let selectedRevenueItem = itemsDropdownData?.revenueItem?.find(
            (el) => {
              if (el.uuid === e.target.value) return el;
            }
          );
          existingItem.revenueItem = selectedRevenueItem;
          let data = { ...revenueExpenseData?.items, [itemNum]: existingItem };
          setRevenueExpenseData({ ...revenueExpenseData, items: data });
          setShowAddNewItem(true);
          setShowAddNewItemInput(false);
          setHoveredItem("");
          setEditItem("");
        }
        if (e.target.name === "itemAmount") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          existingItem.amount = e.target.value;
          let data = { ...revenueExpenseData?.items, [itemNum]: existingItem };
          setRevenueExpenseData({ ...revenueExpenseData, items: data });
        }
        if (e.target.name === "itemNotes") {
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          existingItem.notes = e.target.value;
          let data = { ...revenueExpenseData?.items, [itemNum]: existingItem };
          setRevenueExpenseData({ ...revenueExpenseData, items: data });
        }
      } else {
        if (e.target.name === "revenueType") {
          let selectedRevenueType = itemsDropdownData?.revenueType?.find(
            (el) => {
              if (el.uuid === e.target.value) return el;
            }
          );
          let data = {
            ...revenueExpenseData?.items,
            [itemNum]: { revenueType: selectedRevenueType },
          };
          setRevenueExpenseData({ ...revenueExpenseData, items: data });
        }
        if (e.target.name === "revenueItem") {
          let selectedRevenueItem = itemsDropdownData?.revenueItem?.find(
            (el) => {
              if (el.uuid === e.target.value) return el;
            }
          );
          let data = {
            ...revenueExpenseData?.items,
            [itemNum]: { revenueItem: selectedRevenueItem },
          };
          setRevenueExpenseData({ ...revenueExpenseData, items: data });
          setShowAddNewItem(true);
          setShowAddNewItemInput(false);
          setHoveredItem("");
          setEditItem("");
        }
        if (e.target.name === "itemAmount") {
          e.target.value = e.target.value.replace(/[^\d]/g, "");
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = {
            ...revenueExpenseData?.items,
            [itemNum]: { amount: e.target.value },
          };
          setRevenueExpenseData({ ...revenueExpenseData, items: data });
        }
        if (e.target.name === "itemNotes") {
          e.target.value.charAt(0) === "0"
            ? (e.target.value = "")
            : (e.target.value = e.target.value);
          let data = {
            ...revenueExpenseData?.items,
            [itemNum]: { notes: e.target.value },
          };
          setRevenueExpenseData({ ...revenueExpenseData, items: data });
        }
      }
    } else {
      if (e.target.name === "revenueType") {
        let selectedRevenueType = itemsDropdownData?.revenueType?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { revenueType: selectedRevenueType } };
        setRevenueExpenseData({ ...revenueExpenseData, items: data });
      }
      if (e.target.name === "revenueItem") {
        let selectedRevenueItem = itemsDropdownData?.revenueItem?.find((el) => {
          if (el.uuid === e.target.value) return el;
        });
        let data = { [itemNum]: { revenueItem: selectedRevenueItem } };
        setRevenueExpenseData({ ...revenueExpenseData, items: data });
        setShowAddNewItem(true);
        setShowAddNewItemInput(false);
        setHoveredItem("");
        setEditItem("");
      }
      if (e.target.name === "itemAmount") {
        e.target.value = e.target.value.replace(/[^\d]/g, "");
        e.target.value.charAt(0) === "0"
          ? (e.target.value = "")
          : (e.target.value = e.target.value);
        let data = { [itemNum]: { amount: e.target.value } };
        setRevenueExpenseData({ ...revenueExpenseData, items: data });
      }
      if (e.target.name === "itemNotes") {
        e.target.value.charAt(0) === "0"
          ? (e.target.value = "")
          : (e.target.value = e.target.value);
        let data = { [itemNum]: { notes: e.target.value } };
        setRevenueExpenseData({ ...revenueExpenseData, items: data });
      }
    }

    setIsEmpty({
      ...isEmpty,
      itemsEmpty: false,
      items: false,
    });
  };

  const getItemsRowValues = (from, type, itemNum) => {
    if (from === "Revenue Type") {
      return type === "value"
        ? revenueExpenseData?.items &&
          revenueExpenseData?.items[itemNum]?.revenueType?.uuid
          ? revenueExpenseData?.items[itemNum]?.revenueType?.uuid
          : ""
        : revenueExpenseData?.items &&
          revenueExpenseData?.items[itemNum]?.revenueType?.name
        ? revenueExpenseData?.items[itemNum]?.revenueType?.name
        : "";
    }
    if (from === "Revenue Item") {
      return type === "value"
        ? revenueExpenseData?.items &&
          revenueExpenseData?.items[itemNum]?.revenueItem?.uuid
          ? revenueExpenseData?.items[itemNum]?.revenueItem?.uuid
          : ""
        : revenueExpenseData?.items &&
          revenueExpenseData?.items[itemNum]?.revenueItem?.name
        ? revenueExpenseData?.items[itemNum]?.revenueItem?.name
        : "";
    }
    if (from === "Amount") {
      return type === "value" &&
        revenueExpenseData?.items &&
        revenueExpenseData?.items[itemNum]?.amount
        ? revenueExpenseData?.items[itemNum]?.amount
        : "";
    }
    if (from === "Notes") {
      return type === "value" &&
        revenueExpenseData?.items &&
        revenueExpenseData?.items[itemNum]?.notes
        ? revenueExpenseData?.items[itemNum]?.notes
        : "";
    }
  };

  const itemOnDelete = (index, item) => {
    setIsDelete(true);
    setDeleteItemValue({ index, item });
  };

  /******************************handleChange Revenue/Expense Item End *********************************/

  //Use Effect for Calling Dependency API
  useEffect(() => {
    if (revenueItemArray.length > 0) {
      getDependencyList();
    }
  }, [revenueExpenseData?.facilityUUID, revenueItemArray]);

  // Dependencies Listing Call
  const getDependencyList = () => {
    let payload = {
      name: "expense_revenue",
      facility_id: revenueExpenseData.facilityUUID,
    };
    setFacilityLoading(true);
    getAllDependenciesAccounting(payload)
      .then((res) => {
        setFacilityLoading(false);
        let data = res?.data?.data;
        setFacilities(data?.facilities);
        setCustomers(data?.customer);
        setItemsDropdownData({
          revenueType: data?.revenue_type,
          revenueItem: revenueItemArray,
        });
      })
      .catch((error) => {
        setFacilityLoading(false);
        console.log("🚀 ~ file: AddNewProduct.js ~ line 35 ~ error", error);
      });
  };

  // Empty Checked
  const isrevenueExpenseDataEmpty = () => {
    if (revenueExpenseData.date === "" || revenueExpenseData?.date === null) {
      setIsEmpty({ ...isEmpty, date: true });
      return true;
    } else if (
      revenueExpenseData.facilityUUID === "" ||
      revenueExpenseData?.facilityName === ""
    ) {
      setIsEmpty({ ...isEmpty, facilityUUID: true });
      return true;
    } else if (
      revenueExpenseData.customerUUID === "" ||
      revenueExpenseData?.customerName === ""
    ) {
      setIsEmpty({ ...isEmpty, customerUUID: true });
      return true;
    } else if (
      !revenueExpenseData.items ||
      Object.keys(revenueExpenseData?.items).length === 0
    ) {
      setIsEmpty({ ...isEmpty, items: true, itemsEmpty: true });
      return true;
    } else if (
      revenueExpenseData.items ||
      Object.keys(revenueExpenseData?.items).length !== 0
    ) {
      let check = Object.values(revenueExpenseData?.items).map((item) => {
        if (
          !("revenueType" in item) ||
          item?.revenueType === "" ||
          !("revenueItem" in item) ||
          item?.revenueItem === "" ||
          !("amount" in item) ||
          item?.amount === "" ||
          !("notes" in item) ||
          item?.notes === ""
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

  //Create payload
  const createPayload = () => {
    const revenueExpensePayload = Object.values(revenueExpenseData?.items).map(
      (item) => {
        const obj = {
          revenue_item_id: item?.revenueItem?.uuid,
          revenue_type_id: item?.revenueType?.uuid,
          amount: item?.amount?.substring(0, 7),
          notes: item?.notes,
        };
        return obj;
      }
    );

    const payload = {
      date: revenueExpenseData?.date,
      customer_id: revenueExpenseData?.customerUUID,
      facility_id: revenueExpenseData?.facilityUUID,
      revenues: revenueExpensePayload,
    };
    return payload;
  };

  //AddRevenueExpense
  const onPressAddRevenueExpense = () => {
    setLoading(true);
    if (!isrevenueExpenseDataEmpty()) {
      const payload = createPayload();
      addNewRevenueExpense(payload)
        .then((res) => {
          navigate("/accounting/revenue-expense");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setAlertModal(true);
          setErrorMsg({
            type: "error",
            title: "Error",
            msg: err?.response?.data?.errors?.name,
          });
        });
    } else {
      setLoading(false);
    }
  };

  //End Buttons
  const Buttons = () => {
    return (
      <div
        className={`d-flex mt-4 py-4 justify-content-end bg-white border-t border-lightGray`}>
        <div className="buttons d-flex">
          <Button
            size="medium"
            className="capitalize mr-[10px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => navigate("/accounting/revenue-expense")}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="capitalize mr-[20px] w-[130px]"
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading}
            onClick={onPressAddRevenueExpense}>
            {"Add New Item"}
          </Button>
        </div>
      </div>
    );
  };

  //handle Add New Item
  const handleAddItem = () => {
    const maxItemValue = Math.max(...items);
    const newItemValue = maxItemValue + 1;
    setItems([...items, newItemValue]);
  };

  //handle Cancel Delete Modal
  const handleCancelDeleteModal = () => {
    setIsDelete(false);
  };

  //handle Delete Modal
  const handleDeleteModal = () => {
    let index = deleteItemValue?.index;
    let item = deleteItemValue?.item;

    setIsDelete(false);
    setItems(items.filter((_, i) => i !== index).map((_, i) => i + 1));

    // Deleting Row Data From State
    let data = revenueExpenseData?.items;
    delete data?.[item];

    // Update the indexing in revenueExpenseData.items
    let newData = {};
    Object.keys(data).forEach((key, newIndex) => {
      newData[newIndex + 1] = data[key];
    });

    // Setting State
    setRevenueExpenseData({ ...revenueExpenseData, items: newData });
  };

  const handleCancelCompanyChangeModal = () => {
    setIsFacilityChange(false);
  };

  const handleCompanyChangeModal = () => {
    setIsFacilityChange(false);
    setRevenueExpenseData({
      ...revenueExpenseData,
      facilityName: "",
      facilityUUID: "",
      customerName: "",
      customerUUID: "",
    });
    setIsLoading(true);
    setCustomers([]);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [isLoading]);
  return (
    <div className="flex flex-col justify-between h-[100vh]">
      <div>
        {/* Bread Crums Start*/}
        <div className="flex justify-between items-center p-3 bg-white border-bottom">
          <div>
            <BreadCrumb
              routes={[
                {
                  name: "Billing & Accounting",
                  route: "/accounting/production-extras",
                  color: true,
                },
                {
                  name: "Revenue/Expense",
                  route: "/accounting/revenue-expense",
                  color: true,
                },
                {
                  name: "Add New Revenue/Expense",
                },
              ]}
            />

            <div>
              <Add className="mb-1" color="primary" />
              Add New Revenue/Expense
            </div>
          </div>
        </div>
        {/* Bread Crums End*/}

        {/* Error Message Alert Modal */}
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

        {/* Delete Modal RevenueExpense Row */}
        <SimpleDeleteModal
          states={{
            open: isDelete,
            setOpen: setIsDelete,
            headTitle: "Delete Revenue/Expense",
            deleteMethod: () => handleDeleteModal(),
          }}
        />

        {/* Change Facility/Company Modal */}
        <CustomModal
          open={isFacilityChange}
          close={() => setIsFacilityChange(!isFacilityChange)}
          width={window.innerWidth * 0.4}>
          <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row justify-content-between align-items-center text-center">
                <b className="mx-[20px] mb-1">Change Company/Facility</b>
              </div>
              <div
                className="pointer mx-3"
                onClick={handleCancelCompanyChangeModal}>
                <ClearIcon color="secondary" fontSize="small" />
              </div>
            </div>
            <div className="my-3 mx-4">
              <Typography variant="body1" fontSize={15} fontWeight="light">
                Are you sure you would like to change the company/facility ?
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
                  onClick={handleCompanyChangeModal}>
                  Yes
                </Button>
                <Button
                  component="span"
                  color="secondary"
                  className="capitalize"
                  variant="outlined"
                  onClick={handleCancelCompanyChangeModal}>
                  No
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {isLoading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {/* Basic Info Section Start*/}
            <div className="flex flex-col pt-[20px]">
              <div className="border rounded bg-white pb-0.5 mx-4">
                <h6 className="px-3 py-3">Basic Info</h6>
                <form className="px-3">
                  <div className=" row">
                    <div className="form-group col-md-4">
                      <div className="form-row mb-3">
                        <DatePicker
                          label="Date"
                          fullWidth
                          size="small"
                          PopperProps={{ placement: "bottom-end" }}
                          value={revenueExpenseData.date}
                          inputFormat={"dd/MM/yyyy"}
                          name="date"
                          onChange={(e) => handleDateChange(e, "date")}
                          error={isEmpty.date ? true : false}
                          helperText={isEmpty.date ? "Date is required" : ""}
                        />
                      </div>
                      <div className="form-row mb-3">
                        <MaterialDropdown
                          fullWidth
                          withRenderValue
                          multiple={false}
                          label="Company/Facility"
                          name="facilityUUID"
                          options={facilities}
                          value={revenueExpenseData.facilityUUID}
                          userRoleToShow={revenueExpenseData.facilityName}
                          onChange={handleOnChange}
                          error={isEmpty.facilityUUID ? true : false}
                        />
                      </div>

                      <div className="form-row mb-3">
                        <MaterialDropdown
                          fullWidth
                          withRenderValue
                          multiple={false}
                          label="Customer"
                          name="customerUUID"
                          options={customers}
                          value={revenueExpenseData.customerUUID}
                          userRoleToShow={revenueExpenseData.customerName}
                          onChange={handleOnChange}
                          error={isEmpty.customerUUID ? true : false}
                        />
                        {facilityLoading ? (
                          <span className="mt-4 text-[12px] text-success">
                            Loading...
                          </span>
                        ) : !facilityLoading &&
                          customers?.length === 0 &&
                          revenueExpenseData?.facilityName !== "" ? (
                          <span className="mt-4 text-[12px] text-danger">
                            This Facility has no customers
                          </span>
                        ) : (
                          ""
                        )}
                        {!facilityLoading &&
                          revenueExpenseData?.facilityName?.length === 0 && (
                            <span className="ml-2 text-[12px] text-danger">
                              Please Select Facility First
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* Basic Info Section End*/}

            {/* Revenue/Expense Section Start*/}
            <div className="border rounded bg-white py-3 px-3 mt-4 mx-4">
              <div className="flex items-center">
                <h6>Revenue/Expense</h6>
                {isEmpty?.items && (
                  <div className="ml-3 flex items-center">
                    <Error color="danger" fontSize="small" />
                    <p className="ml-2 text-danger text-sm font-semibold">
                      {isEmpty?.itemsEmpty
                        ? "Add at least one Revenue/Expense item"
                        : "All fields of Revenue/Expense item are required."}
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`${
                  items?.length > 4 && "max-h-80 overflow-y-scroll"
                }`}>
                {items?.length > 0 &&
                  items?.map((item, index) => {
                    return (
                      <form key={index} className="mt-3">
                        <div className="flex items-center">
                          {/* Revenue Type */}
                          <div className="w-[20%] mt-1">
                            <MaterialDropdown
                              fullWidth
                              withRenderValue
                              multiple={false}
                              label="Revenue Type"
                              name="revenueType"
                              options={itemsDropdownData?.revenueType}
                              value={getItemsRowValues(
                                "Revenue Type",
                                "value",
                                item
                              )}
                              userRoleToShow={getItemsRowValues(
                                "Revenue Type",
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
                          {/* Revenue Item */}
                          <div className="ml-4 !w-[40%]">
                            <RevenueItemCrud
                              setRevenueItemArray={setRevenueItemArray}
                              revenueItemArray={revenueItemArray}
                              showAddNewItem={showAddNewItem}
                              setShowAddNewItem={setShowAddNewItem}
                              showAddNewItemInput={showAddNewItemInput}
                              setShowAddNewItemInput={setShowAddNewItemInput}
                              hoveredItem={hoveredItem}
                              setHoveredItem={setHoveredItem}
                              editItem={editItem}
                              setEditItem={setEditItem}
                              getItemsRowValues={getItemsRowValues}
                              itemOnChange={itemOnChange}
                              value={true}
                              handleChange={true}
                              item={item}
                              isEmpty={isEmpty}
                              itemsList={itemsList}
                              setItemsList={setItemsList}
                              revenueExpenseData={revenueExpenseData}
                              setRevenueExpenseData={setRevenueExpenseData}
                            />
                          </div>
                          {/* Amount */}
                          <div className="ml-4 w-[20%]">
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
                          {/* Notes */}
                          <div className="ml-4 w-[20%]">
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
                              className="mx-4 w-fit">
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
                  className="capitalize text-[13px] font-medium text-black"
                  onClick={() => setItems([...items, items.length + 1])}
                  component="span"
                  color="secondary"
                  variant="outlined"
                  disabled={loading}>
                  Add Revenue/Expense Item
                </Button>
              </div>
            </div>
            {/* Revenue/Expense Section End*/}
          </React.Fragment>
        )}
      </div>
      <Buttons />
    </div>
  );
};

export default AddNewRevenueExpenses;
