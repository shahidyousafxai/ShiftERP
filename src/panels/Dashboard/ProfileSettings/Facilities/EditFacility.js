/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Edit } from "@mui/icons-material";
import "../../Administration/administration.module.css";
import Settings from "./Tabs/Settings";
import { useParams } from "react-router-dom";
import { Button, BreadCrumb, Spinner } from "../../../../shared";
import { useNavigate } from "react-router-dom";
import * as Selectors from "../../../../redux/administration/selectors";
import * as Actions from "../../../../redux/administration/actions";
import { useDispatch, useSelector } from "react-redux";
import BasicInfo from "./Tabs/BasicInfo";
import Users from "./Tabs/Users";
import { SimpleDeleteModal } from "../../../../helpers/SimpleDeleteModal";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ height: window.innerHeight * 0.86 }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const EditFacility = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const [value, setValue] = useState(0);

  let { id } = useParams();
  let facility = Selectors.GetLoginUserFacilty(id)?.length
    ? Selectors.GetLoginUserFacilty(id)[0]
    : [];

  const loading = Selectors.GetFaciltiesLoading();
  const updateLoading = Selectors.GetUpdateFaciltiesLoading();
  const { uuid } = useSelector((state) => state.user.userInfo);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [name, setName] = useState(facility.name);
  const [address, setAddress] = useState(facility.address);
  const [city, setCity] = useState(facility.city);
  const [state, setState] = useState(facility.state);
  const [zip, setZip] = useState(facility.zip_code);
  const [primaryContactName, setPrimaryContactName] = useState([
    facility?.primary_contact?.name,
  ]);
  const [primaryContactEmail, setPrimaryContactEmail] = useState(
    facility?.primary_contact?.email
  );
  const [officePhone, setofficePhone] = useState(facility.office_phone);
  const [status, setStatus] = useState(facility.status === 0 ? 0 : 1);
  const [isDelete, setIsDelete] = useState(false);

  const Buttons = ({ save, id }) => {
    return (
      <div
        className={`d-flex ${id ? "justify-content-between" : "justify-content-end"
        } bg-white mt-5 py-5 border border-lightGray`}>
        {/* <CustomModal
          open={isDelete}
          close={() => setIsDelete(!isDelete)}
          width={window.innerWidth * 0.4}>
          <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row justify-content-between align-items-center text-center">
                <div className="pointer">
                  <Delete
                    className="mx-3 mb-1"
                    color="danger"
                    fontSize="small"
                  />
                </div>
                Delete Facility
              </div>
              <div
                className="pointer mx-3"
                onClick={() => setIsDelete(!isDelete)}>
                <ClearIcon color="secondary" fontSize="small" />
              </div>
            </div>
            <div className="my-3">
              <Typography
                className="d-flex flex-row align-items-center"
                variant="body1"
                fontSize={15}
                marginBottom={1}
                marginTop={3}
                marginLeft={3}
                fontWeight="light">
                Are you sure you want to delete facility
                <div className="ms-2 fw-normal">{facility.name}</div>
              </Typography>
              <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
                <Button
                  className="mr-2.5"
                  component="span"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsDelete(false)}>
                  Cancel
                </Button>
                <Button
                  component="span"
                  color="danger"
                  className="text-white"
                  variant="contained"
                  onClick={() => {
                    dispatch(Actions.deleteFacility(facility.uuid));
                    navigate("/administration/facilities");
                  }}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CustomModal> */}

        <SimpleDeleteModal
          states={{
            open: isDelete,
            setOpen: setIsDelete,
            headTitle: "Delete Facilityoooooo",
            deleteName: facility?.name,
            deleteMethod: () => {
              dispatch(Actions.deleteFacility(facility.uuid));
              navigate("/administration/facilities");
            },
          }}
        />


        {/* {id &&
          <Button
            size="medium"
            style={{ marginLeft: 20, marginRight: 10, textTransform: "none", width: '130px' }}
            component="span"
            variant="outlined"
            color='danger'
            onClick={() => {
              setIsDelete(!isDelete)
            }}
          >
            Delete Facility
          </Button>
        } */}
        <div className="buttons d-flex">
          <Button
            size="medium"
            className="mr-2.5 normal-case w-[100px]"
            component="span"
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/administration/facilities")}>
            Cancel
          </Button>
          <Button
            size="medium"
            className="mr-5 normal-case w-[100px]"
            component="span"
            color="primary"
            variant="contained"
            onClick={save}
            loading={updateLoading}
            disabled={updateLoading}>
            Save
          </Button>
        </div>
      </div>
    );
  };

  const handleSave = () => {
    dispatch(
      Actions.updateFacility(
        uuid,
        facility.uuid,
        name,
        officePhone,
        address,
        city,
        state,
        zip,
        primaryContactEmail,
        primaryContactName,
        status
      )
    );
    navigate("/profile", {
      state: {
        tab: "facilities",
      },
    });
  };

  useEffect(() => {
    dispatch(Actions.getFacilities());
  }, []);
  if (!facility) {
    return (
      <div className="flex flex-row justify-center h-96">
        <h2>No facility found</h2>
      </div>
    );
  } else {
    return loading ? (
      <Spinner />
    ) : (
      <div className="add-users-main-container">
        <Box sx={{ width: "100%" }}>
          <div className="d-flex flex-row justify-content-between align-items-center p-3 bg-white">
            <div>
              <BreadCrumb
                routes={[
                  { name: "Profile", route: "/profile" },
                  { name: "Facilities", route: "/profile" },
                  {
                    name: facility.name,
                    route: `/profile/edit-facility/${id}`,
                    color: true,
                  },
                ]}
              />
              <div>
                <Edit className="mb-1" color="primary" /> Edit Facility:{" "}
                {facility.name}
              </div>
            </div>
          </div>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              background: "white",
            }}>
            <Tabs
              variant="scrollable"
              value={value}
              className="px-3"
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab
                className="normal-case text-[15px]"
                label="Basic Info"
                {...a11yProps(0)}
              />
              <Tab
                className="normal-case text-[15px]"
                label="Users"
                {...a11yProps(1)}
              />
              <Tab
                className="normal-case text-[15px]"
                label="Settings"
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div
              className="h-full flex flex-col justify-between">
              <BasicInfo
                id={facility.id}
                name={name}
                address={address}
                city={city}
                state={state}
                zip={zip}
                primaryContactName={primaryContactName}
                primaryContactEmail={primaryContactEmail}
                officePhone={officePhone}
                status={status}
                setName={setName}
                setAddress={setAddress}
                setCity={setCity}
                setState={setState}
                setZip={setZip}
                setPrimaryContactName={setPrimaryContactName}
                setPrimaryContactEmail={setPrimaryContactEmail}
                setofficePhone={setofficePhone}
                setStatus={setStatus}
              />
                <div className="text-black border-lime-400 border-2 p-4">
                  Shahid
                </div>
              <Buttons save={handleSave} />
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div
              className="h-full flex flex-col justify-between bg-bgGray">
              <Users facility={facility} />
              <Buttons />
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div
              className="h-full flex flex-col justify-between">
              <Settings id={id} />
              <Buttons />
            </div>
          </TabPanel>
        </Box>
      </div>
    );
  }
};

export default EditFacility;
