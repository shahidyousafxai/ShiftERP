/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Add } from "@mui/icons-material";
import {
  Button as Lbutton,
  SearchBar,
  Table as UsersTable,
  CustomModal,
} from "../../../../shared";
import DropDown from "../../../../shared/Select";
import { UserName, AddEditManageFacilities } from "../utils";
import "../administration.module.css";

const facilityColumnData = [
  { name: "id", title: "Sr#" },
  { name: "username", title: "User Name" },
  { name: "user_role", title: "User Role" },
  { name: "email", title: "Email" },
  { name: "contact_number", title: "Contact Number" },
  { name: "manage", title: "Manage" },
];
const tableColumnExtensions = [
  { columnName: "id", width: 100, sortingEnabled: true },
  { columnName: "username", width: 180, sortingEnabled: true },
  { columnName: "user_role", sortingEnabled: false },
  { columnName: "email", sortingEnabled: false },
  { columnName: "contact_number", sortingEnabled: false },
  { columnName: "manage", sortingEnabled: false },
];

const Users = ({
  facilityUsers,
  users,
  selectedUsers,
  setSelectedUsers,
  setSelectedUsersUUID,
  fromEdit,
}) => {
  const [columns] = useState(facilityColumnData);
  const [rows, setRows] = useState(
    fromEdit ? facilityUsers : selectedUsers ? selectedUsers : []
  );
  const [usersList, setUsersList] = useState(users);
  const [searchText, setSearchText] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  let addedUsers = [];

  const [ColumnSetting1] = useState(["username"]);
  const [ColumnSetting2] = useState(["manage"]);

  const [selectionIds, setSelectionIds] = useState([]);
  const [isOpen, setIsopen] = useState(false);

  // If User Already Has Facilities. For Removing Those Facilities From Listing
  useEffect(() => {
    removeFacilityFromList();
  }, []);
  const removeFacilityFromList = () => {
    let array = facilityUsers;
    let remainingArr = [];

    if (array?.length > 0) {
      // Removing Selected Facilities From Facilities Dropdown
      remainingArr = users.filter(
        ({ uuid: id1 }) => !array.some(({ uuid: id2 }) => id2 === id1)
      );
      // Setting States
      setUsersList(remainingArr);
    }
  };

  const dataProviders = [
    {
      columnName: ColumnSetting1,
      func: UserName,
    },
    {
      columnName: ColumnSetting2,
      func: (restProps) => AddEditManageFacilities(restProps, onDelete),
    },
  ];

  // onChange From SearchBar
  const onSearchChange = (event) => {
    setSearchText(event.target.value);
    if (!event.target.value) {
      setSearchedUsers([]);
    }
  };
  // onSearch Method
  const onSearch = () => {
    let tempArrayFacilities = [];

    tempArrayFacilities = rows.filter((item) =>
      item.username.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchedUsers([...tempArrayFacilities]);
  };
  // On Select Facilities From DropDown
  const handleChange = (selectedOption) => {
    addedUsers = selectedOption;
  };
  // onSave Facilities After Selection
  const onSave = () => {
    let array = facilityUsers;
    let currSelectedFacilities = [];
    let remainingArr = [];
    let UUID = [];
    // Assigning Selected Failities to Array By Making Them Unique
    if (addedUsers.length > 0) {
      users?.map((item) => {
        addedUsers.map((option) => {
          if (item.uuid === option.value) {
            let obj = {
              id: item.id,
              username: item.username,
              user_role: item.role,
              email: item.email,
              contact_number: item.phone,
              uuid: item.uuid,
            };
            currSelectedFacilities.push(obj);
          }
        });
      });
      array = [...array, ...currSelectedFacilities];
      array = [...new Set(array)];
      setSelectedUsers(array);
      array.map((item) => {
        UUID.push(item.uuid);
      });
      setSelectedUsersUUID(UUID);
    }

    // Setting States Before Saving
    if (array?.length > 0) {
      // Setting States
      setRows(
        [...array].map((item, index) => {
          let obj = {
            id: index + 1,
            username: item.username,
            user_role: item.user_role,
            email: item.email,
            contact_number: item.contact_number,
            uuid: item.uuid,
          };
          return obj;
        })
      );
      setIsopen(false);
      // Removing Selected Facilities From Facilities Dropdown
      remainingArr = users.filter(
        ({ uuid: id1 }) => !array.some(({ uuid: id2 }) => id2 === id1)
      );
      // Setting States
      setUsersList(remainingArr);
    }
  };
  // onRemove Facility From Listing
  const onDelete = (id) => {
    let array = selectedUsers;
    let remainingArr = [];
    let UUID = [];

    // Setting States Before Saving
    if (array?.length > 0) {
      // Findind Selected Facility To Remove from UUID
      let found = array.findIndex((el) => el.uuid === id);
      array.splice(found, 1);
      // Removing Selected Facilities From Facilities Dropdown
      remainingArr = users.filter(
        ({ uuid: id1 }) => !array.some(({ uuid: id2 }) => id2 === id1)
      );

      // Setting States
      setUsersList(remainingArr);

      // Setting States
      setRows(
        [...array].map((item, index) => {
          let obj = {
            id: index + 1,
            username: item.username,
            user_role: item.user_role,
            email: item.email,
            contact_number: item.contact_number,
            uuid: item.uuid,
          };
          return obj;
        })
      );
      setSelectedUsers(array);
      array.map((item) => {
        UUID.push(item.uuid);
      });
      setSelectedUsersUUID(UUID);
    }
  };

  return (
    <div className="mx-[20px] my-[20px] border rounded bg-white">
      <CustomModal
        open={isOpen}
        close={() => {
          setIsopen(false);
        }}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center mx-3 fw-bold">
              Add Users to facility
            </div>
            <div className="pointer mx-3">
              <ClearIcon
                color="secondary"
                fontSize="small"
                onClick={() => setIsopen(false)}
              />
            </div>
          </div>
          <div className="my-3">
            <DropDown
              className="mx-3"
              multiple={true}
              // value={selectedUsers}
              onChange={handleChange}
              options={usersList?.map((user) => ({
                value: user.uuid,
                label: user.full_name,
              }))}
            />
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Lbutton
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={() => setIsopen(false)}>
                Cancel
              </Lbutton>
              <Lbutton
                component="span"
                className="capitalize"
                color="primary"
                variant="contained"
                onClick={() => onSave()}>
                Save
              </Lbutton>
            </div>
          </div>
        </div>
      </CustomModal>
      <h6 className="px-3 pt-3 pb-1">Users</h6>
      <div className="d-flex flex-row justify-between align-items-center px-3 pb-3">
        <SearchBar
          onSearch={onSearch}
          onClear={() => {
            setSearchText("");
            setSearchedUsers([]);
          }}
          onChange={onSearchChange}
          value={searchText}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          <Lbutton
            startIcon={<Add />}
            className="mx-3 capitalize w-[150px]"
            component="span"
            color="primary"
            variant="outlined"
            onClick={() => setIsopen(!isOpen)}>
            Add Users
          </Lbutton>
        </div>
      </div>
      <div className="px-3 pb-3">
        <UsersTable
          rows={searchedUsers.length > 0 ? searchedUsers : rows}
          columns={columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          isOpen={isOpen}
          setIsopen={setIsopen}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
          facilities={true}
          pagination={true}
          multiSelection={true}
        />
      </div>
    </div>
  );
};

export default Users;
