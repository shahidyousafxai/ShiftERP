// Library Imports
import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Local Imports
import "../Dashboard/Customer/Styles/customer.css";
import Accounts from "./Tabs/Accounts";
import { Button, BreadCrumb } from "../../shared";
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
const ManageAccounts = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleTabValue = (event, newValue) => {
    setValue(newValue);
  };

  //***** Add User Start *****//

  //***** Add User End *****//

  return (
    <div className="main-container w-auto bg-white overflow-y-hidden">
      {/* BreaddCrumbs & Add Customer Button */}
      <div className="d-flex flex-row h-[5%] justify-content-between align-items-center pt-4 pl-5">
        <div>
          <BreadCrumb
            routes={[
              { name: "ShiftERP", route: "/", color: true },
              { name: "Manage Accounts" },
            ]}
          />
          <div className="text-[15px] font-bold">
            Manage Accounts
          </div>
        </div>
        <Button
          startIcon={<Add />}
          className="normal-case text-[13px] font-medium"
          onClick={() => navigate("/manage-accounts/add")}
          component="span"
          color="primary"
          variant="contained">
          Provision Account
        </Button>
      </div>

      <div className="h-[95%] overflow-y-hidden">
        <Box className="w-full">
          <Box className="border-b-[1px] bg-white border-[divider]">
            <Tabs
              variant="scrollable"
              scrollButtons={false}
              value={value}
              className="px-3 pt-2"
              onChange={handleTabValue}
              aria-label="basic tabs example">
              <Tab
                className={`normal-case text-[14px] font-semibold top-2.5 ${value === 0 ? "text-primaryColor" : "text-secondaryColor"}`}
                iconPosition="start"
                label="Accounts"
                {...a11yProps(0)}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Accounts />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};
export default ManageAccounts;
