// Library Imports
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Popover, Whisper } from "rsuite";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import { styled } from "@mui/material/styles";
import parse from "html-react-parser";
import InfoIcon from "@mui/icons-material/Info";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import classNames from "clsx";
import dayjs from "dayjs";
// Local Imports
import classes from "./Classes";
import { CustomModal, Typography, Button } from "../../../../../shared";
import {
  AppointmentToolTipContent,
  ConnectedOrdersModal,
  PurchaseOrderModal,
} from "./AppointmentToolTip";
import { deleteNote } from "../../../../../api/smartSchedule";
import { getOrdersList } from "../../../../../redux/smartSchedule/actions";
import {
  darkGray,
  secondaryColor,
  white,
} from "../../../../../helpers/GlobalVariables";
import { AssignDeleteModal } from "../../../../../helpers/AssignDeleteModal";

//StyledAppointmentsAppointment Used
const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
  [`&.${classes.appointment}`]: {
    borderTop: 0,
    borderRadius: 4,
    borderBottom: 0,
    padding: `10px 10px 10px 10px`,
    height: `max-content`,
    "&::-webkit-scrollbar": {
      display: "none",
    },
    fontFamily: "SF UI Display",
  },
  [`&.${classes.orderNew}`]: {
    borderLeft: `3px solid #388E3D`,
    borderRadius: `3px`,
    backgroundColor: "#F5F9F5",
    "&:hover": {
      backgroundColor: "#F5F9F5",
    },
  },
  [`&.${classes.note}`]: {
    borderLeft: `3px solid #6A6D78`,
    borderRadius: `3px`,
    backgroundColor: "#383838",
    "&:hover": {
      backgroundColor: "#383838",
    },
  },
  [`&.${classes.orderCompleted}`]: {
    borderLeft: `3px solid #3362DA`,
    borderRadius: `3px`,
    backgroundColor: "#F5F7FD",
    "&:hover": {
      backgroundColor: "#F5F7FD",
    },
  },
  [`&.${classes.orderRemote}`]: {
    borderLeft: `3px solid #F3A26B`,
    borderRadius: `3px`,
    backgroundColor: "#FEFAF7",
    "&:hover": {
      backgroundColor: "#FEFAF7",
    },
  },
  [`&.${classes.orderReady}`]: {
    borderLeft: `3px solid #F7B500`,
    borderRadius: `3px`,
    backgroundColor: "#FEFBF2",
    "&:hover": {
      backgroundColor: "#FEFBF2",
    },
  },
  [`&.${classes.orderNotEnough}`]: {
    borderLeft: `3px solid #B70625`,
    borderRadius: `3px`,
    backgroundColor: "#FBF2F4",
    "&:hover": {
      backgroundColor: "#FBF2F4",
    },
  },
  [`&.${classes.orderNote}`]: {
    borderLeft: `3px solid #388E3D`,
    borderRadius: `3px`,
    backgroundColor: "#F5F9F5",
    "&:hover": {
      backgroundColor: "#F5F9F5",
    },
  },

  [`&.${classes.mediumPriorityAppointment}`]: {
    borderLeft: `3 solid #0000FF`,
  },
  [`&.${classes.lowPriorityAppointment}`]: {
    borderLeft: `3px solid #4B0082`,
  },
  [`&.${classes.toolTip}`]: {
    cursor: `pointer`,
  },
  [`& .${classes.headerText}`]: {
    color: "#3362DA",
  },
  [`& .${classes.text}`]: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "11px",
    color: darkGray,
  },
  [`& .${classes.content}`]: {
    color: "#000",
  },
  [`& .${classes.edited}`]: {
    fontSize: "10px",
    color: "#A1A4AC",
  },

  [`& .${classes.container}`]: {
    width: "100%",
    lineHeight: 1.2,
    height: "100%",
    textAlign: "left",
    display: `flex`,
    flexDirection: `column`,
    gap: `10px`,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  [`&.${classes.button}`]: {
    color: theme.secondary,
    padding: 0,
  },
}));

