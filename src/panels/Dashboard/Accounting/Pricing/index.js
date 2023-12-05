/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import { Add } from "@mui/icons-material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Local Imports
import { Box, BreadCrumb, Button } from "../../../../shared";
import HandlingFees from "./Tabs/HandlingFees";
import RecurringStorage from "./Tabs/RecurringStorage";
import { useDispatch } from "react-redux";
import {
  GetPricingListing,
  GetPricingLoading,
} from "../../../../redux/Pricing/selectors";
import { getPricing } from "../../../../redux/Pricing/actions";
import { getAllDependenciesAccounting } from "../../../../api/allDependencies";

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

const Pricing = () => {
  //Navigation
  const navigate = useNavigate();
  //***** States *****//
  const [value, setValue] = useState(0);

  // METHODS FOR BUTTONS FROM ADD NEW PRICING LINKED SCREENS END ***** //

  //Navigations
  const dispatch = useDispatch();
  // const { state } = useLocation();
  // const [loading, setLoading] = useState(false);
  const recurringStorageLoading = GetPricingLoading();
  const pricingListing = GetPricingListing();
  let recurringStorage = pricingListing
    ?.filter((item) => item?.charge_type?.name === "Recurring Pricing")
    .map((item, index) => {
      let newObject = {
        id: index + 1,
        uuid: item?.uuid,
        customerName: item?.customer?.name,
        pricingName: item?.name,
        chargeType: item?.charge_type?.name,
        grace: item?.grace_period,
        aniversaryPeriod: item?.aniversary_Period
          ? item?.aniversary_Period
          : "-",
        price: item?.price_per_unit,
        uom: item?.unit?.name,
        completeItem: item,
      };
      return newObject;
    });
  let handlingFee = pricingListing
    ?.filter((item) => item?.charge_type?.name === "Handling Fees")
    .map((item, index) => {
      let newObject = {
        id: index + 1,
        uuid: item?.uuid,
        customerName: item?.customer?.name,
        pricingName: item?.name,
        chargeType: item?.charge_type?.name,
        price: item?.price_per_unit ? `$${item?.price_per_unit}` : "-",
        completeItem: item,
      };
      return newObject;
    });
  const [name, setName] = useState("");
  const [selectionIds, setSelectionIds] = useState([]);

  const [customersArray, setCustomersArray] = useState([]);
  // const [pricingNameArray, setPricingNameArray] = useState([]);

  //filterState
  const [filters, setFilters] = useState({ Customers: [] });

  //Get Pricing Type Array Filter
  const filtersArray = (from) => {
    if (from === "Customers") {
      let customerData = [];
      filters?.Customers?.map((item, index) => {
        if (item.value) {
          customerData.push(customersArray[index].uuid);
        }
      });

      return customerData;
    }
  };

  //Get Listing With Dependencies
  const getPricingListing = () => {
    const payload = {
      search: name,
      customer_id:
        filtersArray("Customers")?.length > 0 ? filtersArray("Customers") : "",
    };
    dispatch(getPricing(payload));
  };

  //UseEffect for get All Accounting Dependencies
  useEffect(() => {
    let payload = {
      name: "pricing",
    };
    getAllDependenciesAccounting(payload)
      .then((res) => {
        let data = res?.data?.data;
        let customerData = data?.customer?.map((item) => {
          return {
            title: item.name ? item.name : item.code,
            value: false,
          };
        });
        setFilters((prev) => {
          return {
            ...prev,
            Customers: customerData,
          };
        });
        setCustomersArray(res?.data?.data?.customer);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  // useEffect for Listing call
  useEffect(() => {
    if (name === "" || filters !== filters) {
      getPricingListing();
      setSelectionIds([]);
    }
  }, [dispatch, name, filters]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFilters(() => {
      let customers = filters.Customers.slice();
      customers?.map((item) => {
        item.value = false;
      });
      const newObj = {
        Customers: customers,
      };

      return newObj;
    });
    setName("");
  };

  return (
    <div>
      <Fragment>
        <div className="main-container">
          <Box sx={{ width: "100%" }}>
            <div className="bg-white d-flex flex-row justify-content-between align-items-center pt-3 ml-4">
              <div>
                <BreadCrumb
                  routes={[
                    {
                      name: "Accounting",
                      route: "/accounting/pricing",
                      color: true,
                    },
                    { name: "Pricing" },
                  ]}
                />
                <div className="text-[15px] font-bold">Pricing</div>
              </div>
              <div>
                <Button
                  startIcon={<InsertDriveFileIcon />}
                  size="medium"
                  className="capitalize"
                  component="span"
                  variant="outlined"
                  color="primary"
                  // disabled={loading || deleteLoading}
                  // onClick={handleCancelPricingRule}
                >
                  Create IIF File
                </Button>
                <Button
                  startIcon={<Add />}
                  className="capitalize text-[13px] ml-[10px]  font-medium "
                  onClick={() =>
                    navigate("/accounting/pricing/add-new-pricing-rule")
                  }
                  component="span"
                  color="primary"
                  variant="contained">
                  New Pricing
                </Button>
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
                  // icon={
                  //   isEmpty?.showErrorOnTabHeader && (
                  //     <Error color="danger" fontSize="small" />
                  //   )
                  // }
                  iconPosition="start"
                  label="Recurring Storage"
                  {...a11yProps(0)}
                />
                <Tab
                  className="capitalize text-[15px]"
                  label="Handling Fees"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div className="flex flex-col justify-between bg-bgGray">
                <RecurringStorage
                  filters={filters}
                  setFilters={setFilters}
                  selectionIds={selectionIds}
                  setSelectionIds={setSelectionIds}
                  loading={recurringStorageLoading}
                  // setLoading={setLoading}
                  name={name}
                  setName={setName}
                  getPricingListing={getPricingListing}
                  recurringStorage={recurringStorage}
                />
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className="h-[100%] flex flex-col justify-between bg-bgGray">
                <HandlingFees
                  filters={filters}
                  setFilters={setFilters}
                  selectionIds={selectionIds}
                  setSelectionIds={setSelectionIds}
                  loading={recurringStorageLoading}
                  // setLoading={setLoading}
                  name={name}
                  setName={setName}
                  getPricingListing={getPricingListing}
                  handlingFee={handlingFee}
                />
              </div>
            </TabPanel>
          </Box>
        </div>
      </Fragment>
    </div>
  );
};

export default Pricing;
