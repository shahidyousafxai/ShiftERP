/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-self-compare */
// Library Imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";

// Local imports
import {
  SearchBar,
  Button,
  BreadCrumb,
  Spinner,
  Table as CustomersTable,
  ModalButton,
  OptionModal,
  AlertMessage,
} from "../../../shared";
import {
  ManageCustomer,
  Facilities,
  CustomerUsers,
  ImportCustomerModal,
  customerFields,
} from "./Components/utils";
import { Status, Name } from "../../../helpers/TableUtilities"
import * as Actions from "../../../redux/customer/actions";
import * as Selectors from "../../../redux/customer/selectors";
import {
  columnData,
  tableColumnExtensions,
  editColumnData,
} from "./mockUpData/mockupData";
import "rsuite/dist/rsuite.min.css";
import "./Styles/customer.css";

const Customers = () => {
  const user = useSelector((state) => state.user);
  const facilityUser = user?.currentUser?.role === "facility_user";
  const companyAdmin = user?.currentUser?.role === "company_admin";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = Selectors.GetCustomersLoading();
  const [columns] = useState(columnData);
  const customers = Selectors.GetFacilities();

  const [ColumnSetting1] = useState(["status"]);
  const [ColumnSetting2] = useState(["manage"]);
  const [ColumnSetting3] = useState(["primaryContact"]);
  const [ColumnSetting4] = useState(["email"]);
  const [ColumnSetting5] = useState(["contactNumber"]);
  const [ColumnSetting6] = useState(["name"]);
  const [ColumnSetting7] = useState(["facilities"]);
  const [ColumnSetting8] = useState(["customerUsers"]);
  const [isImportCustomerOpen, setIsImportCustomerOpen] = useState(false);
  const onRowSelect = (selectedCustomer) => {
    navigate("/customers/edit-customer/{$id}", {
      state: { user: selectedCustomer, from: "editCustomer" },
    });
  };

  const [selectionIds, setSelectionIds] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [name, setName] = useState("");
  const [filters, setFilters] = useState({
    Status: [
      {
        title: "Active",
        value: false,
      },
      {
        title: "InActive",
        value: false,
      },
    ],
  });
  const [columnToShow, setColumnToShow] = useState(columnData);

  useEffect(() => {
    if (name === "" || filters !== filters) {
      getFacilitiesList();
      setSelectionIds([]);
    }
  }, [name, filters]);

  // UseEffect For Hiding Info Messages
  useEffect(() => {
    if (deleteAlert) {
      setTimeout(() => {
        setDeleteAlert(false);
      }, 2000);
    }
  }, [deleteAlert]);

  const onUserSearch = () => {
    if (name !== "") {
      getFacilitiesList();
    }
  };

  const getFacilitiesList = () => {
    let payload = {
      search: name,
      status: filters.Status[0].value ? 1 : filters.Status[1].value ? 0 : "",
      order: "",
    };
    dispatch(Actions.getCustomers(payload));
  };

  const dataProviders = [
    {
      columnName: ColumnSetting1,
      func: (restProps) => Status(restProps?.row?.status, "Active", "Inactive"),
    },
    {
      columnName: ColumnSetting2,
      func: (restProps) =>
        ManageCustomer(
          restProps,
          setDeleteAlert,
          setSelectionIds,
          facilityUser,
          companyAdmin
        ),
    },
    {
      columnName: ColumnSetting3,
      func: (restProps) => customerFields(restProps.row.primary_contacts.name),
    },
    {
      columnName: ColumnSetting4,
      func: (restProps) => customerFields(restProps.row.primary_contacts.email),
    },
    {
      columnName: ColumnSetting5,
      func: (restProps) => customerFields(restProps.row.primary_contacts.phone),
    },
    {
      columnName: ColumnSetting6,
      // Please pass an empty string if no any of the argument is missing
      func: (restProps) => Name(restProps.row.name, "", ""),
    },
    {
      columnName: ColumnSetting7,
      func: Facilities,
    },
    {
      columnName: ColumnSetting8,
      func: CustomerUsers,
    },
  ];

  // Handle OnChange Edit Columns
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
        toShow = [...columnToShow, item];
      }

      setColumnToShow(toShow);
    }
  };

  // Handle OnChange Setting
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let status = filters.Status.slice();

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };

        const newObj = { Status: status };

        return newObj;
      });
    } else if (item.title?.includes("Active")) {
      setFilters(() => {
        let status = filters.Status.slice();

        if (index === 0) {
          status[index] = { title: item.title, value: !item.value };
          status[index + 1] = { title: status[index + 1].title, value: false };
        } else {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = { title: status[index - 1].title, value: false };
        }

        const newObj = { Status: status };
        return newObj;
      });
    }
  };
  return (
    <div className="main-container pl-4">
      {/* BreaddCrumbs & Add Customer Button */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              { name: "ShiftERP", route: "/dashboard", color: true },
              { name: "Customers", route: "/customers" },
            ]}
          />
          <div className="text-[15px] font-bold">Customers</div>
        </div>

        {!facilityUser && (
          <div className="">
            <Button
              startIcon={<GetAppRoundedIcon />}
              className="capitalize mr-[10px] text-[13px]"
              onClick={() => setIsImportCustomerOpen(!isImportCustomerOpen)}
              component="span"
              color="primary"
              variant="outlined">
              Import Customer
            </Button>

            <Button
              startIcon={<Add />}
              className="capitalize mr-[10px] text-[13px]"
              onClick={() =>
                navigate("/customers/add", {
                  state: { from: "addCustomer" },
                })
              }
              component="span"
              color="primary"
              variant="contained"
              disabled={loading}>
              Add New Customer
            </Button>
          </div>
        )}
      </div>

      {/* Search Bar with Buttons */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={
            selectionIds.length > 0
              ? true
              : filters.Status[0].value || filters.Status[1].value
              ? true
              : false
          }
          onClear={() => setName("")}
          onSearch={() => onUserSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            option1={filters.Status[0].value || filters.Status[1].value}
            label={"Filter"}>
            <OptionModal
              options={filters}
              setOptions={setFilters}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 12 ? true : false}
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

      {/* Facility Delete Alert */}
      {deleteAlert && (
        <AlertMessage
          severity="error"
          text="Customer successfully deleted"
          textColor="red"
        />
      )}

      {/* Import Data Modal */}
      <ImportCustomerModal
        isImportCustomerOpen={isImportCustomerOpen}
        setIsImportCustomerOpen={setIsImportCustomerOpen}
      />

      {loading ? (
        <Spinner />
      ) : (
        <CustomersTable
          customer={true}
          rows={customers?.length ? customers : []}
          columns={columnToShow.length < 12 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          onRowSelect={!facilityUser && onRowSelect}
        />
      )}
    </div>
  );
};

export default Customers;
