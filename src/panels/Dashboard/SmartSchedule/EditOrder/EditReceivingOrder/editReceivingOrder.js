/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Tab, Tabs } from "@mui/material";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import BlockIcon from "@mui/icons-material/Block";

// Local Imports
import { Box, BreadCrumb, Button, Spinner } from "../../../../../shared";
import OrderDetails from "./OrderDetails/OrderDetails";
import ExtraValues from "./ExtraValues/ExtraValues";
import Products from "./Products/products";
import ReturnProducts from "./ReturnProduct/ReturnProducts";
import ConnectedOrders from "./ConnectedOrders/ConnectedOrders";
import EdiDetails from "./EDIDetails/EdiDetails";
import Comments from "./Comments";
import useAllDependencies from "../../../../../redux/dependencies/getAllDependencies";
import usePostRequest from "../../../../../helpers/usePostRequest";
import { getSingleOrder } from "../../../../../api/smartSchedule";
import { getCommentTagList } from "../../../../../api/orderCommentsApi";
import { ArrowDropDown } from "@mui/icons-material";
import { secondaryColor } from "../../../../../helpers/GlobalVariables";

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
const EditReceivingOrder = () => {
  //***** States *****//
  const [value, setValue] = useState(0);
  const [orderDetailsData, setOrderDetailsData] = useState([]);
  const { dependences, loadingDepend, allDependences } = useAllDependencies();

  const [commentLoading, setCommentLoading] = useState(false);
  const [publicTagList, setPublicTagList] = useState([]);
  const [teamTagList, setTeamTagList] = useState([]);

  const { state } = useLocation();
  const id = state?.uuid;
  const navigate = useNavigate();
  const { data, loading, UsePost } = usePostRequest();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //UseEffect For All Dependencies
  useEffect(() => {
    allDependences({
      type: "receiving",
      customer_id: state?.customer?.uuid,
    });
  }, []);

  //***** Buttons Component *****//
  const Buttons = () => {
    return (
      <div className="buttons flex justify-between ">
        <Button
          size="medium"
          className="capitalize mr-[10px] w-[100px]"
          component="span"
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/smart-schedule")}>
          Close
        </Button>

        {value !== 1 && (
          <>
            <Button
              size="medium"
              className="capitalize font-medium text-[14px] mr-[10px] text-black"
              // onClick={() => navigate("#")}
              component="span"
              color="secondary"
              variant="outlined"
              endIcon={<ArrowDropDown sx={{ color: secondaryColor }} />}>
              More Actions
            </Button>
            <Button
              size="medium"
              className="capitalize mr-[10px]"
              component="span"
              color="danger"
              variant="outlined"
              // onClick={() => navigate("/smart-schedule")}
            >
              Cancel Order
            </Button>
          </>
        )}

        {value === 1 && (
          <>
            <Button
              startIcon={<BlockIcon color="danger" />}
              size="medium"
              className="capitalize mr-[10px]"
              component="span"
              color="danger"
              variant="outlined"
              // onClick={() => navigate("/smart-schedule")}
            >
              Cancel Order
            </Button>
            {/* <Button
              size="medium"
              className="capitalize mr-[10px]"
              component="span"
              color="primary"
              variant="outlined"
              // onClick={() => navigate("/smart-schedule")}
            >
              Complete Order
            </Button> */}
          </>
        )}
      </div>
    );
  };

  //Get Single Order Details
  const getSingleDetails = () => {
    if (id) {
      UsePost(getSingleOrder, {
        order_uuid: id,
      });
    }
  };

  //UseEffect For Get Single Order Details
  useEffect(() => {
    getSingleDetails(id);
  }, []);

  //UseEffect For Set Order Details Data && fetch comment tag list all public and team
  useEffect(() => {
    setCommentLoading(true);
    setOrderDetailsData(data?.data?.orders);
    const publicTagId = data?.data?.orders?.public_channel_id;
    const teamTagId = data?.data?.orders?.team_channel_id;

    const fetchData = async () => {
      try {
        const arr = [];

        const res1 = await getCommentTagList({
          chat_id: publicTagId,
        });
        const response1 = res1?.data?.data?.customer;

        const responseArray1 = {
          uuid: response1?.uuid,
          name: response1?.name,
        };
        arr.push(responseArray1);

        const res2 = await getCommentTagList({
          chat_id: teamTagId,
        });
        const response2 = res2?.data?.data;

        const resArray2 = response2?.map((item) => ({
          uuid: item?.uuid,
          name: item?.full_name,
        }));
        setTeamTagList(resArray2);
        arr.push(...resArray2);

        setPublicTagList(arr);
        // console.log("arr", arr);
        setCommentLoading(false);
      } catch (error) {
        setCommentLoading(false);
        console.log("Error fetching data:", error?.response);
      }
    };
    if (data) {
      fetchData();
    }
  }, [data]);

  return (
    <Box className="w-[100%]">
      {/* Bread Crums Start*/}
      <div className="flex justify-between items-center pl-4 py-3">
        <div>
          <BreadCrumb
            routes={[
              {
                name: "ShiftERP",
                route: "/dashboard",
                color: true,
              },
              {
                name: "Smart Schedule",
                route: "/smart-schedule",
                color: true,
              },
              {
                name:
                  state?.type === "blend"
                    ? `${state?.blendOrder?.kit?.kit_name} - ${state?.blendOrder?.quantity}`
                    : state?.type === "production"
                    ? `${state?.productionOrder?.kit?.kit_name} - ${state?.productionOrder?.quantity}`
                    : `${state?.customer?.name}`,
              },
            ]}
          />
          {
            <div className="flex items-center gap-[8px]">
              <span className="capitalize h-6 cursor-default bg-primaryColor rounded-[3px] flex items-center justify-center p-1">
                <AltRouteIcon className="w-4 text-white" />
              </span>

              <span className="font-semibold">
                {state?.type === "blend"
                  ? `${state?.blendOrder?.kit?.kit_name} - ${state?.blendOrder?.quantity}`
                  : state?.type === "production"
                  ? `${state?.productionOrder?.kit?.kit_name} - ${state?.productionOrder?.quantity}`
                  : `${state?.customer?.name}`}
              </span>

              <Button
                className="capitalize w-[70px] h-5 cursor-default text-[11px] font-[400]"
                component="span"
                color="primary"
                variant="contained">
                {state?.type}
              </Button>

              <Button
                className="capitalize w-[100px] h-5 cursor-default text-[11px] font-[400]"
                component="span"
                color="primary"
                variant="outlined">
                order status
              </Button>
            </div>
          }
        </div>

        <Buttons />
      </div>

      {/* Tabs Header */}
      <Box className="border-b bg-white">
        <Tabs
          variant="scrollable"
          value={value}
          className=""
          onChange={handleChange}
          aria-label="basic tabs example">
          <Tab
            className="capitalize text-[15px]"
            iconPosition="start"
            label="Order Details"
            {...a11yProps(0)}
          />
          <Tab
            className="capitalize text-[15px]"
            iconPosition="start"
            label="Products"
            {...a11yProps(1)}
          />
          <Tab
            className="capitalize text-[15px]"
            iconPosition="start"
            label="Extra Values"
            {...a11yProps(2)}
          />
          <Tab
            className="capitalize text-[15px]"
            iconPosition="start"
            label="Return Products"
            {...a11yProps(3)}
          />
          <Tab
            className="capitalize text-[15px]"
            iconPosition="start"
            label="Connected Orders"
            {...a11yProps(4)}
          />
          <Tab
            className="capitalize text-[15px]"
            iconPosition="start"
            label="EDI Details"
            {...a11yProps(5)}
          />
          <Tab
            className="capitalize text-[15px]"
            iconPosition="start"
            label="Comments"
            {...a11yProps(6)}
          />
        </Tabs>
      </Box>

      {commentLoading || loading || loadingDepend ? (
        <Spinner />
      ) : (
        <>
          <TabPanel value={value} index={0}>
            <div className="h-[100%] flex flex-col justify-between bg-bgGray">
              <OrderDetails
                orderDetailsData={orderDetailsData}
                dependences={dependences}
                id={id}
                getSingleDetails={getSingleDetails}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="h-[100%] flex flex-col justify-between bg-bgGray">
              <Products
                dependences={dependences}
                customerUUID={state?.customer?.uuid}
                orderDetailsData={orderDetailsData}
                getSingleDetails={getSingleDetails}
                loading={commentLoading || loading || loadingDepend}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="h-[100%] flex flex-col justify-between bg-bgGray">
              <ExtraValues />
            </div>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <div className="h-[100%] flex flex-col justify-between bg-bgGray">
              <ReturnProducts />
            </div>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <div className="h-[100%] flex flex-col justify-between bg-bgGray">
              <ConnectedOrders />
            </div>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <div className="h-[100%] flex flex-col justify-between bg-bgGray">
              <EdiDetails />
            </div>
          </TabPanel>
          <TabPanel value={value} index={6}>
            <div className="h-[100vh] flex flex-col justify-between bg-bgGray">
              <Comments
                orderDetailsData={orderDetailsData}
                teamTagList={teamTagList}
                publicTagList={publicTagList}
              />
            </div>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default EditReceivingOrder;
