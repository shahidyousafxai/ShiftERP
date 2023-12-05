/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector, useDispatch } from "react-redux";
import Popper from "@mui/material/Popper";
import { Typography, Alert, ClickAwayListener } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Cancel } from "@mui/icons-material";


import "../../Administration/administration.module.css";
import { Button, SearchBar, Table, CustomModal, Dropdown, Spinner } from "../../../../shared";
import {
  PrimaryContact,
  ManageFacilities,
  FacilityName,
} from "../../Administration/utils";
import { Status } from "../../../../helpers/TableUtilities";
import { facilityColumnData } from "../../Administration/mockUpData";
import * as Actions from "../../../../redux/administration/actions";
import * as Selectors from "../../../../redux/administration/selectors";

const tableColumnExtensions = [
  { columnName: "id", width: 90, sortingEnabled: true },
  { columnName: "name", width: 200, sortingEnabled: true },
  { columnName: "address", width: 350, sortingEnabled: false },
  { columnName: "city", width: 120, sortingEnabled: false },
  { columnName: "state", width: 120, sortingEnabled: false },
  { columnName: "zip", width: 100, sortingEnabled: false },
  { columnName: "phone", width: 190, sortingEnabled: false },
  { columnName: "office_phone", width: 150, sortingEnabled: false },
  { columnName: "status", width: 130, sortingEnabled: false },
  { columnName: "manage", sortingEnabled: false },
];

