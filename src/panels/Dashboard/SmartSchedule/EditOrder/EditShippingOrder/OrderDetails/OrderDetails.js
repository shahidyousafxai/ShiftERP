import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import DescriptionIcon from "@mui/icons-material/Description";

import {
  BasicInfoModal,
  ManageItem,
  ShippingDetailsModal,
} from "./Components/utils";
import { CheckBox, SearchBar } from "../../../../../../shared";

const OrderDetails = ({
  orderDetailsData,
  getSingleDetails,
  id,
  dependences,
}) => {
  const [openBasicInfoModal, setOpenBasicInfoModal] = useState(false);
  const [shippingDetailsModal, setShippingDetailsModal] = useState(false);
  const [name, setName] = useState("");
  const [removeItem, setremoveItem] = useState("");

  //Facility Table Component
  const DocumentsTable = () => {
    return (
      <div className="mx-3 max-h-52 overflow-y-auto">
        <table
          className="bg-white text-black table-fixed  shadow-none"
          width="100%">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b-2">
              <th className="text-darkGray text-[13px] font-[500] w-[5%] !pl-[9px]">
                <CheckBox color={"secondary"} size={"small"} />
              </th>
              <th className="text-darkGray text-[13px] font-[500] w-[35%] ">
                File
              </th>
              <th className="text-darkGray text-[13px] font-[500] w-[30%]">
                Document Type
              </th>
              <th className="text-darkGray text-[13px] font-[500] w-[20%]">
                Date
              </th>
              <th className="text-darkGray text-[13px] font-[500]  w-[10%] ">
                Manage
              </th>
            </tr>
          </thead>
          <tbody>
            {orderDetailsData?.file?.length > 0 ? (
              orderDetailsData?.file?.map((item, index) => {
                return (
                  <tr
                    className={`!rounded-[10px] ${
                      index % 2 !== 0 ? "bg-lightGray" : "bg-white"
                    }`}
                    key={index}>
                    <td className="py-2 text-[13px] !ml-10">
                      {" "}
                      <CheckBox color={"secondary"} />{" "}
                    </td>
                    <td className="py-2 text-[13px]">{item?.File}</td>
                    <td className=" py-2 text-[13px]">{item?.document_type}</td>
                    <td className=" py-2 text-[13px]">{item?.date}</td>
                    <td className=" py-2 text-[13px]">
                      <ManageItem item={item} removeItem={removeItem} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="flex items-center justify-center w-[70vw]">
                <div className="flex flex-col items-center mt-3">
                  <DescriptionIcon fontSize="large" color="secondary" />
                  <p className="mt-2 text-black text-[13px]">
                    No data added to the table.
                  </p>
                </div>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between py-[20px] pr-[20px] pl-[20px]">
      {/* Basic Info Modal */}
      <BasicInfoModal
        setOpenBasicInfoModal={setOpenBasicInfoModal}
        openBasicInfoModal={openBasicInfoModal}
        orderDetailsData={orderDetailsData}
        getSingleDetails={getSingleDetails}
        dependences={dependences}
        id={id}
      />

      {/* Shipping Details Modal */}
      <ShippingDetailsModal
        setShippingDetailsModal={setShippingDetailsModal}
        shippingDetailsModal={shippingDetailsModal}
        orderDetailsData={orderDetailsData}
        getSingleDetails={getSingleDetails}
        dependences={dependences}
        id={id}
      />

      <div className="flex gap-3 w-full ">
        {/* Basic Info */}
        <div className="border rounded bg-white pb-0.5 w-1/2">
          <div className="flex justify-between items-center px-3">
            <h6 className="py-3">Shipping Order Details</h6>
            <IconButton
              onClick={() => setOpenBasicInfoModal(!openBasicInfoModal)}>
              <EditIcon className="cursor-pointer text-secondaryColor" />
            </IconButton>
          </div>

          <div className="mb-4 flex flex-col gap-[0.7rem]">
            {/* <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Order ID:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {orderDetailsData?.order_id}
              </Typography>
            </div> */}
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Customer:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {orderDetailsData?.customer?.name}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Date:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {dayjs(orderDetailsData?.date).format("DD/MM/YYYY")}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Time:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {dayjs(orderDetailsData?.time, "h:mm:ss").format("h:mm A")}
              </Typography>
            </div>

            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                PO Number:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {orderDetailsData?.type === "shipping"
                  ? orderDetailsData?.po_number
                  : "-"}
              </Typography>
            </div>

            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Release Number:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {orderDetailsData?.type === "shipping"
                  ? orderDetailsData?.release_number
                  : "-"}
              </Typography>
            </div>

            {/* <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Amount Ordered:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {orderDetailsData?.amount_ordered}
              </Typography>
            </div> */}
          </div>
        </div>

        {/* Shipping Details */}
        <div className="border rounded bg-white pb-0.5 w-1/2">
          <div className="flex justify-between items-center px-3">
            <h6 className="py-3">Shipping Details</h6>
            <IconButton
              onClick={() => setShippingDetailsModal(!shippingDetailsModal)}>
              <EditIcon className="cursor-pointer text-secondaryColor" />
            </IconButton>
          </div>

          <div className="mb-4 flex flex-col gap-[0.7rem]">
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Shipper:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {orderDetailsData?.type === "shipping"
                  ? orderDetailsData?.shipping_order?.shipper?.name
                  : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                ShipTo Name:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {orderDetailsData?.type === "shipping"
                  ? orderDetailsData?.shipping_order?.shipTo?.name
                  : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Driver 1:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {orderDetailsData?.driver1?.name}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Driver 2:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {orderDetailsData?.driver2?.name}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Notes:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {orderDetailsData?.notes ? orderDetailsData?.notes : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Charge Type:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {orderDetailsData?.type === "shipping"
                  ? orderDetailsData?.shipping_order?.chargeType?.name
                  : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-darkGray"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                Stack Type:
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={13}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {orderDetailsData?.type === "shipping"
                  ? orderDetailsData?.shipping_order?.stackType?.name
                  : "-"}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded bg-white my-[20px]">
        <div className=" px-3">
          <h6 className="pt-3">Documents</h6>
          <div className="py-3">
            <SearchBar
              // disabled={}
              onClear={() => setName("")}
              // onSearch={() => onUserSearch()}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        </div>
        <div className="">
          <DocumentsTable />
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
