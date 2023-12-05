// Library Imports
import React, { useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import SettingsIcon from "@mui/icons-material/Settings";
import CancelIcon from "@mui/icons-material/Cancel";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import Popover from "rsuite/Popover";
import ClearIcon from "@mui/icons-material/Clear";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Typography } from "@mui/material";

// Local Imports
import { PopOver, CustomModal, Button, DatePicker, TextField } from "../../../shared"
import { pauseCancelSub } from "../../../api/provisionAccountsApi";
import Error from "@mui/icons-material/Error";

export const ErrorModal = (props) => {
  const { error, setError, errorMsg, setErrorMsg } = props;

  return (
    <CustomModal
      open={error ? true : false}
      close={() => {
        setError(!error);
        setErrorMsg("");
      }}
      width={window.innerWidth * 0.4}>
      <div>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="flex flex-row justify-between items-center text-center">
            <div className="pointer">
              <Error
                className="mx-3"
                color="danger"
                fontSize="small"
              />
            </div>
            <span>
              Error
            </span>
          </div>
          <div
            className="pointer mx-3"
            onClick={() => {
              setError(!error);
              setErrorMsg("");
            }}>
            <ClearIcon color="secondary" fontSize="small" />
          </div>
        </div>
        <div className="mb-3 mx-3">
          <Typography
            className="d-flex flex-row align-items-center"
            variant="body1"
            fontSize={15}
            marginBottom={1}
            marginTop={3}
            fontWeight="light">
            {errorMsg ? errorMsg : ""}
          </Typography>
          <div className="d-flex flex-row justify-content-end align-items-center mb-2">
            <Button
              className="capitalize mr-2.5"
              component="span"
              variant="outlined"
              color="secondary"
              onClick={() => {
                setError(!error);
                setErrorMsg("");
              }}
            >
              {"OK"}
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}


export const Status = (restProps) => {
  const text = restProps.row.status;
  return (
    <>
      {text === "in-processing" ? (
        <div className="d-flex justify-content-start">
          <TripOriginIcon className="me-1 fs-6 mt-[2px] text-secondaryColor" />
          In Processing
        </div>
      ) : text === "active" ? (
        <div className="d-flex justify-content-start">
          <CheckCircleRoundedIcon
            color="success"
            className="me-1 fs-6 mt-[2px]"
          />
          Active
        </div>
      ) : text === "pause" ? (
        <div className="d-flex justify-content-start">
          <TripOriginIcon className="me-1 fs-6 mt-[2px] text-danger" />
          Paused
        </div>
      ) : (
        <div className="d-flex justify-content-start">
          <TripOriginIcon className="me-1 fs-6 mt-[2px] text-danger" />
          Cancelled
        </div>
      )}
    </>
  );
};

export const ManageProvision = (
  restProps,
  previewSow,
  // getProvisionAccList,
  setPreviewSow,
  setSowModalData,
  setStatusSuccessAlert,
  setStatusSuccessMsg
) => {
  const id = restProps.row.id;

  const [activeModal, setActiveModal] = useState(false);
  const [pauseModal, setPauseModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [date, setDate] = useState("");
  const [cycles, setCycles] = useState("");

  const subPauseCancelAction = (from) => {
    setCancelLoading(true);
    let payload = {
      status: from,
      provision_account_id: restProps?.row?.provisionUUID,
      pause_start_date: date !== "" ? date.toLocaleDateString() : date,
      pause_months: cycles,
    };
    pauseCancelSub(payload)
      .then((res) => {
        setStatusSuccessMsg(res.data.message);
        setStatusSuccessAlert(true);
        setCancelLoading(false);
        setCancelModal(false);
      })
      .catch((error) => {
        setStatusSuccessMsg(error.response.data.message);
        setStatusSuccessAlert(true);
        setCancelLoading(false);
        setCancelModal(false);
      });
  };

  return (
    <div>
      {/* Active Subscription Modal */}
      <CustomModal
        open={activeModal}
        close={() => {
          setActiveModal(false);
          setCancelLoading(false);
        }}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex !pl-6 font-bold pt-2 flex-row justify-content-between align-items-center text-center">
              Activate Subscription
            </div>
            <div
              className="pointer position-absolute top-3 right-5"
              onClick={() => {
                setActiveModal(false);
                setCancelLoading(false);
              }}>
              <ClearIcon color="secondary" className="text-[20px]"/>
            </div>
          </div>
          <div className="my-3">
            <Typography
              className="mb-2"
              variant="body1"
              fontSize={15}
              marginBottom={1}
              marginTop={3}
              marginLeft={3}
              fontWeight="light">
              Are you sure you want to change subscription status of
              <span className="fw-bold ml-1">'{restProps.row.name}'</span>
              <span className="fw-light"> to "active"?</span>
            </Typography>
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2 gap-3">
              <Button
                size="medium"
                className="normal-case w-[90px]"
                component="span"
                variant="outlined"
                color="secondary"
                disabled={cancelLoading}
                onClick={() => setActiveModal(false)}>
                Close
              </Button>
              <Button
                className={`text-white bg-primaryColor normal-case ${cancelLoading ? "py-[17.5px] px-[20px]" : "py-[6px] px-[20px]"}`}
                component="span"
                variant="contained"
                loading={cancelLoading}
                disabled={cancelLoading}
                onClick={() => subPauseCancelAction("active")}>
                {!cancelLoading && "Renew Subscription"}
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Pause Subscription Modal */}
      <CustomModal
        open={pauseModal}
        close={() => {
          setPauseModal(false);
          setCancelLoading(false);
        }}
        title="Pause Subscription"
        padding={2}
        width={600}>
        <form>
          <div
            className="pointer position-absolute top-3 right-5"
            onClick={() => {
              setPauseModal(false);
              setCancelLoading(false);
            }}>
            <ClearIcon color="secondary" className="text-[20px]"/>
          </div>
          <div className="d-flex gap-3 flex-column">
            <Typography
              id="modal-modal-description"
              fontSize={13}
              className="mb-3">
              The subscription will pause at the next billing period. Set the
              number of weeks to skip..
            </Typography>
            <DatePicker
              label="Pause Start Date"
              fullWidth
              size="small"
              disablePast={true}
              onChange={(e) => setDate(e)}
              name="pauseDate"
              value={date}
            />
            <TextField
              label="No of Weeks"
              fullWidth
              size="small"
              name="cycles"
              value={cycles}
              onChange={(e) => setCycles(e.target.value)}
            />
            <div className="buttons d-flex gap-3 justify-content-end">
              <Button
                size="medium"
                className="normal-case w-[90px]"
                component="span"
                variant="outlined"
                color="secondary"
                disabled={cancelLoading}
                onClick={() => setPauseModal(false)}>
                Close
              </Button>
              <Button
                className="text-white bg-primaryColor normal-case py-[5px] px-[20px]"
                component="span"
                variant="contained"
                loading={cancelLoading}
                disabled={cancelLoading || date === "" || cycles === ""}
                onClick={() => {
                  if (date !== "" && cycles !== "") {
                    return subPauseCancelAction("pause");
                  }
                }}>
                {!cancelLoading && "Pause Subscription"}
              </Button>
            </div>
          </div>
        </form>
      </CustomModal>

      {/* Cancel Subscription Modal */}
      <CustomModal
        open={cancelModal}
        close={() => {
          setCancelModal(false);
          setCancelLoading(false);
        }}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex !pl-6 font-bold pt-2 flex-row justify-content-between align-items-center text-center">
              Cancel Subscription
            </div>
            <div
              className="pointer position-absolute top-3 right-5"
              onClick={() => {
                setCancelModal(false);
                setCancelLoading(false);
              }}>
              <ClearIcon color="secondary" className="text-[20px]"/>
            </div>
          </div>
          <div className="my-3">
            <Typography
              className="d-flex flex-row align-items-center"
              variant="body1"
              fontSize={15}
              marginBottom={1}
              marginTop={3}
              marginLeft={3}
              fontWeight="light">
              Are you sure you want to cancel subscription for
              <div className="fw-bold ml-[2px]">'{restProps.row.name}'</div>
              <div className="fw-light">?</div>
            </Typography>
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2 gap-3">
              <Button
                size="medium"
                className="normal-case w-[90px]"
                component="span"
                variant="outlined"
                color="secondary"
                disabled={cancelLoading}
                onClick={() => setCancelModal(false)}>
                Close
              </Button>
              <Button
                className={`text-white bg-primaryColor normal-case ${cancelLoading ? "py-[17.5px] px-[20px]" : "py-[6px] px-[20px]"}`}
                component="span"
                variant="contained"
                loading={cancelLoading}
                disabled={cancelLoading}
                onClick={() => subPauseCancelAction("cancel")}>
                {!cancelLoading && "Cancel Subscription"}
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>

      <PopOver
        classes="w-6"
        icon={true}
        children={
          <div className={`pointer ${id % 2 === 0 ? "bg-lightGray" : "bg-white"}`}>
            <SettingsIcon color="secondary" />
          </div>
        }
        placement="autoVerticalEnd"
        speaker={
          <Popover>
            <div className="flex flex-row justify-between">
              <div
                className="flex flex-col justify-center items-start">
                <div
                  onClick={() => {
                    setPreviewSow(!previewSow);
                    setSowModalData(restProps.row);
                  }}
                  className="me-4 my-1 pointer text-[14px]">
                  <InsertDriveFileIcon
                    className="me-1 mb-0.5 text-secondaryColor text-[20px]"
                  />
                  SOW
                </div>
                <div
                  onClick={() => setActiveModal(true)}
                  className="me-4 my-1 pointer text-[14px]">
                  <PlayCircleIcon
                    className="me-1 mb-0.4 text-secondaryColor text-[20px]"
                  />
                  Renew Subscription
                </div>
                <div
                  onClick={() => setPauseModal(true)}
                  className="me-4 my-1 pointer text-[14px]">
                  <PauseCircleIcon
                    className="me-1 mb-0.4 text-secondaryColor text-[20px]"
                  />
                  Pause Subscription
                </div>
                <div
                  onClick={() => setCancelModal(true)}
                  className="me-4 my-1 pointer text-[14px]">
                  <CancelIcon
                    className="me-1 mb-0.45 text-secondaryColor text-[20px]"
                  />
                  Cancel Subscription
                </div>
              </div>
            </div>
          </Popover>
        }
      />
    </div>
  );
};
