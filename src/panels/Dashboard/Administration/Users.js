/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
//Libaray Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import { Add } from "@mui/icons-material";
//Local Imports
import { Status } from "../../../helpers/TableUtilities";
import { SimpleDeleteModal } from "../../../helpers/SimpleDeleteModal";
import { UserName, Manage, Facility, UserRole, Email, ErrorModal } from "./utils";
import {
  ModalButton,
  BreadCrumb,
  SearchBar,
  Spinner,
  CustomModal,
  OptionModal,
  Table as UsersTable,
  Select as DropDown,
  Button as Lbutton,
  AlertMessage,
} from "../../../shared";
import * as Actions from "../../../redux/administration/actions";
import * as Selectors from "../../../redux/administration/selectors";
import {
  getAllRoles,
  deteleMultipleUsers,
} from "../../../api/administratorApi";
import {
  columnDataUserList as columnData,
  tableColumnExtensionsUsers as tableColumnExtensions,
} from "./mockUpData";
import "./administration.module.css";

const editColumnData = [
  { name: "role", title: "User Role" },
  { name: "email", title: "Email" },
  { name: "phone", title: "Contact Number" },
  { name: "facilities", title: "Facilities" },
  { name: "status", title: "Active" },
];
const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [columns] = useState(columnData);
  // Multiple Delete Users Modal States
  const [isMultiDelete, setIsMultiDelete] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const users = Selectors.GetUsers();
  const loading = Selectors.GetUsersLoading();
  // All Facilities State
  const allFacilities = Selectors.GetFacilties();

  const [ColumnSetting1] = useState(["full_name"]);
  const [ColumnSetting2] = useState(["status"]);
  const [ColumnSetting3] = useState(["manage"]);
  const [ColumnSetting4] = useState(["facilities"]);
  const [ColumnSetting5] = useState(["roles"]);
  const [ColumnSetting6] = useState(["email"]);
  const [selectionIds, setSelectionIds] = useState([]);
  const [isOpen, setIsopen] = useState(false);
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedUserFacilities, setSelectedUserFacilities] = useState([]);
  const [addUserAlert, setAddUserAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlertMsg, setErrorAlertMsg] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState("");

  useEffect(() => {
    if (deleteAlert || addUserAlert) {
      let status = filters.Status[0].value
        ? 1
        : filters.Status[1].value
        ? 0
        : "";
      let order = "";
      dispatch(Actions.getUsers(name, roleId, status, order));
      setTimeout(() => {
        setDeleteAlert(false);
        setAddUserAlert(false);
      }, 2000);
    }
  }, [addUserAlert, deleteAlert]);

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
  });
  // Edit Column States
  const [columnToShow, setColumnToShow] = useState(columnData);

  const dataProviders = [
    {
      columnName: ColumnSetting1,
      func: UserName,
    },
    {
      columnName: ColumnSetting2,
      func: (restProps) => Status(restProps?.row?.status, "Active", "Inactive"),
    },
    {
      columnName: ColumnSetting3,
      func: (restProps) =>
        Manage(
          restProps,
          setSelectionIds,
          setDeleteAlert,
          setAddUserAlert,
          setErrorAlert,
          setErrorAlertMsg
        ),
    },
    {
      columnName: ColumnSetting4,
      func: (restProps) => Facility(restProps, setAddUserAlert),
    },
    {
      columnName: ColumnSetting5,
      func: UserRole,
    },
    {
      columnName: ColumnSetting6,
      func: Email,
    },
  ];

  const handleChange = (selectedOption) => {
    let array = [];
    allFacilities?.map((item) => {
      selectedOption.map((option) => {
        if (item.uuid === option.value) {
          array.push(item);
        }
      });
    });
    setSelectedFacilities(array);
  };

  // Function to delete multiple users
  const handleMultiDelete = () => {
    setIsDeleteLoading(true);
    let status = filters.Status[0].value ? 1 : filters.Status[1].value ? 0 : "";
    let order = "";
    deteleMultipleUsers(selectionIds)
      .then((res) => {
        setIsMultiDelete(false);
        setDeleteAlert(true);
        dispatch(Actions.getUsers(name, roleId, status, order));
        setSelectionIds([]);
        setIsDeleteLoading(false);
        setTimeout(() => setDeleteAlert(false), 1200);
      })
      .catch((error) => {
        if (error?.response) {
          setIsDeleteLoading(false);
          setIsMultiDelete(false);
          setErrorAlert(true);
          setErrorAlertMsg(error?.response?.data?.message);
        }
      });
  };
  // Confirmation Modal To Delete Multiple Users
  const MultiDeleteCofirmation = () => {
    return (
      <SimpleDeleteModal
        states={{
          open: isMultiDelete,
          setOpen: setIsMultiDelete,
          errorMsg: errorAlertMsg,
          setErrorMsg: setErrorAlertMsg,
          headTitle: `Delete ${selectionIds.length === 1 ? "user" : "users"}`,
          deleteName: selectionIds.length === 1 ? "user" : "users",
          loading: isDeleteLoading,
          deleteMethod: () => handleMultiDelete(),
        }}
      />
    );
  };

  const getAllRolesPermissions = () => {
    getAllRoles().then((res) => {
      let roles = [];
      res?.data?.data?.roles?.map((role) => {
        if (role?.name !== "User") {
          roles.push({
            value: false,
            title: role?.name,
            uuid: role?.uuid,
          });
        }
      });
      let filter = filters;
      filter = { Role: roles, ...filter };
      setFilters(filter);
    })
    .catch((error) => {
      if(error?.response){
        setErrorModal(true);
        setErrorModalMsg(error?.response?.data?.message);
      } else {
        setErrorModal(true);
        setErrorModalMsg("Oops! Something went wrong.");
      }
    })
  };

  useEffect(() => {
    dispatch(Actions.getFacilities("", "", ""));
    getAllRolesPermissions();
  }, []);

  // on Search User
  const onUserSearch = () => {
    if (name !== "") {
      let status = filters.Status[0].value
        ? 1
        : filters.Status[1].value
        ? 0
        : "";
      let order = "";
      dispatch(Actions.getUsers(name, roleId, status, order));
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
      dispatch(Actions.getUsers(name, roleId, status, order));
    } else {
      setSelectionIds([]);
    }
  }, [name]);
  useEffect(() => {
    if (name || roleId || filters.Status || filters.Order) {
      let status = filters.Status[0].value
        ? 1
        : filters.Status[1].value
        ? 0
        : "";
      let order = "";
      dispatch(Actions.getUsers(name, roleId, status, order));
    }
  }, [filters.Status, filters.Order, roleId]);

  // Handle Filter OnChange
  const filterOnChange = (from, item, index) => {
    if (from === "clearAll") {
      setRoleId([]);
      setSelectionIds([]);
      setFilters(() => {
        let role = filters.Role.slice();
        let status = filters.Status.slice();

        role[0] = { title: role[0].title, value: false, uuid: role[0].uuid };
        role[1] = { title: role[1].title, value: false, uuid: role[1].uuid };
        role[2] = { title: role[2].title, value: false, uuid: role[2].uuid };

        status[0] = { title: status[0].title, value: false };
        status[1] = { title: status[1].title, value: false };

        const newObj = { Role: role, Status: status };
        return newObj;
      });
    } else if (item.title.includes("Active")) {
      setFilters(() => {
        let role = filters.Role.slice();
        let status = filters.Status.slice();

        if (index === 0) {
          status[index] = { title: item.title, value: !item.value };
          status[index + 1] = { title: status[index + 1].title, value: false };
        } else {
          status[index] = { title: item.title, value: !item.value };
          status[index - 1] = { title: status[index - 1].title, value: false };
        }
        const newObj = { Role: role, Status: status };
        return newObj;
      });
    } else if (
      item.title.includes("Company") ||
      item.title.includes("Admin") ||
      item.title.includes("User")
    ) {
      if (roleId.includes(item.uuid)) {
        let ids = [];
        roleId.map((id, index) => {
          if (id !== item.uuid) {
            ids.push(id);
          }
        });
        setRoleId(ids);
        setSelectionIds([]);
      } else {
        let ids = [...roleId, item.uuid];
        setRoleId(ids);
        setSelectionIds([]);
      }
      setFilters(() => {
        let role = filters.Role.slice();
        let status = filters.Status.slice();

        if (index === 0) {
          role[0] = {
            title: role[0].title,
            value: !item.value,
            uuid: item.uuid,
          };
          role[1] = {
            title: role[1].title,
            value: role[1].value,
            uuid: role[1].uuid,
          };
          role[2] = {
            title: role[2].title,
            value: role[2].value,
            uuid: role[2].uuid,
          };
        } else if (index === 1) {
          role[0] = {
            title: role[0].title,
            value: role[0].value,
            uuid: role[0].uuid,
          };
          role[1] = {
            title: role[1].title,
            value: !item.value,
            uuid: item.uuid,
          };
          role[2] = {
            title: role[2].title,
            value: role[2].value,
            uuid: role[2].uuid,
          };
        } else {
          role[0] = {
            title: role[0].title,
            value: role[0].value,
            uuid: role[0].uuid,
          };
          role[1] = {
            title: role[1].title,
            value: role[1].value,
            uuid: role[1].uuid,
          };
          role[2] = {
            title: role[2].title,
            value: !item.value,
            uuid: item.uuid,
          };
        }
        const newObj = { Role: role, Status: status };
        return newObj;
      });
    }
  };
  // Handle Edit Column
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

  //useEffect for Closing Error of Delete Message
  useEffect(() => {
    setTimeout(() => {
      setErrorAlert(false);
    }, 2000);
  }, [errorAlert]);

  return (
    <div className="main-container pl-4">
      <CustomModal
        open={isOpen}
        close={() => setIsopen(!isOpen)}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center mx-3 fw-bold">
              Add {selectionIds.length} users to Facility
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
              options={allFacilities?.map((fc) => ({
                value: fc.uuid,
                label: fc.name,
              }))}
            />
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Lbutton
                onClick={() => setIsopen(!isOpen)}
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary">
                Cancel
              </Lbutton>
              <Lbutton
                onClick={() => {
                  let payload = {
                    user_ids: selectionIds,
                    facility_ids: selectedFacilities.map((fc) => fc.uuid),
                    type: "multi",
                  };
                  dispatch(Actions.updateUserFacilities(payload));
                  dispatch(Actions.getUsers());
                  dispatch(Actions.getFacilities("", "", "", ""));
                  setIsopen(!isOpen);
                  setSelectionIds([]);
                  setAddUserAlert(true);
                }}
                component="span"
                color="primary"
                className="capitalize"
                variant="contained">
                Save
              </Lbutton>
            </div>
          </div>
        </div>
      </CustomModal>

      {isMultiDelete && <MultiDeleteCofirmation />}

      {/* Breadcrumbs */}
      <div className="d-flex flex-row justify-content-between align-items-center py-3">
        <div>
          <BreadCrumb
            routes={[
              {
                name: "Administration",
                route: "/administration/users",
                color: true,
              },
              { name: "Users" },
            ]}
          />
          <div className="text-[15px] font-bold">Users</div>
        </div>
        <Lbutton
          startIcon={<Add />}
          className="capitalize w-[160px]"
          onClick={() => navigate("/administration/add-user")}
          component="span"
          color="primary"
          variant="contained"
          disabled={loading}>
          Add New User
        </Lbutton>
      </div>

      {/* Search with Buttons */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={selectionIds.length > 0 ? true : false}
          onSearch={() => onUserSearch()}
          onClear={() => setName("")}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <div className="d-flex flex-row justify-between align-items-center">
          {/* Filters */}
          <ModalButton
            option1={filters.Status[0]?.value || filters.Status[1]?.value}
            // option2={filters.Order[0]?.value || filters.Order[1]?.value}
            option3={
              filters?.Role &&
              (filters?.Role[0]?.value ||
                filters?.Role[1]?.value ||
                filters?.Role[2]?.value)
            }
            label={"Filter"}>
            <OptionModal
              options={filters}
              setOptions={setFilters}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
              width="w-44"
            />
          </ModalButton>

          {/* Edit Columns */}
          <ModalButton
            option1={columnToShow.length < 8 ? true : false}
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
      <ErrorModal error={errorModal} setError={setErrorModal} errorMsg={errorModalMsg} setErrorMsg={setErrorModalMsg} />

      {deleteAlert && (
        <AlertMessage
          severity="error"
          text="User Successfully Deleted"
          textColor="red"
          iconColor="warning"
          onClick={() => setDeleteAlert(false)}
        />
      )}
      {errorAlert && (
        <AlertMessage
          severity="error"
          text={errorAlertMsg}
          textColor="red"
          iconColor="warning"
          onClick={() => setErrorAlert(false)}
        />
      )}

      {/* User Add Facility Alert */}
      {addUserAlert && (
        <AlertMessage
          severity="success"
          text="Users Facility List Updated"
          textColor="green"
          iconColor="success"
          onClick={() => setAddUserAlert(false)}
        />
      )}
      {loading ? (
        <Spinner />
      ) : (
        <UsersTable
          rows={users?.length ? users : []}
          columns={columnToShow.length < 8 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          setDeleteAlert={setDeleteAlert}
          isOpen={isOpen}
          setIsopen={setIsopen}
          selectedUserFacilities={selectedUserFacilities}
          setSelectedUserFacilities={setSelectedUserFacilities}
          setIsMultiDelete={setIsMultiDelete}
        />
      )}
    </div>
  );
};

export default Users;