export const Appointment = ({
  data,
  onClick,
  toggleVisibility,
  onAppointmentMetaChange,
  currentViewName,
  ...restProps
}) => {
  const triggerRef = React.useRef();
  const dispatch = useDispatch();
  const connectedOrderRef = React.useRef();
  const [isActive, setIsActive] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isOpenPurchaseModal, setIsOpenPurchaseMoal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleClose = () => {
    if (triggerRef.current && triggerRef.current.close) {
      triggerRef.current.close();
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose);
    };
  }, []);

  //handle Delete Note
  const handleDeleteNote = () => {
    let payload = {
      note_id: data?.uuid,
    };
    setDeleteLoading(true);
    deleteNote(payload)
      .then((res) => {
        setDeleteLoading(false);
        setIsDelete(false);
        const payload = {
          status: "",
          date: "",
          duration: "week",
        };
        dispatch(getOrdersList(payload));
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error?.response?.data) {
          console.log(error?.response?.data?.message);
        }
      });
  };

  const clasNames = {
    status: `${
      data?.status === "new"
        ? "text-success"
        : data?.status === "complete"
        ? "text-[#3362DA]"
        : data?.status === "remote"
        ? "text-[#F3A26B]"
        : data?.status === "ready"
        ? "text-[#F7B500]"
        : data?.status === "not_enough"
        ? "text-danger"
        : data?.status === "note"
        ? "text-success"
        : "#388E3D"
    }`,
  };

  return (
    <React.Fragment>
      {data?.type !== "general" ? (
        <StyledAppointmentsAppointment
          {...restProps}
          className={classNames({
            [classes.orderNew]: data.status === "new",
            [classes.orderCompleted]: data.status === "complete",
            [classes.orderRemote]: data.status === "remote",
            [classes.orderReady]: data.status === "ready",
            [classes.orderNote]: data.status === "note",
            [classes.orderNotEnough]: data.status === "not_enough",
            [classes.appointment]: true,
          })}
          data={data}>
          <div className={classes.container}>
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <TripOriginIcon
                  fontSize="small"
                  className={`${clasNames.status} text-[16px]`}
                />
                <div className={clasNames.status}>
                  {`IN - ${dayjs(data?.time, "HH:mm:ss").format("HH:mmA")}`}
                </div>
              </div>
              <div>
                {data?.hasConnectedOrders === 0 && (
                  <StyledIconButton
                    className={classes.button}
                    size="large"
                    onClick={() => setIsActive(true)}>
                    <SyncAltIcon className="text-secondaryColor text-[17px] mr-[3px]" />
                  </StyledIconButton>
                )}

                {/* Tool Tip */}
                <Whisper
                  trigger="click"
                  placement="autoVerticalEnd"
                  ref={triggerRef}
                  className="rounded-[4px]"
                  speaker={
                    <Popover
                      id="custom-tooltip-appointment"
                      visible
                      className="bg-dark p-[5px] ml-[5px] rounded-lg">
                      <AppointmentToolTipContent data={data} />
                    </Popover>
                  }>
                  <StyledIconButton className={classes.button} size="large">
                    <InfoIcon className="text-secondaryColor text-[17px]" />
                  </StyledIconButton>
                </Whisper>
              </div>
            </div>
            <div className="text-[black] font-[500]">
              {data?.blendOrder &&
                data?.blendOrder?.kit?.kit_name +
                  "-" +
                  data?.blendOrder?.quantity}
              {data?.productionOrder &&
                data?.productionOrder?.kit?.kit_name +
                  "-" +
                  data?.productionOrder?.quantity}
              {data?.shippingOrder && data?.customer?.name}
              {/* {data?.recieveingOrder &&
                data?.recieveingOrder?.received_from +
                  "-" +
                  data?.recieveingOrder?.quantity} */}
              {data?.recieveingOrder && data?.customer?.name}
            </div>
            {/* body */}
            <div className={`flex flex-col gap-1`}>
              <div className={classes.text}>
                TRK : <span className="text-[black]">{data.TRK}</span>
              </div>
              <div className={classes.text}>
                REL : <span className="text-[black]">{data?.releaseNo}</span>
              </div>
              <div className={classes.text}>
                PO :{" "}
                {currentViewName === "Day" ? (
                  <span
                    className="cursor-pointer text-primaryColor"
                    onClick={() => setIsOpenPurchaseMoal(!isOpenPurchaseModal)}>
                    {data?.poNumber}
                  </span>
                ) : (
                  <span className="text-black">{data?.poNumber}</span>
                )}
              </div>
            </div>
            <div className={classes.edited}>
              Edited by :{" "}
              <span className={classes.headerText}>
                {data?.updatedBy}{" "}
                {dayjs(data?.updatedAt).format("DD/MM HH:mma")}
              </span>
            </div>
          </div>
          {/* PO Modal */}
          <PurchaseOrderModal
            isOpenPurchaseModal={isOpenPurchaseModal}
            setIsOpenPurchaseMoal={setIsOpenPurchaseMoal}
            data={data}
          />
          {/* CO Modal */}
          <ConnectedOrdersModal
            isActive={isActive}
            data={data}
            ref={connectedOrderRef}
            setIsActive={setIsActive}
          />
        </StyledAppointmentsAppointment>
      ) : (
        <StyledAppointmentsAppointment
          {...restProps}
          className={classNames({
            [classes.note]: "note",
            [classes.appointment]: true,
          })}
          // style={{ height: "140px" }}
          data={data}>
          {/* Delete Note Modal */}
          <AssignDeleteModal
            open={isDelete}
            setOpen={setIsDelete}
            headTitle="Delete Note"
            warningMsg=""
            confirmationPrompt={data?.note?.replaceAll(/<[^>]*>/g, "")}
            onClose={() => setIsDelete(false)}
            onDelete={() => handleDeleteNote()}
            loading={deleteLoading}
          />

          <div className={classes.container}>
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <TripOriginIcon
                  fontSize="small"
                  sx={{
                    color: white,

                    fontSize: "16px",
                  }}
                />
                <div className="text-white text-xs font-light">
                  {`NOTE - ${dayjs(data?.time, "HH:mm:ss").format("HH:mmA")}`}
                </div>
              </div>
              <div>
                {/* Delete */}
                <Delete
                  className="text-white cursor-pointer"
                  color=""
                  fontSize="small"
                  onClick={() => setIsDelete(!isDelete)}
                />
              </div>
            </div>

            <div className="text-white font-[400] text-xs">
              {/* {data?.note?.replaceAll(/<[^>]*>/g, "")} */}
              {parse(data?.note)}
            </div>

            <div className={classes.edited}>
              Edited by :{" "}
              <span className={classes.headerText}>
                {data?.updatedBy}{" "}
                {dayjs(data?.updatedAt).format("DD/MM HH:mma")}
              </span>
            </div>
          </div>
        </StyledAppointmentsAppointment>
      )}
    </React.Fragment>
  );
};

