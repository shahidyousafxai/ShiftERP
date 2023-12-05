// Library Imports
import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";

// Local Imports
import {
  Button,
  DatePicker,
  CustomModal,
  RadioButton,
  TextField,
} from "../../../shared";

const Subscription = ({
  provisionDetails,
  handleOnChange,
  handleDateChange,
  handleOnFocus,
  subscriptions,
  setProvisionDetails,
  provisionDetailsEmpty,
}) => {
  const [modal, toggleModal] = useState(false);
  const [deleteModal, toggleDeleteModal] = useState(false);

  const [subscription, setSubscription] = useState("Basic license");

  useEffect(() => {
    if (subscription === "Basic license") {
      setProvisionDetails({
        ...provisionDetails,
        subscriptionID: subscriptions[0]?.uuid,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={12} lg={6}>
          <div className="w-full h-full flex items-stretch flex-col justify-between px-[20px] pt-[20px]">
            <div className="px-3 py-3 border h-full rounded bg-white pb-0.5">
              <p className="mb-4 text-base font-semibold">
                Choose Subscription
              </p>
              <div className="form-row mb-3">
                <div
                  className={`flex border-[1px] p-3 rounded ${
                    subscription === "Basic license" &&
                    "bg-primaryColor/10 border-primaryColor"
                  } justify-between items-center w-full`}>
                  <RadioButton
                    label={subscriptions[0]?.name}
                    className="m-0 p-0 flex gap-4"
                    labelClassName={"before:mr-3"}
                    checked={subscription === "Basic license" ? true : false}
                    onChange={() => {
                      setSubscription("Basic license");
                      setProvisionDetails({
                        ...provisionDetails,
                        subscriptionID: subscriptions[0]?.uuid,
                      });
                    }}
                  />
                  <div className="text-[13px] text-darkGray">
                    <b className="text-charcoalBlack">
                      ${subscriptions[0]?.price_per_license}.00 /{" "}
                    </b>
                    Price Per license
                  </div>
                </div>
                <div
                  className={`flex border-[1px] p-3 rounded mt-3
              ${
                subscription === "Enterprise license" &&
                "bg-primaryColor/10 border-primaryColor"
              }
               justify-between items-center w-full`}>
                  <RadioButton
                    label={subscriptions[1]?.name}
                    className="m-0 p-0 flex gap-4"
                    labelClassName={"before:mr-3"}
                    checked={
                      subscription === "Enterprise license" ? true : false
                    }
                    onChange={() => {
                      setSubscription("Enterprise license");
                      setProvisionDetails({
                        ...provisionDetails,
                        subscriptionID: subscriptions[1]?.uuid,
                      });
                    }}
                  />
                  <div className="text-[13px] text-darkGray">
                    <b className="text-charcoalBlack">
                      ${subscriptions[1]?.price_per_license}.00 /{" "}
                    </b>
                    Price Per license
                  </div>
                </div>

                {/* {active && active.id === el.id && (
                      <div className="pl-8 py-2 pr-0 w-full">
                        <div className="text-sm text-gray-500">
                          Next Billing Date:{" "}
                          <span className="text-black">
                            {active.nextBillingDate}
                          </span>
                        </div>
                        <div className="flex items-end justify-between w-full">
                          <span
                            className="text-sm  text-danger"
                            onClick={() => toggleDeleteModal(true)}>
                            Cancel Subscription
                          </span>
                          <Lbutton
                            size="medium"
                            style={{
                              textTransform: "none",
                              // width: "150px",
                            }}
                            component="span"
                            color="primary"
                            variant="contained"
                            onClick={() => toggleModal(true)}
                            // loading={loading}
                            // disabled={loading || isEmpty.imageSize}
                          >
                            Pause Subscription
                          </Lbutton>
                        </div>
                      </div>
                    )} */}
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <div className="w-full h-full flex flex-col justify-between px-[20px] pt-[20px] items-stretch">
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
                      subscription === "Basic license"
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
                    type={"text"}
                    fullWidth
                    value={
                      subscription === "Basic license"
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
                    label="Price Per license"
                    type={"text"}
                    fullWidth
                    value={
                      subscription === "Basic license"
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
        </Grid>
      </Grid>

      <CustomModal
        open={modal}
        close={() => toggleModal(false)}
        title="Pause Subscription"
        padding={2}
        width={600}>
        <form>
          <div className="pointer position-absolute top-3 right-5"></div>
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
              name="hireDate"
            />
            <TextField
              label="No of Cycles"
              fullWidth
              size="small"
              name="phoneNumber"
            />
            <div className="buttons d-flex gap-3 justify-content-end">
              <Button
                className="shadow-5 py-[5px] px-[15px] text-grey normal-case border-[1px] border-gray"
                onClick={() => toggleModal(false)}>
                Cancel
              </Button>
              <Button
                className={`py-[5px] px-[15px] text-white normal-case bg-primaryColor`}>
                Send Link
              </Button>
            </div>
          </div>
        </form>
      </CustomModal>
      <CustomModal
        open={deleteModal}
        close={() => toggleDeleteModal(false)}
        width={window.innerWidth * 0.4}>
        <div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex !pl-6 font-bold pt-2 flex-row justify-content-between align-items-center text-center">
              Cancel Subscription
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
              <div className="fw-bold">'AFI Packing'</div>
              <div className="fw-light">"?</div>
            </Typography>
            <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
              <Button
                className="capitalize mr-2.5"
                component="span"
                variant="outlined"
                color="secondary"
                onClick={() => toggleDeleteModal(false)}>
                Close
              </Button>
              <Button
                component="span"
                className="capitalize text-white"
                color="danger"
                variant="contained">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Subscription;