const Facility = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [columns] = useState(facilityColumnData);

  const loading = Selectors.GetFaciltiesLoading();
  const selectorAllFacilities = Selectors.GetLoginUserFacilities();

  const [allFacilities] = useState(
    selectorAllFacilities.map((item, index) => {
      return (item = { ...item, id: index + 1 });
    })
  );

  const users = Selectors.GetUsers();
  const { uuid } = useSelector((state) => state.user.userInfo);

  const [ColumnSetting1] = useState(["name"]);
  const [ColumnSetting2] = useState(["phone"]);
  const [ColumnSetting3] = useState(["manage"]);
  const [ColumnSetting4] = useState(["status"]);
  const [selectionIds, setSelectionIds] = useState([]);
  const [isOpen, setIsopen] = useState(false);
  const [name, setName] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [primaryContactNames, setPrimaryContactNames] = useState([]);
  const [primaryContacts, setPrimaryContacts] = useState([]);
  const [status, setStatus] = useState();
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [order, setOrder] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [userFacilities, setUserFacilities] = useState([]);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const dataProviders = [
    {
      columnName: ColumnSetting1,
      func: FacilityName,
    },
    {
      columnName: ColumnSetting2,
      func: PrimaryContact,
    },
    {
      columnName: ColumnSetting3,
      func: (restProps) =>
        ManageFacilities(restProps, setIsopen, isOpen, setSelectionIds),
    },
    {
      columnName: ColumnSetting4,
      func: (restProps) => Status(restProps?.row?.status, "Active", "Inactive"),
    },
  ];

  const handleChange = (selectedOption) => {
    let array = [];
    users?.map((item) => {
      selectedOption.map((option) => {
        if (item.uuid === option.value) {
          array.push(item);
        }
      });
    });
    setSelectedFacilities(array);
  };

  //Filter State

  const [filters] = useState({
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
    Order: [
      {
        title: "Ascending",
        value: false,
      },
      {
        title: "Descending",
        value: false,
      },
    ],
  });
  //Filter On Change

  // const filterOnChange = (from, item, index) => {
  //   if (from === "clearAll") {
  //     setFilters(() => {
  //       let status = filters.Status.slice();
  //       let order = filters.Order.slice();

  //       status[0] = { title: status[0].title, value: false };
  //       status[1] = { title: status[1].title, value: false };

  //       order[0] = { title: order[0].title, value: false };
  //       order[1] = { title: order[1].title, value: false };

  //       const newObject = { Status: status, Order: order };

  //       return newObject;
  //     });
  //   } else if (item.title.includes("Active")) {
  //     setFilters(() => {
  //       let status = filters.Status.slice();
  //       let order = filters.Order.slice();

  //       if (index === 0) {
  //         status[index] = { title: item.title, value: !item.value };
  //         status[index + 1] = { title: status[index + 1].title, value: false };
  //       } else {
  //         status[index] = { title: item.title, value: !item.value };
  //         status[index - 1] = { title: status[index - 1].title, value: false };
  //       }

  //       const newObject = { Status: status, Order: order };

  //       return newObject;
  //     });
  //   } else {
  //     setFilters(() => {
  //       let status = filters.Status.slice();
  //       let order = filters.Order.slice();

  //       if (index === 0) {
  //         order[index] = { title: item.title, value: !item.value };
  //         order[index + 1] = { title: order[index + 1].title, value: false };
  //       } else {
  //         order[index] = { title: item.title, value: !item.value };
  //         order[index - 1] = { title: order[index - 1].title, value: false };
  //       }

  //       const newObject = { Status: status, Order: order };

  //       return newObject;
  //     });
  //   }
  // };

  const clickAwayHandler = () => {
    setAnchorEl(false);
  };
  const MyPopper = () => (
    <ClickAwayListener onClickAway={clickAwayHandler}>
      <Popper
        className="bg-white rounded border border-secondaryColor"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}>
        <div>
          <div className="my-3">
            <div className="mx-3">
              <label>Status:</label>
              <div>
                <Checkbox
                  onChange={(e) => {
                    if (status === "1") {
                      setStatus("");
                    } else {
                      setStatus("1");
                    }
                  }}
                  checked={status === "1" ? true : false}
                  size="small"
                />
                Active
              </div>
              <div>
                <Checkbox
                  onChange={(e) => {
                    if (status === "0") {
                      setStatus("");
                    } else {
                      setStatus("0");
                    }
                  }}
                  checked={status === "0" ? true : false}
                  size="small"
                />
                Inactive
              </div>
            </div>
            <div className="mx-3">
              <label>Order:</label>
              <div>
                <Checkbox
                  onChange={(e) => {
                    if (order === "asc") {
                      setOrder("");
                    } else {
                      setOrder("asc");
                    }
                  }}
                  checked={order === "asc" ? true : false}
                  size="small"
                />
                Ascending
              </div>
              <div>
                <Checkbox
                  onChange={(e) => {
                    if (order === "desc") {
                      setOrder("");
                    } else {
                      setOrder("desc");
                    }
                  }}
                  checked={order === "desc" ? true : false}
                  size="small"
                />
                Descending
              </div>
            </div>
          </div>
        </div>
      </Popper>
    </ClickAwayListener>
  );

  useEffect(() => {
    if (!state?.tab) {
      dispatch(Actions.getLoginUserFacilities(uuid));
    }
  }, []);

  useEffect(() => {
    setUserFacilities(allFacilities);
  }, [allFacilities]);

  useEffect(() => {
    if (Array.isArray(allFacilities) && allFacilities.length) {
      let array = [];
      allFacilities.map((facility) => {
        if (facility?.primary_contact?.name) {
          array.push(facility.primary_contact?.name);
        }
      });
      setPrimaryContactNames(array);
    }
  }, []);

  // These UseEffects Run While Searching
  useEffect(() => {
    if (name) {
      let newArray = allFacilities.filter((facility) => {
        return (
          facility?.name?.toLowerCase().includes(name.toLowerCase()) ||
          facility?.primary_contact?.name
            ?.toLowerCase()
            .includes(name.toLowerCase())
        );
      });
      setUserFacilities(newArray);
    } else {
      setUserFacilities(allFacilities);
    }
  }, [name]);

  // useEffect(() => {
  //   let newArray = allFacilities
  //   if (status) {
  //     newArray = allFacilities.filter(
  //       (facility) => {
  //         return (facility?.status?.toString() == status)
  //       })
  //     setUserFacilities(newArray)
  //   }
  //   else {
  //     setUserFacilities(allFacilities)
  //   }
  //   if (order == "desc") {
  //     let reversedArray = []
  //     for (var i = newArray.length - 1; i >= 0; i--) {
  //       reversedArray.push(newArray[i]);
  //     }
  //     setUserFacilities(reversedArray)
  //   }
  // }, [status, order]);

  //UseEffect For FiltersUpdating

  useEffect(() => {
    let newArray = allFacilities;
    if (filters.Status || filters.Order) {
      let status = filters.Status[0].value
        ? 1
        : filters.Status[1].value
        ? 0
        : "";
      let order = filters.Order[0].value
        ? "asc"
        : filters.Order[1].value
        ? "desc"
        : "";
      //dispatch action for apply fiters

      if (status) {
        newArray = allFacilities.filter((facility) => {
          return facility?.status?.toString() === status;
        });
        console.log("newarray", newArray);
        setUserFacilities(newArray);
      } else {
        setUserFacilities(allFacilities);
      }

      if (order === "desc") {
        let reversedArray = [];
        for (var i = newArray.length - 1; i >= 0; i--) {
          reversedArray.push(newArray[i]);
        }
        setUserFacilities(reversedArray);
        console.log("reversed array", reversedArray);
      } else {
        setUserFacilities(allFacilities);
      }
    }
  }, [filters.Status, filters.Order]);
  return (
    <div className="mx-3 mt-3 border rounded bg-white">
      <CustomModal
        open={isOpen}
        close={() => setIsopen(!isOpen)}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center mx-3 fw-bold">
              Add {selectionIds.length} facilties to users.
            </div>
            <div className="pointer mx-3" onClick={() => setIsopen(!isOpen)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="my-3">
            <Dropdown
              className="mx-3"
              multiple={true}
              onChange={handleChange}
              options={users.map((fc) => ({
                value: fc.uuid,
                label: fc.fname,
              }))}
            />
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Button
                onClick={() => setIsopen(!isOpen)}
                className="mr-2.5"
                component="span"
                variant="outlined"
                color="secondary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  let payload = {
                    facility_ids: selectionIds,
                    user_ids: selectedFacilities.map((fc) => fc.uuid),
                    type: "multi",
                  };
                  dispatch(Actions.updateUserFacilities(payload));
                  setIsopen(!isOpen);
                  setSelectionIds([]);
                }}
                component="span"
                color="primary"
                variant="contained">
                Save
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>
      {anchorEl && <MyPopper />}
      <div className="d-flex flex-row justify-content-between align-items-center p-3">
        <h6>Facilities</h6>
      </div>
      <div className="d-flex flex-row justify-between align-items-center px-3 pb-3">
        <SearchBar
          onChange={(e) => setName(e.target.value)}
          onClear={() => setName("")}
          value={name}
        />
        <div className="d-flex flex-row justify-between align-items-center">
          {/* <Button
            className="ml-3"
            startIcon={<FilterAltIcon />}
            component="span"
            variant="outlined"
            color={name || primaryContacts.length || status || order ? "primary" : "secondary"}
            onClick={handleClick}
            style={{ width: "110px", textTransform: "none" }}
          >
            Filter
          </Button> */}
          {/* <ModalButton
            option1={filters.Status[0].value || filters.Status[1].value}
            option2={filters.Order[0].value || filters.Order[1].value}
            label="Filter">
            <OptionModal
              options={filters}
              setOptions={setFilters}
              leftLabel="Filters"
              rightLabel="Clear All"
              onChange={filterOnChange}
            />
          </ModalButton> */}
        </div>
      </div>
      {(name || primaryContacts.length || status || order) && (
        <div className="d-flex flex-row justify-end align-items-center px-3 pb-3">
          <Button
            className="w-[110px] normal-case"
            component="span"
            variant="outlined"
            color="primary"
            onClick={() => {
              setOrder("");
              setStatus("");
              setPrimaryContacts([]);
              setName("");
              setAnchorEl(null);
              // dispatch(Actions.getLoginUserSearchedFacilities("", "", "", "", ""))
            }}>
            Reset Filter
          </Button>
        </div>
      )}
      {deleteAlert && (
        <div className="d-flex flex-row justify-end align-items-center">
          <Alert className="mx-3 w-72 justify-end" severity="error" icon={true}>
            <div className="d-flex flex-row justify-between align-items-center">
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"red"}>
                User successfully deleted
              </Typography>
              <div
                onClick={() => setDeleteAlert(false)}
                className="ms-5 pointer">
                <Cancel color="warning" />
              </div>
            </div>
          </Alert>
        </div>
      )}
      <div className="px-3 pb-3">
        {loading ? (
          <Spinner />
        ) : (
            <Table
            facilities={true}
            pagination={true}
            rows={userFacilities?.length ? userFacilities : []}
            columns={columns}
            tableColumnExtensions={tableColumnExtensions}
            dataProviders={dataProviders}
            selectionIds={selectionIds}
            setSelectionIds={setSelectionIds}
            isOpen={isOpen}
            setIsopen={setIsopen}
            multiSelection={true}
            personalInfo={true}
          />
        )}
      </div>
    </div>
  );
};

export default Facility;