//StyledAppointmentsAppointmentContent not Use
const StyledAppointmentsAppointmentContent = styled(
  Appointments.AppointmentContent
)(({ theme: { palette } }) => ({
  [`& .${classes.headerText}`]: {
    color: "#3362DA",
  },
  [`& .${classes.text}`]: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "11px",
    color: darkGray,
  },
  [`& .${classes.content}`]: {
    color: "#000",
  },
  [`& .${classes.edited}`]: {
    fontSize: "10px",
    color: "#A1A4AC",
  },

  [`& .${classes.container}`]: {
    width: "100%",
    lineHeight: 1.2,
    height: "100%",
    textAlign: "left",
  },
}));

//AppointmentContent not Use
export const AppointmentContent = ({
  data,
  toggleVisibility,
  onAppointmentMetaChange,
  ...restProps
}) => {
  return (
    <StyledAppointmentsAppointmentContent {...restProps} data={data}>
      <div className={`flex flex-col gap-2.5 ${classes.container}`}>
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <TripOriginIcon
              fontSize="small"
              sx={{
                color:
                  data?.status === "new"
                    ? "#388E3D"
                    : data?.status === "complete"
                    ? "#3362DA"
                    : data?.status === "remote"
                    ? "#F3A26B"
                    : data.status === "ready"
                    ? "#F7B500"
                    : "gray",
                fontSize: "16px",
              }}
            />
            <div
              style={{
                color:
                  data?.status === "new"
                    ? "#388E3D"
                    : data?.status === "complete"
                    ? "#3362DA"
                    : data?.status === "remote"
                    ? "#F3A26B"
                    : data.status === "ready"
                    ? "#F7B500"
                    : "gray",
              }}>
              {`IN - ${dayjs(data?.time, "HH:mm:ss").format("HH:mmA")}`}
            </div>
          </div>
          <div
          // onClick={({ target }) => {
          //   toggleVisibility();
          //   onAppointmentMetaChange({
          //     target: target.parentElement.parentElement,
          //     data,
          //   });
          // }}
          >
            <InfoIcon sx={{ color: secondaryColor, fontSize: "16px" }} />
          </div>
        </div>
        <div className="text-[black] font-[500]">
          {data?.blendOrder &&
            data?.blendOrder?.kit + "-" + data?.blendOrder?.quantity}
          {data?.productionOrder &&
            data?.productionOrder?.kit + "-" + data?.productionOrder?.quantity}
        </div>
        <div className={`flex flex-col gap-1`}>
          <div className={classes.text}>
            TRK : <span className="text-[black]">{data.TRK}</span>
          </div>
          <div className={classes.text}>
            REL : <span className="text-[black]">{data?.releaseNo}</span>
          </div>
          <div className={classes.text}>
            PO : <span className="text-[black]">{data?.poNumber}</span>
          </div>
        </div>
        <div className={classes.edited}>
          Edited by :{" "}
          <span className={classes.headerText}>
            {data?.updatedBy} {dayjs(data?.updatedAt).format("DD/MM HH:mma")}
          </span>
        </div>
      </div>
    </StyledAppointmentsAppointmentContent>
  );
};
