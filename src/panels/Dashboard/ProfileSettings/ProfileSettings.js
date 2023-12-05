// Library Imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useLocation } from "react-router-dom";

// Local Imports
import { Typography, Box } from "../../../shared";
import Header from "./Header";
import ProfileInformation from "./ProfileInformation/ProfileInformation";
import ChangePassword from "./ChangePassword/ChangePassword";
import AccountSecurity from "./AccountSecurity/AccountSecurity";
import Facilities from "./Facilities/Facilities.js";
import { white } from "../../../helpers/GlobalVariables" 

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
      {value === index && (
        <Box
          sx={
            index !== 3 && {
              border: "0.5px solid #ececec",
              padding: 2,
              m: 2,
              backgroundColor: white,
              borderRadius: 1.6,
            }
          }>
          {children}
        </Box>
      )}
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

const ProfileSettings = () => {
  const { state } = useLocation();

  const [value, setValue] = useState(state?.tab ? 3 : 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Header />
      <div className="main-container bg-bgGray">
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              background: "white",
            }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab
                className="normal-case"
                label={
                  <Typography fontSize={13} fontWeight="medium">
                    Profile Information
                  </Typography>
                }
                {...a11yProps(0)}
              />
              <Tab
                className="normal-case"
                label={
                  <Typography fontSize={13} fontWeight="medium">
                    Change Password
                  </Typography>
                }
                {...a11yProps(1)}
              />
              <Tab
                className="normal-case"
                label={
                  <Typography fontSize={13} fontWeight="medium">
                    Account Security
                  </Typography>
                }
                {...a11yProps(2)}
              />
              <Tab
                className="normal-case"
                label={
                  <Typography fontSize={13} fontWeight="medium">
                    Facilities
                  </Typography>
                }
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ProfileInformation />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ChangePassword />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <AccountSecurity />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Facilities />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default ProfileSettings;
