// Library Imports
import React from "react";
import dayjs from "dayjs";
import classNames from "clsx";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import ClearIcon from "@mui/icons-material/Clear";
import { Divider, IconButton } from "@mui/material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
// Local Imports
import { Typography, CustomModal, Button } from "../../../../../shared";
import { success, white } from "../../../../../helpers/GlobalVariables";

const PREFIX = "Tooltip";

export const classes = {
  container: `${PREFIX}-container`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  desc: `${PREFIX}-desc`,
};

const StyledTooltipContent = styled("div")(() => ({
  [`&.${classes.container}`]: {
    width: `250px`,
    // backgroundColor: `#383838`,
    borderRadius: `6px`,
    zIndex: 999,
  },
  [`&.${classes.content}`]: {
    display: `flex !important`,
  },
  [`&.${classes.title}`]: {
    color: `#fff`,
  },
}));

export const AppointmentToolTipContent = ({ data }) => {
  console.log("🚀 data:", data);
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <StyledTooltipContent className={classNames(classes.container)}>
        <div
          className="text-white flex flex-col cursor-pointer"
          onClick={() => {
            if (data?.type === "receiving") {
              navigate(`/smart-schedule/edit-${data?.type}-order/{id}`, {
                state: data,
              });
            } else if (data?.type === "shipping") {
              navigate(`/smart-schedule/edit-${data?.type}-order/{id}`, {
                state: data,
              });
            } else if (data?.type === "production") {
              navigate(`/smart-schedule/edit-${data?.type}-order/{id}`, {
                state: data,
              });
            } else if (data?.type === "blend") {
              navigate(`/smart-schedule/edit-${data?.type}-order/{id}`, {
                state: data,
              });
            }
          }}>
          <div className="p-[10px] flex flex-col h-[max-content]">
            <span className="flex justify-between items-center">
              <p className="text-[13px]">{data?.customer?.name}</p>
              <IconButton
                onClick={() => {
                  if (data?.type === "receiving") {
                    navigate(`/smart-schedule/edit-${data?.type}-order/{id}`, {
                      state: data,
                    });
                  } else if (data?.type === "shipping") {
                    navigate(`/smart-schedule/edit-${data?.type}-order/{id}`, {
                      state: data,
                    });
                  }
                }}>
                <EditIcon fontSize="small" sx={{ color: white }} />
              </IconButton>
            </span>
            <span className="text-[10px] text-secondaryColor">
              ScheduleID: {data?.scheduleId}
            </span>
          </div>
          <Divider className="text-lightGray border-[0.5] rounded-xl" />
          <div className="p-[10px] flex flex-col h-[max-content]">
            <span className="text-[11px]">
              {" "}
              {data?.type === "blend"
                ? `${data?.blendOrder?.quantity} - ${data?.blendOrder?.unit} : ${data?.blendOrder?.kit?.kit_name}`
                : data?.type === "production"
                ? `${data?.productionOrder?.quantity} - ${data?.productionOrder?.unit} : ${data?.productionOrder?.kit?.kit_name}`
                : "Does Have Kit"}
            </span>
            <span className="text-[11px] text-secondaryColor">
              {data?.type === "receiving"
                ? `* ${data?.recieveingOrder?.quantity} Recieved`
                : data?.type === "production"
                ? `* ${data?.productionOrder?.quantity} Production`
                : data?.type === "blend"
                ? `* ${data?.blendOrder?.quantity} Blend`
                : data?.type === "shipping"
                ? `* Shipping`
                : "-"}
            </span>
            <span className="text-[10px] text-secondaryColor pt-[8px]">
              (
              {data?.type === "blend"
                ? `${data?.blendOrder?.kit?.kit_description}`
                : data?.type === "production"
                ? `${data?.productionOrder?.kit?.kit_description}`
                : "Does Have Kit"}
              )
            </span>
          </div>
          <Divider className="text-lightGray border-[0.5] rounded-xl" />
          <div className="p-[10px] flex flex-col h-[max-content] gap-[5px]">
            <div className="flex w-[100%] gap-[20px]">
              <span className="text-[11px] text-secondaryColor w-[25%] text-right">
                Total
              </span>
              <span className="text-[11px] w-[60%]">
                {data?.type === "blend"
                  ? data?.blendOrder?.quantity
                  : data?.type === "production"
                  ? data?.productionOrder?.quantity
                  : "-"}
              </span>
            </div>
            <div className="flex w-[100%] gap-[20px]">
              <span className="text-[11px] text-secondaryColor w-[25%] text-right">
                Order #
              </span>
              <span className="text-[11px] w-[60%]">{data?.scheduleId}</span>
            </div>
            <div className="flex w-[100%] gap-[20px]">
              <span className="text-[11px] text-secondaryColor w-[25%] text-right">
                Release #
              </span>
              <span className="text-[11px] w-[60%]">
                {data?.releaseNo ? data?.releaseNo : "-"}
              </span>
            </div>
            <div className="flex w-[100%] gap-[20px]">
              <span className="text-[11px] text-secondaryColor w-[25%] text-right">
                PO #
              </span>
              <span className="text-[11px] w-[60%]">
                {data?.poNumber ? data?.poNumber : "-"}
              </span>
            </div>
            <div className="flex w-[100%] gap-[20px]">
              <span className="text-[11px] text-secondaryColor w-[25%] text-right">
                Load Type
              </span>
              <span className="text-[11px] w-[60%]">-</span>
            </div>
            <div className="flex w-[100%] gap-[20px]">
              <span className="text-[11px] text-secondaryColor w-[25%] text-right">
                Shipper
              </span>
              <span className="text-[11px] w-[60%]">
                {data?.type === "shipping"
                  ? data?.shippingOrder?.shipper
                  : data?.type === "receiving"
                  ? data?.recieveingOrder?.shipper
                  : "-"}
              </span>
            </div>
            <div className="w-[100%]">
              <span className="text-[10px]">
                Add 1 case to original receipt qty after recount
              </span>
            </div>
          </div>
        </div>
      </StyledTooltipContent>
    </React.Fragment>
  );
};

