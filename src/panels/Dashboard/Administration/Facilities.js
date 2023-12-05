/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
// Local Imports
import {
  SearchBar,
  BreadCrumb,
  CustomModal,
  Select as DropDown,
  Spinner as InsideSpinner,
  ModalButton,
  OptionModal,
  Table as FaciltiesTable,
  Button,
  AlertMessage,
} from "../../../shared";
import {
  CreatedAt,
  FacilityName,
  AdminManageFacility,
  PrimaryContact,
  ErrorModal,
} from "./utils";
import { Status } from "../../../helpers/TableUtilities";
import * as Actions from "../../../redux/administration/actions";
import * as Selectors from "../../../redux/administration/selectors";
import { addUsersInFacilities } from "../../../api/administratorApi";
import {
  facilitiesColumnData as facilityColumnData,
  tableColumnExtensionsFacilities as tableColumnExtensions,
} from "./mockUpData";
import "./administration.module.css";

// Column Names For Edit Column
const editColumnData = [
  { name: "created_at", title: "Date of Creation" },
  { name: "address", title: "Address" },
  { name: "city", title: "City" },
  { name: "state", title: "State" },
  { name: "zip_code", title: "Zip" },
  { name: "office_phone", title: "Office Phone" },
];

const Facilities = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /********** States Start **********/

  // Facility Table States
  const [columns] = useState(facilityColumnData);
  const allFacilities = Selectors.GetFacilties();
  const loading = Selectors.GetFaciltiesLoading();

  const [isOpen, setIsopen] = useState(false);
  const [selectionIds, setSelectionIds] = useState([]);
  // Data Provider States
  const [ColumnSetting1] = useState(["created_at"]);
  const [ColumnSetting2] = useState(["status"]);
  const [ColumnSetting3] = useState(["manage"]);
  const [ColumnSetting4] = useState(["primary_contact"]);
  const [ColumnSetting5] = useState(["name"]);

  // SeachBar State
  const [name, setName] = useState("");

  // Filters State
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
    // Order: [
    //   {
    //     title: "Ascending",
    //     value: false,
    //   },
    //   {
    //     title: "Descending",
    //     value: false,
    //   },
    // ],
  });

  // Edit Column States
  const [columnToShow, setColumnToShow] = useState(facilityColumnData);

  // Manage Button State
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [addUserAlert, setAddUserAlert] = useState(false);

  // Error Modal State
  const [errorModal, setErrorModal] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState("");
  // Muilti Select Add User To Facilities States
  const users = Selectors.GetUsers();
  const [selectedUsers, setSelectedUsers] = useState([]);

  /********** States End **********/

  /********** Methods Start **********/

  // UseEffect For Hiding Info Messages
  useEffect(() => {
    if (deleteAlert || addUserAlert) {
      setTimeout(() => {
        setDeleteAlert(false);
        setAddUserAlert(false);
      }, 2000);
    }
  }, [deleteAlert, addUserAlert]);

  // Data Provider For Table
  const dataProviders = [
    {
      columnName: ColumnSetting1,
      func: CreatedAt,
    },
    {
      columnName: ColumnSetting2,
      func: (restProps) => Status(restProps?.row?.status, "Active", "Inactive"),
    },
    {
      columnName: ColumnSetting3,
      func: (restProps) =>
        AdminManageFacility(
          restProps,
          setSelectionIds,
          setDeleteAlert,
          setAddUserAlert
        ),
    },
    {
      columnName: ColumnSetting4,
      func: PrimaryContact,
    },
    {
      columnName: ColumnSetting5,
      func: FacilityName,
    },
  ];

  // on Search User
  const onFacilitySearch = () => {
    if (name !== "") {
      let status = filters.Status[0].value
        ? 1
        : filters.Status[1].value
        ? 0
        : "";
      let order = "";
      dispatch(Actions.getFacilities(name, status, order));
    }
  };
  // These UseEffects Run While Searching
  useEffect(() => {
    if (name === "") {
      let status = filters.Status[0].value
        ? 1
        : filters.Status[1].value
        ? 0
        : "";
      let order = "";
      dispatch(Actions.getFacilities(name, status, order));
    } else {
      setSelectionIds([]);
    }
  }, [name]);
  // Filters UseEffect
  useEffect(() => {
    if (filters.Status || filters.Order) {
      let status = filters.Status[0].value
        ? 1
        : filters.Status[1].value
        ? 0
        : "";
      let order = "";
      dispatch(Actions.getFacilities(name, status, order));
    }
  }, [filters.Status, filters.Order]);

  // MultiSelect Facilities onChange
  const handleChange = (selectedOption) => {
    let array = [];
    users?.map((item) => {
      selectedOption.map((option) => {
        if (item.uuid === option.value) {
          array.push(item);
        }
      });
    });
    setSelectedUsers(array);
  };

  /********** Methods End **********/

  // Handle OnChange Setting
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setFilters(() => {
        let status = filters.Status.slice();
        // let order = filters.Order.slice();

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };

        // order[0] = { title: order[0].title, value: false };
        // order[1] = { title: order[1].title, value: false };

        const newObj = { Status: status };
        return newObj;
      });
    } else if (item.title.includes("Active")) {
      setFilters(() => {
        let status = filters.Status.slice();
        // let order = filters.Order.slice();

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
    // else {
    //   setFilters(() => {
    //     let status = filters.Status.slice();
    //     let order = filters.Order.slice();

    //     if (index === 0) {
    //       order[index] = { title: item.title, value: !item.value };
    //       order[index + 1] = { title: order[index + 1].title, value: false };
    //     } else {
    //       order[index] = { title: item.title, value: !item.value };
    //       order[index - 1] = { title: order[index - 1].title, value: false };
    //     }

    //     const newObj = { Status: status,  };
    //     return newObj;
    //   });
    // }
  };

  // Handle OnChange Edit Columns
  const onChangeEditColumn = (item) => {
    if (item === "clearAll") {
      setColumnToShow(facilityColumnData);
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
  return (
    <div className="main-container  pl-4">
      {/* Multi Select Add Users To Facilities */}
      <CustomModal
        open={isOpen}
        close={() => setIsopen(!isOpen)}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center mx-3 fw-bold">
              Add users to {selectionIds.length} Facilities
            </div>
            <div className="pointer mx-3" onClick={() => setIsopen(!isOpen)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="my-3">
            <DropDown
              className="mx-3"
              multiple={true}
              onChange={handleChange}
              options={users.map((user) => ({
                value: user.uuid,
                label: `${user.fname} ${user.lname}`,
              }))}
            />
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Button
                onClick={() => setIsopen(!isOpen)}
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  let payload = {
                    user_ids: selectedUsers.map((fc) => fc.uuid),
                    facility_ids: selectionIds,
                    type: "multi",
                  };
                  addUsersInFacilities(payload).then((res) => {
                    dispatch(Actions.getFacilities("", "", ""));
                    setAddUserAlert(true);
                    setIsopen(!isOpen);
                    setSelectionIds([]);
                  })
                  .catch((error) => {
                    if (error?.response) {
                      setErrorModal(true);
                      setErrorModalMsg(error?.response?.data?.message);
                    } else {
                      setErrorModal(true);
                      setErrorModalMsg("Oops! Something went wrong");
                    }
                  });
                }}
                className="capitalize"
                component="span"
                color="primary"
                variant="contained">
                Save
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Header Row with BreadCrumbb And Add Button */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              {
                name: "Administration",
                route: "/administration/users",
                color: true,
              },
              { name: "Facilities" },
            ]}
          />
          <h6>Facilities</h6>
        </div>
        <Button
          startIcon={<Add />}
          onClick={() => navigate("/administration/add-facility")}
          className="capitalize"
          component="span"
          color="primary"
          variant="contained"
          disabled={loading}>
          Add New Facility
        </Button>
      </div>

      {/* Search Bar Row With Buttons */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={selectionIds.length > 0 ? true : false}
          onSearch={() => onFacilitySearch()}
          onClear={() => setName("")}
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
            option1={columnToShow.length < 11 ? true : false}
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

      {/* Error Modal */}
      <ErrorModal
        error={errorModal}
        setError={setErrorModal}
        errorMsg={errorModalMsg}
        setErrorMsg={setErrorModalMsg}
      />

      {/* Facility Delete Alert */}
      {deleteAlert && (
        <AlertMessage
          severity="error"
          text="Facility successfully deleted"
          textColor="red"
        />
      )}
      {/* Facility Add User Alert */}
      {addUserAlert && (
        <AlertMessage
          severity="success"
          text="Facility users list updated"
          textColor="green"
        />
      )}
      {/* Facilities Listing Table */}
      {loading ? (
        <InsideSpinner />
      ) : (
        <FaciltiesTable
          rows={allFacilities?.length > 0 ? allFacilities : []}
          columns={columnToShow.length < 11 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          isOpen={isOpen}
          setIsopen={setIsopen}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          facilities={true}
        />
      )}
    </div>
  );
};

export default Facilities;
