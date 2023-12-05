// Library Imports
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Add, Clear, Error } from "@mui/icons-material";
// Local Imports
import {
  BreadCrumb,
  Button,
  CustomModal,
  DatePicker,
  MaterialDropdown,
  Spinner,
  TextField,
  Typography,
} from "../../../../shared";
import RevenueItemCrud from "./RevenueItemCrud";
import { getAllDependenciesAccounting } from "../../../../api/allDependencies";
import {
  deleteRevenueExpense,
  updateRevenueExpense,
} from "../../../../api/revenueExpenseApi";
import { SimpleDeleteModal } from "../../../../helpers/SimpleDeleteModal";

const EditRevenueExpense = () => {
  //Navigations
  const navigate = useNavigate();
  let { id } = useParams();
  const { state } = useLocation();
  const revenueExpense = state?.revenueExpense;

  //RevenueItem crud States
  const [showAddNewItem, setShowAddNewItem] = useState(true);
  const [showAddNewItemInput, setShowAddNewItemInput] = useState(false);
  const [hoveredItem, setHoveredItem] = useState("");
  const [editItem, setEditItem] = useState("");
  const [revenueItem, setRevenueItem] = useState(
    id ? revenueExpense?.revenue_item?.uuid : ""
  );

  //Modal States
  const [isFacilityChange, setIsFacilityChange] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [facilityLoading, setFacilityLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorObj, setErrorMsg] = useState({
    type: "",
    title: "",
    msg: "",
  });

  //States
  const [customers, setCustomers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [revenueType, setRevenueType] = useState([]);
  const [itemsList, setItemsList] = useState([]);

  const [revenueExpenseData, setRevenueExpenseData] = useState({
    date: id ? revenueExpense?.date : new Date(),
    facilityName: id ? revenueExpense?.facility?.name : "",
    facilityUUID: id ? revenueExpense?.facility?.uuid : "",
    customerName: id ? revenueExpense?.customer?.name : "",
    customerUUID: id ? revenueExpense?.customer?.uuid : "",
    revenueType: id ? revenueExpense?.revenue_type?.name : "",
    revenueTypeUUID: id ? revenueExpense?.revenue_type?.uuid : "",
    amount: id ? revenueExpense?.amount : "",
    notes: id ? revenueExpense?.notes : "",
  });

  const [isEmpty, setIsEmpty] = useState({
    facilityUUID: false,
    customerUUID: false,
    revenueTypeUUID: false,
    revenueItemUUID: false,
    amount: false,
    notes: false,
  });

  //Input Validations
  const validateInput = (name, text) => {
    var alphaNum = /^[0-9a-zA-Z\s]*$/;
    var numbers = /^(?!(0))[0-9]{0,15}$/;

    if (name === "notes") {
      return alphaNum.test(text);
    } else if (name === "amount") {
      return numbers.test(text);
    } else {
      return true;
    }
  };

  //handle change of customer,facility
  const handleOnChange = (e) => {
    if (e.target.name === "customerUUID") {
      if (
        // Object.keys(revenueExpenseData.items).length > 0 &&
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
        // Object.keys(revenueExpenseData.items).length > 0 &&
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

  //handle Date Change
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

  //handleRevenue/Expense Item
  const handleChange = (e) => {
    if (validateInput(e.target.name, e.target.value)) {
      if (e.target.name === "revenueTypeUUID") {
        let name = "";
        revenueType?.filter((item) => {
          if (item?.uuid === e.target.value) {
            name = item?.name;
            return item?.name;
          }
        });

        setRevenueExpenseData({
          ...revenueExpenseData,
          revenueType: name,
          [e.target.name]: e.target.value,
        });
      } else {
        setRevenueExpenseData({
          ...revenueExpenseData,
          [e.target.name]: e.target.value,
        });
      }
    }
    setIsEmpty({
      ...isEmpty,
      [e.target.name]: false,
    });
  };

  //create payload
  const createPayload = () => {
    let payload = {
      uuid: revenueExpense?.uuid,
      revenue_item_id: revenueItem,
      customer_id: revenueExpenseData.customerUUID,
      facility_id: revenueExpenseData.facilityUUID,
      revenue_type_id: revenueExpenseData?.revenueTypeUUID,
      // shift_id: "41356f7272c94876a752e797fdf25d84",
      date: revenueExpenseData.date,
      amount: revenueExpenseData.amount?.substring(0, 7),
      notes: revenueExpenseData.notes,
    };
    return payload;
  };

  //Check if Revenue Expense Details are empty
  const isRevenueExpenseDetailsEmpty = () => {
    if (revenueExpenseData.date === "" || revenueExpenseData.date === null) {
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
      revenueExpenseData.revenueTypeUUID === "" ||
      revenueExpenseData?.revenueType === ""
    ) {
      setIsEmpty({ ...isEmpty, amount: true });
      return true;
    } else if (
      revenueExpenseData.revenueItemUUID === "" ||
      revenueExpenseData?.revenueItemUUID === ""
    ) {
      setIsEmpty({ ...isEmpty, amount: true });
      return true;
    } else if (revenueExpenseData.amount === "") {
      setIsEmpty({ ...isEmpty, amount: true });
      return true;
    } else if (revenueExpenseData.notes === "") {
      setIsEmpty({ ...isEmpty, notes: true });
      return true;
    }
  };

  // On Press Edit Revenue
  const onPressEditRevenueExpense = () => {
    if (!isRevenueExpenseDetailsEmpty()) {
      setLoading(true);
      let payload = createPayload();
      updateRevenueExpense(payload)
        .then((resp) => {
          setLoading(false);
          navigate("/accounting/revenue-expense");
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
            <div className="text-black">
              {error?.response?.data?.message} <br />
              {error?.response?.data?.errors}
            </div>;
          }
        });
    }
  };

  //handle Delete
  const handleDelete = () => {
    let payload = {
      expense_revenue_uuid: [revenueExpense?.uuid],
    };
    setDeleteLoading(true);
    deleteRevenueExpense(payload)
      .then((res) => {
        setIsDelete(false);
        setDeleteLoading(false);
        navigate("/accounting/revenue-expense");
      })
      .catch((error) => {
        setDeleteLoading(false);
        setIsErrorMsg(error?.response?.data?.message);
      });
  };

  //handle Company Change Modal
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

  //handle Cancel Company Change Modal
  const handleCancelCompanyChangeModal = () => {
    setIsFacilityChange(false);
  };

  //Use Effect for Calling Dependency API
  useEffect(() => {
    getDependencyList();
  }, [revenueExpenseData?.facilityUUID]);

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
        setCustomers(data?.customer);
        setFacilities(data?.facilities);
        setRevenueType(data?.revenue_type);
      })
      .catch((error) => {
        setFacilityLoading(false);
      });
  };

  //End Buttons
  const Buttons = () => {
    return (
      <div className="mt-4 py-4 bg-white overflow-auto d-flex justify-between border-t-[1px] solid border-lightGray">
        <div className="mx-4">
          <Button
            size="medium"
            className="capitalize mr-[20px] "
            component="span"
            variant="outlined"
            color="danger"
            onClick={() => setIsDelete(!isDelete)}>
            Delete Revenue/Expense
          </Button>
        </div>

        <div className="buttons d-flex">
          <Button
            size="medium"
            className="capitalize mr-[10px]"
            component="span"
            variant="outlined"
            color="secondary"
            disabled={loading || deleteLoading}
            onClick={() => navigate("/accounting/revenue-expense")}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="capitalize mr-[20px] "
            component="span"
            color="primary"
            variant="contained"
            loading={loading}
            disabled={loading || deleteLoading}
            onClick={onPressEditRevenueExpense}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 50);
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
                // {
                //   name: revenueExpense?.revenueType,
                // },
              ]}
            />

            <div>
              <Add className="mb-1" color="primary" />
              Edit Revenue/Expense
            </div>
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
                <Clear color="secondary" fontSize="small" />
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
        <SimpleDeleteModal
          states={{
            open: isDelete,
            setOpen: setIsDelete,
            errorMsg: isErrorMsg,
            setErrorMsg: setIsErrorMsg,
            headTitle: "Delete Revenue/Expense",
            deleteName: revenueExpenseData?.customerName,
            loading: deleteLoading,
            deleteMethod: () => handleDelete(),
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
                <Clear color="secondary" fontSize="small" />
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
          <div className="flex flex-col pt-[20px]">
            {/* Basic Info Section Start*/}
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
                        errorMsg={
                          isEmpty.facilityUUID
                            ? "Company/Facility is required"
                            : ""
                        }
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
                        errorMsg={
                          isEmpty.customerUUID ? "Customer is required" : ""
                        }
                      />
                      {facilityLoading ? (
                          <span className="mt-4 text-[12px] text-success">
                          Loading...
                        </span>
                      ) : !facilityLoading &&
                        customers?.length === 0 &&
                        revenueExpenseData?.facilityUUID !== "" ? (
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
            {/* Basic Info Section End*/}

            {/* Revenue/Expense Section Start*/}
            <div className="border rounded bg-white pb-0.5 mx-4 mt-4">
              <h6 className="px-3 py-3">Revenue/Expense Info</h6>
              <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-5 px-3 mb-2">
                <div className="form-group col ">
                  <MaterialDropdown
                    multiple={false}
                    options={revenueType}
                    value={revenueExpenseData.revenueTypeUUID}
                    label={"Revenue Type"}
                    name="revenueTypeUUID"
                    withRenderValue
                    fullWidth
                    onChange={handleChange}
                    userRoleToShow={revenueExpenseData.revenueType}
                    error={
                      isEmpty?.revenueTypeUUID ? "Revenue Type is required" : ""
                    }
                    errorMsg={
                      isEmpty?.revenueTypeUUID ? "Revenue Type is required" : ""
                    }
                    errorState={isEmpty?.revenueTypeUUID}
                  />
                </div>

                <div className="form-group col !w-[40%]">
                  <RevenueItemCrud
                    revenueItem={revenueItem}
                    setRevenueItem={setRevenueItem}
                    setItemsDropdownData={() => {}}
                    getItemsRowValues={() => {}}
                    value={false}
                    onChange={false}
                    isEmpty={false}
                    showAddNewItem={showAddNewItem}
                    setShowAddNewItem={setShowAddNewItem}
                    showAddNewItemInput={showAddNewItemInput}
                    setShowAddNewItemInput={setShowAddNewItemInput}
                    hoveredItem={hoveredItem}
                    setHoveredItem={setHoveredItem}
                    editItem={editItem}
                    setEditItem={setEditItem}
                    itemsList={itemsList}
                    setItemsList={setItemsList}
                  />
                </div>

                <div className="form-group col ">
                  <TextField
                    size="small"
                    label="Amount"
                    type={"text"}
                    name="amount"
                    value={revenueExpenseData.amount}
                    fullWidth
                    onChange={handleChange}
                    helperText={isEmpty?.amount ? "Amount is required" : ""}
                    error={isEmpty?.amount ? true : false}
                  />
                </div>

                <div className="form-group col ">
                  <TextField
                    size="small"
                    label="Notes"
                    type={"text"}
                    name="notes"
                    value={revenueExpenseData.notes}
                    fullWidth
                    onChange={handleChange}
                    helperText={isEmpty?.notes ? "Notes is required" : ""}
                    error={isEmpty?.notes ? true : false}
                  />
                </div>
              </div>
            </div>
            {/* Revenue/Expense Section End*/}
          </div>
        )}
      </div>
      <div>
        <Buttons />
      </div>
    </div>
  );
};

export default EditRevenueExpense;
