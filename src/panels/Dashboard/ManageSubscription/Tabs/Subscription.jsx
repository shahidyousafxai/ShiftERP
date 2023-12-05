// Library Imports
import { Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import ClearIcon from "@mui/icons-material/Clear";
//Local Imports
import {
  Button as Lbutton,
  DatePicker,
  CustomModal,
  TextField,
  RadioButton as Radio,
} from "../../../../shared";
import { pauseCancelSub } from "../../../../api/provisionAccountsApi.js";
import { logoutUser } from "../../../../helpers/GlobalMethods";
import { userLogout } from "../../../../redux/users/user.actions.js";
import { lightGray } from "../../../../helpers/GlobalVariables";

const Subscription = ({
  provisionDetails,
  handleOnChange,
  handleDateChange,
  handleOnFocus,
  subscriptions,
  setProvisionDetails,
  provisionDetailsEmpty,
  previousData,
}) => {
  const dispatch = useDispatch();

  const [modal, toggleModal] = useState(false);
  const [deleteModal, toggleDeleteModal] = useState(false);

  const currentSubscription =
    previousData?.Subscription_details[0]?.Subscription?.name;
  const [subscription, setSubscription] = useState(currentSubscription);

  const [date, setDate] = useState("");
  const [cycles, setCycles] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const subPauseCancelAction = (from) => {
    setCancelLoading(true);
    let payload = {
      status: from,
      provision_account_id: previousData?.uuid,
      pause_start_date: date !== "" ? date.toLocaleDateString() : date,
      pause_months: cycles,
    };
    pauseCancelSub(payload)
      .then((res) => {
        setCancelLoading(false);
        toggleModal(false);
        logoutUser().then((res) => {
          dispatch(userLogout());
        });
      })
      .catch((err) => {
        setDate("");
        setCycles("");
        setCancelLoading(false);
      });
  };

  const Buttons = () => {
    return (
      <div className="pl-8 pt-2 w-full">
        <div className="text-sm text-darkGray">
          Next Billing Date:{" "}
          <span className="text-black">{/* {active.nextBillingDate} */}</span>
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <span
            className="text-sm text-danger cursor-pointer"
            onClick={() => toggleDeleteModal(true)}>
            Cancel Subscription
          </span>
          <Lbutton
            size="medium"
            className="capitalize"
            component="span"
            color="primary"
            variant="contained"
            onClick={() => toggleModal(true)}>
            Pause Subscription
          </Lbutton>
        </div>
      </div>
    );
  };

  const SubscriptionView = () => {
    return (
      <div className="flex items-stretch justify-center gap-0">
        {/* Left Side View */}
        <div className="w-full items-stretch flex flex-col justify-between pt-[20px] px-[20px]">
          <div className="px-3 py-3 border h-full rounded bg-white pb-0.5">
            <p className="mb-4 text-base font-semibold">Choose Subscription</p>

            {/* Basic Subscription */}
            <div className="form-row mb-3">
              <div
                className={`flex flex-col border-[1px] p-3 rounded 
          ${
            subscription === "Basic License" &&
            "bg-primaryColor/10 border-primaryColor"
          }
           justify-between items-center w-full`}
                onClick={() => setSubscription("Basic License")}>
                {/* Subscription Info */}
                <div className="flex flex-row items-center justify-between w-full">
                  <Radio
                    label={subscriptions[0]?.name}
                    className="m-0 p-0 flex gap-4"
                    labelClassName={"before:mr-3"}
                    checked={subscription === "Basic License" ? true : false}
                    onChange={() => {
                      setSubscription("Basic License");
                      setProvisionDetails({
                        ...provisionDetails,
                        subscriptionID: subscriptions[0]?.uuid,
                      });
                    }}
                  />
                  <div className="text-darkGray text-[13px]">
                    <b className="text-charcoalBlack">
                      ${subscriptions[0]?.price_per_license}.00 /{" "}
                    </b>
                    Price Per License
                  </div>
                </div>

                {currentSubscription === "Basic License" && <Buttons />}
              </div>

              {/* Enterprise Subscription */}
              <div
                className={`flex flex-col border-[1px] p-3 mt-3 rounded 
          ${
            subscription === "Enterprise License" &&
            "bg-primaryColor/10 border-primaryColor"
          }
           justify-between items-center w-full`}
                onClick={() => setSubscription("Enterprise License")}>
                <div className="flex flex-row items-center justify-between w-full">
                  <Radio
                    label={subscriptions[1]?.name}
                    className="m-0 p-0 flex gap-4"
                    labelClassName={"before:mr-3"}
                    checked={
                      subscription === "Enterprise License" ? true : false
                    }
                    onChange={() => {
                      setSubscription("Enterprise License");
                      setProvisionDetails({
                        ...provisionDetails,
                        subscriptionID: subscriptions[1]?.uuid,
                      });
                    }}
                  />
                  <div className="text-darkGray text-[13px]">
                    <b className="text-charcoalBlack">
                      ${subscriptions[1]?.price_per_license}.00 /{" "}
                    </b>
                    Price Per License
                  </div>
                </div>

                {currentSubscription === "Enterprise License" && <Buttons />}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side View */}
        <div className="w-full h-full items-stretch flex flex-col justify-between pt-[20px] px-[20px]">
          <div className="border px-3 py-3 h-full rounded bg-white pb-0.5">
            <p className=" mb-4 text-base font-semibold">
              Subscription Details
            </p>
            <div className="form-row flex gap-3 pr-3 mb-3">
              <div className="col-md-6">
                <TextField
                  size="small"
                  label="User Limit"
                  type={"text"}
                  fullWidth
                  value={
                    subscription === "Basic License"
                      ? subscriptions[0]?.user_limit
                      : subscriptions[1]?.user_limit
                  }
                  name="userLimit"
                  disabled={true}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  size="small"
                  label="Facility Limit"
                  type="text"
                  fullWidth
                  value={
                    subscription === "Basic License"
                      ? subscriptions[0]?.facility_limit
                      : subscriptions[1]?.facility_limit
                  }
                  name="facilityLimit"
                  disabled={true}
                />
              </div>
            </div>
            <div className="form-row flex gap-3 pr-3 mb-3">
              <div className="col-md-6">
                <TextField
                  size="small"
                  label="Price Per License"
                  type="text"
                  fullWidth
                  value={
                    subscription === "Basic License"
                      ? subscriptions[0]?.price_per_license
                      : subscriptions[1]?.price_per_license
                  }
                  name="pricePerlicense"
                  disabled={true}
                />
              </div>
              <div className="col-md-6">
                <DatePicker
                  label="Recurring Billing Start Date"
                  fullWidth
                  size="small"
                  disablePast={true}
                  onChange={(e) => handleDateChange(e, "recBillingStartDate")}
                  name="recBillingStartDate"
                  value={provisionDetails.recBillingStartDate}
                />
              </div>
            </div>
            <div className="form-row flex gap-3 pr-3 mb-3">
              <div className="col-md-6">
                <TextField
                  label="Setup Fee"
                  fullWidth
                  size="small"
                  name="setupFee"
                  value={provisionDetails.setupFee}
                  onChange={handleOnChange}
                  onFocus={handleOnFocus}
                  helperText={
                    provisionDetailsEmpty?.setupFee
                      ? "Setup Fee is required"
                      : ""
                  }
                  error={provisionDetailsEmpty?.setupFee ? true : false}
                  disabled={true}
                />
              </div>
              <div className="col-md-6">
                <DatePicker
                  label="Setup Fee Billing Date"
                  fullWidth
                  size="small"
                  disablePast={true}
                  onChange={(e) => handleDateChange(e, "setupFeeStartDate")}
                  name="setupFeeStartDate"
                  value={provisionDetails.setupFeeStartDate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BillingView = () => {
    return (
      <div className="mx-[20px] my-3 px-3 py-3 border h-fit rounded bg-white pb-0.5">
        <p className="mb-3 text-base font-semibold">Billing History</p>

        <div className="px-3">
          <table className="bg-white text-black table-fixed w-full shadow-none">
            <thead>
              <tr className="border-b-2">
                <th className="w-[30%] text-darkGray text-[12px] font-[500]">
                  Billing Date
                </th>
                <th className=" w-[60%] text-darkGray text-[12px] font-[500]">
                  Amount
                </th>
                <th className=" w-[10%]  text-darkGray text-[12px] font-[500]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {previousData?.Subscription_histories?.length === 0 ? (
                <>
                  <div
                    style={{ width: window.innerWidth * 0.35 }}
                    className="flex flex-col items-center mt-3 pr-5">
                    <DescriptionIcon fontSize="large" color="secondary" />
                    <p className="mt-2 text-black text-[13px]">
                      No Billing History Found.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {previousData?.Subscription_histories?.map((item, index) => {
                    return (
                      <tr
                        style={{
                          backgroundColor:
                            index % 2 !== 0 ? lightGray : "white",
                        }}
                        key={index}>
                        <td className="py-2 w-[30%]">{item?.billed_date}</td>
                        <td className="py-2 w-[60%]">${item?.amount}</td>
                        <td className="py-2 w-[10%]">
                          <span className="text-success border-success border-[1px] mt-5 h-8 px-2 py-[6px] rounded-lg text-[13px] bg-success/10">
                            {item?.status === 0 ? "Unpaid" : "Paid"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const SowView = () => {
    return (
      <div className="mx-[20px] my-3 px-3 py-3 border h-fit rounded bg-white pb-0.5">
        <p className="mb-3 text-base font-semibold">SOW</p>

        <div className="px-3 max-h-96 overflow-y-scroll">
          <table
            className="bg-white text-black table-fixed w-full shadow-none"
            width="100%">
            <thead>
              <tr className="border-b-2">
                <th className="text-darkGray text-[13px] font-[500] w-[20%] pl-[10px]">
                  SOW Name
                </th>
                <th className="text-darkGray text-[13px] font-[500] w-[20%]">
                  ID
                </th>
                <th className="text-darkGray text-[13px] font-[500] w-[20%]">
                  Billing Date
                </th>
                <th className="text-darkGray text-[13px] font-[500]  w-[40%] text-right pr-[10px]">
                  Document
                </th>
              </tr>
            </thead>
            <tbody>
              {previousData?.Sow?.length === 0 ? (
                <React.Fragment>
                  <td colSpan="5" className="text-center pt-[20px]">
                    <DescriptionIcon fontSize="large" color="secondary" />
                    <p className="mt-2 text-black text-[13px]">No SOW added.</p>
                  </td>
                </React.Fragment>
              ) : (
                <>
                  {previousData?.Sow?.map((item, index) => {
                    return (
                      <tr
                        className="!rounded-[10px]"
                        style={{
                          backgroundColor:
                            index % 2 !== 0 ? lightGray : "white",
                        }}
                        key={index}>
                        <td className="py-2 text-[13px] pl-[10px] rounded-tl-[6px] rounded-bl-[6px]">
                          {item?.name}
                        </td>
                        <td className="py-2 text-[13px]">{index + 1}</td>
                        <td className=" py-2 text-[13px]">
                          {item?.billing_date}
                        </td>
                        <td className=" py-2 text-right rounded-tr-[6px] rounded-br-[6px]">
                          <a
                            className="cursor-pointer mr-[45px]"
                            href={item?.url}
                            target="_blank"
                            rel="noreferrer">
                            <InsertDriveFileIcon
                              color="primary"
                              className="me-2 fs-5 ml-4"
                            />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {/* Subscriptions Row */}
      <SubscriptionView />
      <div className="bg-bgGray">
        {/* Billing View */}
        <BillingView />

        {/* SOW View */}
        <SowView />
      </div>

      {/* Pause Subscription Modal */}
      <CustomModal
        open={modal}
        close={() => toggleModal(false)}
        title="Pause Subscription"
        padding={2}
        width={600}>
        <form>
          <div
            className="pointer position-absolute top-3 right-5"
            onClick={() => toggleModal(false)}>
            <ClearIcon color="secondary" fontSize="20px" />
          </div>
          <div className="d-flex gap-3 flex-column">
            <Typography
              id="modal-modal-description"
              fontSize={13}
              className="mb-3">
              The subscription will pause at the next billing period on Apr 03,
              2022. Set the number of billing cycles of skip..
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
              label="No of Cycles"
              fullWidth
              size="small"
              name="cycles"
              value={cycles}
              onChange={(e) => setCycles(e.target.value)}
            />
            <div className="buttons d-flex gap-3 justify-content-end">
              <Lbutton
                className="shadow-5 border border-[grey] text-darkGray capitalize px-[15px] py-[5px]"
                onClick={() => {
                  toggleModal(false);
                  setDate("");
                  setCycles("");
                }}>
                Cancel
              </Lbutton>
              <Lbutton
                className="capitalize bg-primaryColor"
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
              </Lbutton>
            </div>
          </div>
        </form>
      </CustomModal>

      {/* Cancel Subscription Modal */}
      <CustomModal
        open={deleteModal}
        close={() => toggleDeleteModal(false)}
        title="Cancel Subscription"
        padding={2}
        width={window.innerWidth * 0.4}>
        <div>
          <div
            className="pointer position-absolute top-3 right-5"
            onClick={() => toggleDeleteModal(false)}>
            <ClearIcon color="secondary" fontSize="20px" />
          </div>
          <div className="d-flex flex-column">
            <Typography
              className="d-flex flex-row align-items-center"
              variant="body1"
              fontSize={15}
              marginBottom={1}
              marginLeft={3}
              fontWeight="light">
              Are you sure you want to cancel subscription for
              <div className="fw-bold">'{provisionDetails.companyName}'</div>
              <div className="fw-light">?</div>
            </Typography>
            <div className="buttons d-flex justify-content-end">
              <Lbutton
                className="capitalize mr-[10px]"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={() => toggleDeleteModal(false)}>
                Close
              </Lbutton>
              <Lbutton
                component="span"
                className="capitalize text-white"
                color="danger"
                variant="contained"
                loading={cancelLoading}
                onClick={() => subPauseCancelAction("cancel")}>
                {!cancelLoading && "Cancel"}
              </Lbutton>
            </div>
          </div>
        </div>
      </CustomModal>
    </React.Fragment>
  );
};

export default Subscription;
