/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useState, Fragment } from "react";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

// Local Imports
import { BreadCrumb, Box } from "../../../../shared";
import LocationInfo from "./Tabs/LocationInfo";
import InventoryItemInfo from "./Tabs/InventoryItemInfo";

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

const AddNewLocation = () => {
  //Navigation
  const { state } = useLocation();
  const { id } = useParams();
  const location = state?.location;

  //***** States *****//
  const [value, setValue] = useState(0);

  // METHODS FOR BUTTONS FROM ADD NEW PRICING LINKED SCREENS END ***** //
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Fragment>
        <div className="main-container">
          <Box sx={{ width: "100%" }}>
            <div
              className={`bg-white d-flex flex-row justify-content-between align-items-center ${
                id ? "pt-3" : "py-3"
              }  ml-4`}>
              <div>
                <BreadCrumb
                  routes={[
                    {
                      name: "Inventory",
                      route: "/inventory/products",
                      color: true,
                    },
                    {
                      name: "Locations",
                      route: "/inventory/locations",
                      color: true,
                    },
                    { name: id ? location?.name : "Add New Location" },
                  ]}
                />
                {id ? (
                  <div>
                    <Edit className="mb-1 mr-1" color="primary" />
                    Edit : {location?.name}
                  </div>
                ) : (
                  <div>
                    <Add className="mb-1" color="primary" />
                    Add New Location
                  </div>
                )}
              </div>
            </div>
            {id ? (
              <>
                <Box className="border-b bg-white">
                  <Tabs
                    variant="scrollable"
                    value={value}
                    className="px-3"
                    onChange={handleChange}
                    aria-label="basic tabs example">
                    <Tab
                      className="capitalize text-[15px]"
                      // icon={
                      //   isEmpty?.showErrorOnTabHeader && (
                      //     <Error color="danger" fontSize="small" />
                      //   )
                      // }
                      iconPosition="start"
                      label="Location Info"
                      {...a11yProps(0)}
                    />
                    <Tab
                      className="capitalize text-[15px]"
                      label="Inventory Item"
                      {...a11yProps(1)}
                    />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <div className="flex flex-col justify-between bg-bgGray">
                    <LocationInfo id={id} location={location} />
                  </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <div className="h-[100%] flex flex-col justify-between">
                    <InventoryItemInfo id={id} location={location} />
                  </div>
                </TabPanel>
              </>
            ) : (
              <LocationInfo />
            )}
          </Box>
        </div>
      </Fragment>
    </div>
  );
};

export default AddNewLocation;
