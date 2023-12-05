// Library Imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
// Local Imports
import { Button, BreadCrumb, Spinner } from "../../../../shared";
import ProductsNotReceived from "./ProductsNotReceived";
import ReadyToClose from "./ReadyToClose";
import CompletedPO from "./CompletedPO";
import ClosedPO from "./ClosedPO";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className={`h-[${window.innerHeight * 0.86}px]`}
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
const PurchaseOrder = () => {
  //***** States *****//
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  //UseEffect For All Dependencies
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [loading]);

  // const { state } = useLocation();
  // const id = state?.uuid;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <div className="d-flex flex-row justify-content-between align-items-center py-3 px-3">
        <div>
          <BreadCrumb
            routes={[
              {
                name: "Accounting",
                route: "/accounting/production-extras",
                color: true,
              },
              { name: "Purchase Order" },
            ]}
          />
          <div className="text-[15px] font-bold">Purchase Orders</div>
        </div>

        <Button
          startIcon={<Add />}
          className="capitalize font-medium text-[13px] ml-[10px]"
          // onClick={() => navigate("/accounting/purchase-order/add-new-purchase-order")}
          component="span"
          color="primary"
          variant="contained">
          Add New PO
        </Button>
      </div>

      {/* Tabs Header */}
      <Box className="border-b border-lightGray bg-white">
        <Tabs
          variant="scrollable"
          value={value}
          className=""
          onChange={handleChange}
          aria-label="basic tabs example">
          <Tab
            className="capitalize text-[15px]"
            // icon={
            //   provisionDetailsEmpty?.businessInfo && (
            //     <Error color="danger" fontSize="small" />
            //   )
            // }
            iconPosition="start"
            label="Open POs, Product Not Received (4)"
            {...a11yProps(0)}
          />
          <Tab
            className="capitalize text-[15px]"
            // icon={
            //   provisionDetailsEmpty?.subscription && (
            //     <Error color="danger" fontSize="small" />
            //   )
            // }
            iconPosition="start"
            label="Open POs, Ready to Close (2)"
            {...a11yProps(1)}
          />
          <Tab
            className="capitalize text-[15px]"
            // icon={
            //   provisionDetailsEmpty?.settings && (
            //     <Error color="danger" fontSize="small" />
            //   )
            // }
            iconPosition="start"
            label="Completed POs (5)"
            {...a11yProps(2)}
          />
          <Tab
            className="capitalize text-[15px]"
            // icon={
            //   provisionDetailsEmpty?.settings && (
            //     <Error color="danger" fontSize="small" />
            //   )
            // }
            iconPosition="start"
            label="Closed POs (1)"
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>

      {/* Selected Tab Body */}

      {loading ? (
        <Spinner />
      ) : (
        <>
          <TabPanel value={value} index={0}>
            <div className="flex flex-col justify-between bg-bgGray">
              <ProductsNotReceived />
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="flex flex-col justify-between bg-bgGray">
              <ReadyToClose />
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="flex flex-col justify-between bg-bgGray">
              <CompletedPO />
            </div>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <div className="flex flex-col justify-between bg-bgGray">
              <ClosedPO />
            </div>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default PurchaseOrder;
