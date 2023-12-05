import React from "react";
import {
  Button,
  CustomModal,
  TextField,
  Typography,
} from "../../../../../../../shared";
import { Add, Clear } from "@mui/icons-material";

export const ShippingInfoModal = ({
  openShippingInfoModal,
  setOpenShippingInfoModal,
  shippingInfoDetails,
  handleShippingChange,
  shippingDetailsEmpty,
  saveShippingInfoDetail,
  handleCancelShippingInfo,
  isLoading,
  shippingInfoError,
}) => {
  return (
    <CustomModal open={openShippingInfoModal} width={window.innerWidth * 0.4}>
      <div className="mx-3">
        {/* Header Row */}
        <div className="d-flex flex-row justify-content-between align-items-center ">
          <div className="flex">
            <Add className="mr-1" fontSize="small" color="primary" />
            Add Shipping Info
          </div>

          <div className="pointer" onClick={() => handleCancelShippingInfo()}>
            <Clear color="secondary" fontSize="small" />
          </div>
        </div>{" "}
        <div className="flex flex-col gap-3 mt-4 mb-4">
          <TextField
            fullWidth
            size="small"
            label="Pallet Count"
            name="palletCount"
            type={"text"}
            value={shippingInfoDetails.palletCount}
            onChange={handleShippingChange}
            helperText={
              shippingDetailsEmpty?.palletCount
                ? "Pallet Count is required"
                : ""
            }
            error={shippingDetailsEmpty?.palletCount ? true : false}
          />
          <TextField
            fullWidth
            size="small"
            label="Pallet Weight"
            name="palletWeight"
            type={"text"}
            value={shippingInfoDetails.palletWeight}
            onChange={handleShippingChange}
            helperText={
              shippingDetailsEmpty?.palletWeight
                ? "Pallet Weight is required"
                : ""
            }
            error={shippingDetailsEmpty?.palletWeight ? true : false}
          />
          <TextField
            fullWidth
            size="small"
            label="Tracking Number"
            name="trackingNumber"
            type={"text"}
            value={shippingInfoDetails.trackingNumber}
            onChange={handleShippingChange}
            helperText={
              shippingDetailsEmpty?.trackingNumber
                ? "Tracking Number is required"
                : ""
            }
            error={shippingDetailsEmpty?.trackingNumber ? true : false}
          />

          <TextField
            fullWidth
            size="small"
            label="Customer Notes"
            name="customerNotes"
            type={"text"}
            value={shippingInfoDetails.customerNotes}
            onChange={handleShippingChange}
            helperText={
              shippingDetailsEmpty?.customerNotes
                ? "Customer Notes is required"
                : ""
            }
            error={shippingDetailsEmpty?.customerNotes ? true : false}
          />
        </div>
        {shippingInfoError && (
          <Typography className="text-danger text-[16px] -mt-4">
            {shippingInfoError}
          </Typography>
        )}
        <div className=" mt-1 mb-4 flex items-center gap-2 justify-end">
          <Button
            className="capitalize "
            component="span"
            color="secondary"
            variant="outlined"
            onClick={() => handleCancelShippingInfo()}>
            Cancel
          </Button>
          <Button
            startIcon={<Add />}
            className="capitalize "
            component="span"
            color="primary"
            variant="contained"
            loading={isLoading}
            onClick={() => saveShippingInfoDetail()}>
            Add Shipping Info
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export const ProductionExtraModal = ({
  isOpenProductionExtra,
  setIsOpenProductionExtra,
}) => {
  return (
    <CustomModal open={isOpenProductionExtra} width={window.innerWidth * 0.4}>
      <div className="mx-3">
        {/* Header Row */}
        <div className="d-flex flex-row justify-content-between align-items-center ">
          <div className="flex">
            <Add className="mr-1" fontSize="small" color="primary" />
            Add Direct Material
          </div>

          <div
            className="pointer"
            onClick={() => setIsOpenProductionExtra(false)}>
            <Clear color="secondary" fontSize="small" />
          </div>
        </div>{" "}
        <div className="flex flex-col gap-3 mt-4 mb-4">
          <TextField
            fullWidth
            size="small"
            label="Pallet Count"
            name="palletCount"
          />
        </div>
        <div className="mt-4 mb-4 flex items-center gap-2 justify-end">
          <Button
            className="capitalize "
            component="span"
            color="secondary"
            variant="outlined"
            // disabled={loading}
            onClick={() => setIsOpenProductionExtra(false)}>
            Cancel
          </Button>
          <Button
            startIcon={<Add />}
            className="capitalize "
            component="span"
            color="primary"
            variant="contained"
            // disabled={loading}
          >
            Add Direct Material
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};
