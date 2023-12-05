// Library Imports
import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

//Local Imports
import { Box, BreadCrumb, TextField } from "../../../../../shared";

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

const ViewDetails = () => {
  const { state } = useLocation();
  const { from } = state;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="main-container">
      <Box sx={{ width: "100%" }}>
        <div className="d-flex flex-row justify-content-between align-items-center p-3 bg-white">
          <div>
            <BreadCrumb
              routes={[
                {
                  name: "Inventory",
                  route: "/inventory/products",
                  color: true,
                },
                { name: "Stocks", route: "/inventory/stocks", color: true },
                {
                  name: from === "Details" ? `${state.from}` : "View Details",
                },
              ]}
            />
            <div className="text-[15px] font-bold">Details</div>
          </div>
        </div>
        <Box className="border-b bg-white">
          <Tabs
            variant="scrollable"
            value={value}
            className="px-3"
            onChange={handleChange}
            aria-label="basic tabs example">
            <Tab
              className="capitalize text-[15px]"
              label="Product Stock"
              {...a11yProps(0)}
            />
            <Tab
              className="capitalize text-[15px]"
              label="Product Activity"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div className="w-full h-[calc(100vh-100px)] bg-bgGray p-3">
            <div className="bg-white p-3 rounded border w-full flex flex-wrap gap-4">
              <TextField
                className="w-1/2"
                label="In Bound"
                fullWidth={true}
                size="small"
                disabled
                value={"20"}
                name="inbound"
              />
              <TextField
                className="w-1/2"
                label="In Stock"
                fullWidth={true}
                size="small"
                disabled
                value={"45"}
                name="instock"
              />
              <TextField
                className="w-1/2"
                label="Producing"
                fullWidth={true}
                size="small"
                disabled
                value={"60"}
                name="producing"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="h-full flex justify-center items-center bg-bgGray">
            <h2>This Feature is coming soon!</h2>
          </div>
        </TabPanel>
      </Box>
    </div>
  );
};

export default ViewDetails;