export const ConnectedOrdersModal = ({ data, isActive, ref, setIsActive }) => {
  return (
    <React.Fragment>
      <CustomModal open={isActive} width={window.innerWidth * 0.3}>
        <div className="p-[15px] flex flex-col gap-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex gap-[5px] items-center text-[15px]">
              <SyncAltIcon color="primary" />
              <p>Connected Orders: Parkate Foods-75410</p>
            </div>
            <div className="cursor-pointer" onClick={() => setIsActive(false)}>
              <ClearIcon />
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <div>
              <div className="border-l-[3px] border-success bg-success/10 p-[10px] rounded-sm flex flex-col gap-[8px]">
                <div className="flex justify-between items-center">
                  <div className="flex gap-[5px] ">
                    <TripOriginIcon
                      fontSize="small"
                      sx={{
                        color: success,
                        fontSize: "14px",
                      }}
                    />
                    <span className="text-[11px] text-success">
                      {`IN - ${dayjs(data?.time, "HH:mm:ss").format("HH:mmA")}`}
                    </span>
                  </div>
                  <InfoIcon className="text-secondaryColor text-[17px]" />
                </div>
                <div>
                  <p className="text-[13px]">Parkate Foods-74510</p>
                </div>
                <div className={`flex  gap-1`}>
                  <div className="text-[11px] text-darkGray">
                    TRK : <span className="text-[black]">{"-"}</span>
                  </div>
                  <div className="text-[11px] text-darkGray">
                    REL : <span className="text-[black]">{"-"}</span>
                  </div>
                  <div className="text-[11px] text-darkGray">
                    PO : <span className="text-[black]">{data?.poNumber}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="border-l-[3px] border-success bg-success/10 p-[10px] rounded-sm flex flex-col gap-[8px]">
                <div className="flex justify-between items-center">
                  <div className="flex gap-[5px] ">
                    <TripOriginIcon
                      fontSize="small"
                      sx={{
                        color: success,
                        fontSize: "14px",
                      }}
                    />
                    <span className="text-[11px] text-success">
                      {`IN - ${dayjs(data?.time, "HH:mm:ss").format("HH:mmA")}`}
                    </span>
                  </div>
                  <InfoIcon className="text-secondaryColor text-[17px]" />
                </div>
                <div>
                  <p className="text-[13px]">Parkate Foods-74510</p>
                </div>
                <div className={`flex  gap-1`}>
                  <div className="text-[11px] text-darkGray">
                    TRK : <span className="text-[black]">{"-"}</span>
                  </div>
                  <div className="text-[11px] text-darkGray">
                    REL : <span className="text-[black]">{"-"}</span>
                  </div>
                  <div className="text-[11px] text-darkGray">
                    PO : <span className="text-[black]">{data?.poNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              color="secondary"
              variant="outlined"
              className="capitalize"
              onClick={() => setIsActive(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </CustomModal>
    </React.Fragment>
  );
};

export const PurchaseOrderModal = ({
  isOpenPurchaseModal,
  setIsOpenPurchaseMoal,
  data,
}) => {
  return (
    <React.Fragment>
      <CustomModal
        open={isOpenPurchaseModal}
        close={() => setIsOpenPurchaseMoal(!isOpenPurchaseModal)}
        width={window.innerWidth * 0.3}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row justify-content-between align-items-center text-center">
              <div className="pointer mx-3 mb-1">PO: {data?.poNumber}</div>
            </div>
            <div
              className="pointer mx-3"
              onClick={() => {
                setIsOpenPurchaseMoal(!isOpenPurchaseModal);
              }}>
              <ClearIcon color="secondary" fontSize="small" />
            </div>
          </div>
          <div className="mb-4 mt-3 flex flex-col gap-[0.7rem] ">
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                Date :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {dayjs(data?.date).format("DD/MM/YY")}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                Customer :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {data?.customer?.name ? data?.customer?.name : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                Vendor :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {data?.vendor ? data?.vendor : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                Shipper :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {data?.shippingOrder?.shipper
                  ? data?.shippingOrder?.shipper
                  : data?.recieveingOrder?.shipper
                  ? data?.recieveingOrder?.shipper
                  : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                PO Amount :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {data?.recieveingOrder?.quantity
                  ? `$${data?.recieveingOrder?.quantity}`
                  : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                3rd Party Freight :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {data?.shippingOrder?.chargeType === "3rd Party"
                  ? data?.shippingOrder?.chargeType
                  : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                Est Freight :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {" "}
                {data?.estFreight ? data?.estFreight : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                Prepaid :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {data?.shippingOrder?.chargeType === "Prepaid"
                  ? data?.shippingOrder?.chargeType
                  : "-"}
              </Typography>
            </div>
            <div className="flex">
              <Typography
                className=" w-52 text-dark"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                Notes :
              </Typography>
              <Typography
                className="w-full mr-4 text-black font-normal"
                variant="body1"
                fontSize={14}
                marginLeft={2}
                fontWeight="light">
                {data?.notes ? data?.notes : "-"}
              </Typography>
            </div>
          </div>
        </div>
      </CustomModal>
    </React.Fragment>
  );
};
