/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Add } from "@mui/icons-material";
import CreateIcon from "@mui/icons-material/Create";

import {
  Button,
  BreadCrumb,
  Table,
  SearchBar,
  MaterialDropdown,
  Spinner,
  CustomModal,
  Select,
} from "../../../../shared";
import { columnData, rowData } from "./DummyData/dummyData";
import {
  ManageNeedsReport,
  VisibilityShow,
} from "./Components/utils";
import { Alert, Typography } from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import {
  GetUniUsersLoading,
  GetUniversalUsersList,
} from "../../../../redux/universalModalData/selector";
import { getUniUsers } from "../../../../redux/universalModalData/action";
import { getUniFacility } from "../../../../redux/universalModalDataFacility/action";
import { GetUniversalFacilityList } from "../../../../redux/universalModalDataFacility/selector";
import { Name } from "../../../../helpers/TableUtilities";

const NeedsReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // NeedsReport Listing And Loading
  const loading = GetUniUsersLoading();
  const users = GetUniversalUsersList();
  const facility = GetUniversalFacilityList();

  //All the States
  const [columns] = useState(columnData);
  const [columnToShow] = useState(columnData);
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [selectionIds, setSelectionIds] = useState([]);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const [columnSetting1] = useState(["visibility"]);
  const [columnSetting2] = useState(["manage"]);
  const [columnSetting3] = useState(["title"]);
  const dependenciesArray = [
    { name: "Facilities", uuid: "1123456789" },
    { name: "Users", uuid: "9087654321" },
    { name: "Only me", uuid: "69876512345" },
    { name: "Everyone", uuid: "41234598765" },
  ];
  const [visibilityData, setVisibilityData] = useState({
    visibleName: "",
    visibileVal: "",
    users: [],
    facility: [],
  });
  // // States

  const tableColumnExtensions = [
    { columnName: "title", width: 350 },
    { columnName: "description", width: 350 },
    { columnName: "owner", width: 250 },
    { columnName: "lastViewed", width: 300, sortingEnabled: false },
    { columnName: "visibility", width: 260, sortingEnabled: false },
    { columnName: "manage", width: 120, sortingEnabled: false },
  ];

  //Data Providers
  const dataProviders = [
    {
      columnName: columnSetting1,
      func: (restProps) =>
        VisibilityShow(
          restProps,
          setIsVisible,
          isVisible,
          setVisibilityData,
          visibilityData
        ),
    },
    { 
      columnName: columnSetting3, 
      // Please pass an empty string if no any of the argument is missing
      func: (restProps) => Name(restProps.row.title, "", "") },
    {
      columnName: columnSetting2,
      func: (restProps) =>
        ManageNeedsReport(restProps, setDeleteAlert, setSelectionIds),
    },
  ];

  //On Search Bar
  const onNeedsReportSearch = () => {};

  const handleSave = () => {
    setIsVisible(!isVisible);
    setVisibilityData({});
  };

  const handleOnChangeVisibility = (e) => {
    // setDependenciesArray([e.target.value]);
    if (e.target.name === "visibileVal") {
      let name = "";
      dependenciesArray?.filter((item) => {
        if (item.uuid === e.target.value) {
          name = item.name;
          return (name = item.name);
        }
      });

      setVisibilityData({
        ...visibilityData,
        visibleName: name,
        [e.target.name]: e.target.value,
      });
    } else {
      setVisibilityData({
        ...visibilityData,
        [e.target.name]: e.target.value,
      });
    }
  };

  //value multiselect in Visibility modal
  const handleUserMultiOnChange = (selectedOption) => {
    let array = [];
    users?.map((item) => {
      selectedOption.map((option) => {
        if (item.uuid === option.value) {
          array.push(item);
        }
      });
    });
    setVisibilityData({ ...visibilityData, users: array });
  };

  const handleFacilityMultiOnChange = (selectedOption) => {
    let array = [];
    facility?.map((item) => {
      selectedOption.map((option) => {
        if (item.uuid === option.value) {
          array.push(item);
        }
      });
    });
    setVisibilityData({ ...visibilityData, facility: array });
  };
  useEffect(() => {
    let payloadFacility = {
      module_name: "facility",
      fields: ["uuid", "name"],
    };
    let payloadUser = {
      module_name: "user",
      fields: ["uuid", "fname", "lname"],
    };
    dispatch(getUniFacility(payloadFacility));
    dispatch(getUniUsers(payloadUser));
  }, []);

  //useEffect for Removing Delete Alert
  useEffect(() => {
    setTimeout(() => {
      setDeleteAlert(false);
    }, 2000);
  }, [deleteAlert]);

  //handle Cancel
  const handleCancel = () => {
    setIsVisible(!isVisible);
    setVisibilityData({});
  };

  console.log("visiblity data", visibilityData);

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
              { name: "Needs Report" },
            ]}
          />
          <div className="text-[15px] font-bold">Needs Report</div>
        </div>
        <div>
          <Button
            startIcon={<Add />}
            className="normal-case text-[13px] font-medium ml-2.5"
            onClick={() => navigate("/supply-chain/needs/add-needs")}
            component="span"
            color="primary"
            variant="contained">
            New Needs Report
          </Button>
        </div>
      </div>
      {/* BreadCrums End */}

      {/* Search Bar Start */}
      <div className="d-flex flex-row justify-between align-items-center mt-2 mb-2">
        <SearchBar
          disabled={false}
          onClear={() => setName("")}
          onSearch={() => onNeedsReportSearch()}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      {/* Visibility Modal */}
      <CustomModal
        open={isVisible}
        close={() => setIsVisible(!isVisible)}
        width={window.innerWidth * 0.35}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="pl-5 gap-2 d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer">
                <CreateIcon
                  className="w-3.5 h-3.5 text-center text-xs text-primaryColor"
                />
              </div>
              Visibility
            </div>
            <div
              className="pointer mx-3"
              onClick={() => setIsVisible(!isVisible)}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="my-3">
            <div className="form-row mb-3">
              <div className="mx-4">
                <MaterialDropdown
                  multiple={false}
                  options={dependenciesArray}
                  value={visibilityData.visibileVal}
                  label={"Visibility"}
                  name={"visibileVal"}
                  withRenderValue
                  fullWidth
                  onChange={handleOnChangeVisibility}
                  userRoleToShow={visibilityData.visibleName}
                />
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="mx-4">
                {visibilityData?.visibleName !== "Only me" &&
                visibilityData?.visibleName !== "Everyone" ? (
                  <div className="row">
                    <div className="form-group">
                      <div className="form-row ">
                        {visibilityData?.visibleName === "Users" && (
                          <Select
                            className=""
                            multiple={true}
                            value={
                              visibilityData?.visibleName === "Users"
                                ? users?.full_name
                                : facility?.name
                            }
                            onChange={handleUserMultiOnChange}
                            options={
                              users?.length > 0
                                ? users?.map((users) => ({
                                    value: users.uuid,
                                    label: users.fname,
                                  }))
                                : []
                            }
                          />
                        )}
                        {visibilityData?.visibleName === "Facilities" && (
                          <Select
                            className=""
                            multiple={true}
                            value={
                              visibilityData?.visibleName === "Users"
                                ? users?.full_name
                                : facility?.name
                            }
                            onChange={handleFacilityMultiOnChange}
                            options={
                              users?.length > 0
                                ? facility?.map((users) => ({
                                    value: users.uuid,
                                    label: users.name,
                                  }))
                                : []
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Button
                className="capitalize mr-2.5"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={() => handleCancel()}>
                Cancel
              </Button>
              <Button
                component="span"
                className="capitalize text-white"
                color="primary"
                variant="contained"
                onClick={() => handleSave()}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Product Delete Alert Start */}
      {deleteAlert && (
        <div className="d-flex flex-row pr-4 justify-end align-items-center">
          <Alert className="w-fit justify-end" severity="error" icon={true}>
            <div className="d-flex flex-row justify-between align-items-center">
              <Typography
                variant="h1"
                fontSize={13}
                fontWeight="medium"
                color={"red"}>
                Product successfully deleted
              </Typography>
            </div>
          </Alert>
        </div>
      )}
      {/* Product Delete Alert End */}

      {loading ? (
        <Spinner />
      ) : (
        <Table
          customer={true}
          rows={rowData}
          columns={columnToShow.length < 6 ? columnToShow : columns}
          tableColumnExtensions={tableColumnExtensions}
          dataProviders={dataProviders}
          multiSelection={true}
          selectionIds={selectionIds}
          setSelectionIds={setSelectionIds}
        />
      )}
    </div>
  );
};
export default NeedsReport;
