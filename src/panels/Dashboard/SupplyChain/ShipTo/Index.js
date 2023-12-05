/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-self-compare */
// Library Imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import { useDispatch } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
// Local Imports
import {
  BreadCrumb,
  Button,
  CustomModal,
  SearchBar,
  Table as ShipToTable,
  Spinner,
  OptionModal,
  ModalButton,
  AlertMessage,
  Typography,
} from "../../../../shared";
import { getShipTo } from "../../../../redux/shipTo/actions";
import {
  GetShipToListing,
  GetSipToLoading,
} from "../../../../redux/shipTo/selectors";
import { Name, Status } from "../../../../helpers/TableUtilities";
import { ManageShipTo } from "./Components/utlis";
import { handleStatusOrCustomer } from "../../../../api/shipToApi";
import { GetUniversalCustomersList } from "../../../../redux/universalcustomers/selectors";
import { getUniCustomers } from "../../../../redux/universalcustomers/actions";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "./mockupData/mockupData";

const ShipTo = () => {
  //Nvigate & Lsitings
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = GetSipToLoading();
  const shipTo = GetShipToListing();
  const customers = GetUniversalCustomersList();
  //All the States
  const [columns] = useState(columnData);
  const [columnToShow, setColumnToShow] = useState(columnData);
  const [columnSetting1] = useState(["status"]);
  const [columnSetting2] = useState(["manage"]);
  const [columnSetting3] = useState(["customerName"]);
  const [name, setName] = useState("");
  const [selectionIds, setSelectionIds] = useState([]);
  const [selectedShipTo, setSelectedShipTo] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDeactive, setIsDeactive] = useState(false);
  const [isAddCustomer, setIsAddCustomer] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [statusAlert, setStatusAlert] = useState(false);
  const [statusType, setStatusType] = useState("");

  //OnChange Edit Columns
  const onChangeEditColumn = (item) => {
    if (item === "clearAll") {
      setColumnToShow(columnData);
    } else {
      let toShow = [...columnToShow];
      if (toShow.find((el) => el.title === item.title)) {
        toShow.splice(
          toShow.findIndex((el) => el.title === item.title),
          1
        );
      } else {
        toShow = [...toShow, item];
      }
      setColumnToShow(toShow);
    }
  };
  //filters
  const [filters, setFilters] = useState({
    Status: [
      {
        title: "Active",
        value: false,
      },
      {
        title: "Inactive",
        value: false,
      },
    ],
  });

  const dataProviders = [
    {
      columnName: columnSetting1,
      func: (restProps) => Status(restProps?.row?.status, "Active", "Inactive"),
    },
    {
      columnName: columnSetting2,
      func: (restProps) =>
        ManageShipTo(restProps, setSelectionIds, setDeleteAlert),
    },
    { 
      columnName: columnSetting3, 
      // Please pass an empty string if no any of the argument is missing
      func: (restProps) => Name(restProps.row.customerName, "", ""), 
    },
  ];

  //Filters Onchange
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let status = filters.Status.slice();

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };

        const newObj = { Status: status };

        return newObj;
      });
    } else if (from === "Status") {
      setFilters(() => {
        let status = filters.Status.slice();

        if (index === 0) {
          status[index] = { title: item.title, value: !item.value };
          status[index + 1] = { title: status[index + 1].title, value: false };
        } else {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = { title: status[index - 1].title, value: false };
        }

        const newObj = {
          Status: status,
        };
        return newObj;
      });
    }
  };

  //OnSearch SearchBar
  const onShipToSearch = () => {
    getShipToListing();
  };

  //Get ShipTo Listing With Dependencies
  const getShipToListing = () => {
    let status = filters.Status[0].value ? 1 : filters.Status[1].value ? 0 : "";
    let payload = {
      status: status,
      search: name,
      shipto_ids: "",
      external_id: "",
    };
    dispatch(getShipTo(payload));
  };

  //Validate Customer AddTO Ship

  const validateInput = () => {
    if (selectedCustomerId === "") {
      setIsEmpty(true);
      return true;
    } else {
      return false;
    }
  };
  //Handle OnChange Input AddTo Customer
  const handleOnChangeAddToCustomer = (e) => {
    setSelectedCustomerId(e.target.value);
    setIsEmpty(false);
  };
  //Handle Active or Deacitve Status
  const handleActiveOrDeacitveStatus = (action) => {
    let payload = {
      action: action,
      shipto_ids: selectionIds,
      customer_id: selectedCustomerId,
    };
    if (action === "active" || action === "de-active") {
      setDeleteLoading(true);
      setStatusType(action);
      handleStatusOrCustomer(payload)
        .then((resp) => {
          setDeleteLoading(false);
          setIsActive(false);
          setIsDeactive(false);
          setStatusAlert(true);
          setSelectedShipTo([]);
          setSelectionIds([]);
          getShipToListing();
        })
        .catch((error) => {
          console.log("Error", error?.response?.message);
        });
    }
    if (action === "add-customer") {
      if (!validateInput()) {
        setDeleteLoading(true);
        setStatusType(action);
        handleStatusOrCustomer(payload)
          .then((resp) => {
            setDeleteLoading(false);
            setIsAddCustomer(false);
            setStatusAlert(true);
            setSelectedShipTo([]);
            setSelectionIds([]);
            getShipToListing();
            setSelectedCustomerId("");
          })
          .catch((error) => {
            console.log("Error", error?.response?.message);
          });
      }
    }
  };

  //UseEffect For Get Listing
  useEffect(() => {
    if (name === "" || filters !== filters) {
      getShipToListing();
    }
  }, [dispatch, name, filters]);

  //UseEffect for Getting Active Customers
  useEffect(() => {
    dispatch(getUniCustomers());
  }, []);

  //UseEffect For Remove Error Message
  useEffect(() => {
    setTimeout(() => {
      setDeleteAlert(false);
      setStatusAlert(false);
    }, 2000);
  }, [deleteAlert, statusAlert]);
  return (
    <div className="main-container pl-4">
      {/* BreadCrums Start */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              {
                name: "Supply Chain",
                route: "/supply-chain/carriers",
                color: true,
              },
              { name: "Ship To" },
            ]}
          />
          <div className="text-[15px] font-bold">Ship To</div>
        </div>
        <div>
          <Button
            startIcon={<Add />}
            className="capitalize text-[13px] font-medium "
            onClick={() => navigate("/supply-chain/ship-to/add-shipto")}
            component="span"
            color="primary"
            variant="contained">
            Add New Ship To
          </Button>
        </div>
      </div>
      {/* BreadCrums End */}

      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          onSearch={() => onShipToSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            label={"Filter"}
            option1={filters.Status[0].value || filters.Status[1].value}>
            <OptionModal
              options={filters}
              width={"w-48"}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 10 ? true : false}
            label={"Edit Columns"}>
            <OptionModal
              options={editColumnData}
              leftLabel="Columns"
              rightLabel="Reset All"
              onChange={onChangeEditColumn}
              columnToShow={columnToShow}
            />
          </ModalButton>
        </div>
      </div>

      {/* Modal For Active ShipTo */}
      <CustomModal open={isActive} width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                <CheckCircleRoundedIcon
                  className="mx-3 mb-1"
                  color="success"
                  fontSize="small"
                />
              </div>
              Active ShipTo
            </div>
            <div
              className="pointer mx-3"
              onClick={() => {
                setIsActive(false);
                setDeleteLoading(false);
                setSelectionIds([]);
                setSelectedShipTo([]);
                getShipToListing();
              }}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="mt-3">
            <Typography
              className="d-flex flex-row align-items-center"
              variant="body1"
              fontSize={15}
              marginBottom={1}
              marginTop={3}
              marginLeft={3}
              fontWeight="light">
              Are you sure you want to Active following selected ShipTo?
            </Typography>
          </div>
          <div className="max-h-[120px] overflow-y-scroll">
            {selectedShipTo?.map((item, index) => {
              return (
                <div className="flex justify-start mx-4">
                  <div key={index} className="fw-bold">
                    {index + 1}: {item?.name}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-3">
            <Button
              className="capitalize mr-[10px]"
              component="span"
              variant="outlined"
              color="secondary"
              disabled={deleteLoading}
              onClick={() => {
                setIsActive(false);
                setDeleteLoading(false);
                setSelectionIds([]);
                setSelectedShipTo([]);
                getShipToListing();
              }}>
              Cancel
            </Button>
            <Button
              component="span"
              color="success"
              className="capitalize text-white"
              variant="contained"
              disabled={deleteLoading}
              loading={deleteLoading}
              onClick={() => handleActiveOrDeacitveStatus("active")}>
              Active ShipTo
            </Button>
          </div>
        </div>
      </CustomModal>

      {/* Modal For Deactive ShipTo */}
      <CustomModal open={isDeactive} width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                <TripOriginIcon
                  className="mx-3 mb-1"
                  color="danger"
                  fontSize="small"
                />
              </div>
              Deactive ShipTo
            </div>
            <div
              className="pointer mx-3"
              onClick={() => {
                setIsDeactive(false);
                setDeleteLoading(false);
                setSelectionIds([]);
                setSelectedShipTo([]);
                getShipToListing();
              }}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="mt-3">
            <Typography
              className="d-flex flex-row align-items-center"
              variant="body1"
              fontSize={15}
              marginBottom={1}
              marginTop={3}
              marginLeft={3}
              fontWeight="light">
              Are you sure you want to Deactive following selected ShipTo?
            </Typography>
          </div>
          <div className="max-h-[120px] overflow-y-scroll">
            {selectedShipTo?.map((item, index) => {
              return (
                <div className="flex justify-start mx-4">
                  <div key={index} className="fw-bold">
                    {index + 1}: {item?.name}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-3">
            <Button
              className="capitalize mr-[10px]"
              component="span"
              variant="outlined"
              color="secondary"
              disabled={deleteLoading}
              onClick={() => {
                setIsDeactive(false);
                setDeleteLoading(false);
                setSelectionIds([]);
                setSelectedShipTo([]);
                getShipToListing();
              }}>
              Cancel
            </Button>
            <Button
              component="span"
              color="danger"
              className="capitalize text-white"
              variant="contained"
              disabled={deleteLoading}
              loading={deleteLoading}
              onClick={() => handleActiveOrDeacitveStatus("de-active")}>
              Deactive ShipTo
            </Button>
          </div>
        </div>
      </CustomModal>

      {/* Modal For AddTo Customer */}
      <CustomModal open={isAddCustomer} width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                <Add className="mx-3 mb-1" color="primary" fontSize="small" />
              </div>
              Add To Customer
            </div>
            <div
              className="pointer mx-3"
              onClick={() => {
                setIsAddCustomer(false);
                setDeleteLoading(false);
                setSelectionIds([]);
                setSelectedShipTo([]);
                setSelectedCustomerId("");
                getShipToListing();
              }}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="mt-3">
            <Typography
              className="d-flex flex-row align-items-center"
              variant="body1"
              fontSize={15}
              marginBottom={1}
              marginTop={3}
              marginLeft={3}
              fontWeight="light">
              Are you sure you want to Add Customer following selected ShipTo?
            </Typography>
          </div>
          <div className="form-row mx-4 flex flex-col gap-[30px]">
            <div className="max-h-[120px] overflow-y-scroll">
              {selectedShipTo?.map((item, index) => {
                return (
                  <div className="flex justify-start">
                    <div key={index} className="fw-bold">
                      {index + 1}: {item?.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel
                  id="demo-simple-select-label"
                  className={`${
                    isEmpty ? "text-danger" : "unset"
                  } top-[-6px]`}>
                  Customer Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCustomerId}
                  label="Customer Name"
                  size="small"
                  name="customerName"
                  color={isEmpty ? "danger" : "primary"}
                  className="p-[2px]"
                  onChange={handleOnChangeAddToCustomer}
                  error={isEmpty ? "Customer Name is required" : ""}>
                  {customers?.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item?.uuid}>
                        {item?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText className="text-danger">
                  {isEmpty ? "Customer Name is required" : ""}
                </FormHelperText>
              </FormControl>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-3">
            <Button
              className="capitalize mr-[10px]"
              component="span"
              variant="outlined"
              color="secondary"
              disabled={deleteLoading}
              onClick={() => {
                setIsAddCustomer(false);
                setDeleteLoading(false);
                setSelectionIds([]);
                setSelectedShipTo([]);
                getShipToListing();
                setSelectedCustomerId("");
                setIsEmpty(false);
              }}>
              Cancel
            </Button>
            <Button
              component="span"
              color="primary"
              className="capitalize"
              variant="contained"
              disabled={deleteLoading}
              loading={deleteLoading}
              onClick={() => handleActiveOrDeacitveStatus("add-customer")}>
              Add Customer
            </Button>
          </div>
        </div>
      </CustomModal>

      {/* Carrier Delete Alert Start */}
      {deleteAlert && (
        <AlertMessage
          text="ShipTo successfully deleted"
          severity="error"
          textColor="red"
        />
      )}

      {/* Carrier Delete Alert Start */}
      {statusAlert && (
        <AlertMessage
          severity={
            statusType === "active"
              ? "success"
              : statusType === "de-active"
              ? "error"
              : statusType === "add-customer"
              ? "primary"
              : "error"
          }
          text={
            statusType === "active"
              ? "ShipTo Successfully Activated"
              : statusType === "de-active"
              ? "ShipTo Successfully Deactivated"
              : statusType === "add-customer"
              ? "Selected ShipTo Successfully Add Customer"
              : ""
          }
          textColor={
            statusType === "active"
              ? "success"
              : statusType === "de-active"
              ? "error"
              : statusType === "add-customer"
              ? "primary"
              : "primary"
          }
        />
      )}
      {/* Carrier Delete Alert End */}

      {loading ? (
        <Spinner />
      ) : (
        <ShipToTable
          shipTo={true}
          rows={shipTo}
          columns={columnToShow.length < 10 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          selectedShipTo={selectedShipTo}
          setSelectedShipTo={setSelectedShipTo}
          isActive={isActive}
          setIsActive={setIsActive}
          isDeactive={isDeactive}
          setIsDeactive={setIsDeactive}
          isAddCustomer={isAddCustomer}
          setIsAddCustomer={setIsAddCustomer}
        />
      )}
    </div>
  );
};
export default ShipTo;
