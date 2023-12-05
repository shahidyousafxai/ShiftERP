// Library Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Delete } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
// Local Imports
import { CustomModal, Button, Typography } from "../../../../../shared";
import { GetPricingListing } from "../../../../../redux/Pricing/selectors";
import { deletePricing } from "../../../../../api/pricingApi";
import { getPricing } from "../../../../../redux/Pricing/actions";
import { black } from "../../../../../helpers/GlobalVariables";

const DeleteModal = ({
  id,
  singleRowData,
  isDelete,
  setIsDelete,
  setDeleteAlert,
  setLoading,
  setSelectionIds,
  setFromModal,
}) => {
  //Navigation
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let pricingList = GetPricingListing();
  pricingList = pricingList?.filter((item) => item.uuid !== id);
  //States
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [assignPricingRule, setAssignPricingRule] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  // handle on change
  const handleOnChange = (event) => {
    if (event.target.name === "assignPricingRule") {
      setAssignPricingRule(event.target.value);
      setIsEmpty(false);
    }
  };

  // handle validation
  const validate = () => {
    if (assignPricingRule === "") {
      setIsEmpty(true);
      return true;
    } else {
      return false;
    }
  };

  // handle delete
  const handleDelete = () => {
    let payload = {
      pricing_uuid: id,
      pricing_reassign_uuid: assignPricingRule,
    };

    if (!validate()) {
      setDeleteLoading(true);
      deletePricing(payload)
        .then((res) => {
          setDeleteLoading(false);
          setIsDelete(false);
          setDeleteAlert(true);
          setSelectionIds([]);
          dispatch(getPricing({ status: "", search: "", price_type_uuid: "" }));
          setLoading(true);
          setFromModal(null);
        })
        .catch((error) => {
          setDeleteLoading(false);
          setIsError(error?.response?.data?.message);
          // setError(error?.shipper_reassign[0]);
          console.log("error", error);
        });
    }
  };

  // handle cancel delete
  const handleCancelDelete = () => {
    setIsDelete(false);
    setAssignPricingRule("");
    setSelectionIds([]);
    setIsError("");
    setAssignPricingRule("");
    setFromModal(null);
    dispatch(getPricing({ status: "", search: "", price_type_uuid: "" }));
  };

  return (
    <CustomModal
      open={isDelete}
      close={() => setIsDelete(!isDelete)}
      width={window.innerWidth * 0.4}>
      <div>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex flex-row justify-content-between align-items-center text-center font-bold">
            <div className="pointer">
              <Delete className="mx-3 mb-1" color="danger" fontSize="small" />
            </div>
            Delete Pricing Rule
          </div>
          <div className="pointer mx-3" onClick={handleCancelDelete}>
            <ClearIcon color="secondary" fontSize="small" />
          </div>
        </div>
        <div className="my-3 mx-4">
          {/* <Alert severity="info" icon={true}> */}
          <Typography
            variant="body1"
            fontSize={15}
            fontWeight="light"
            color={black}>
            Before you can delete
            <b> '{singleRowData?.name}'</b>, select a different Pricing Rule to
            use or{" "}
            <span
              className="!text-primaryColor cursor-pointer"
              onClick={() =>
                navigate("/accounting/pricing/add-new-pricing-rule", {
                  state: { fromModal: singleRowData },
                })
              }>
              add new pricing rule
            </span>
            :
          </Typography>
          {/* </Alert> */}
        </div>
        <div className="my-3">
          <div className="form-row mx-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Reassign Pricing Rule
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={assignPricingRule}
                label="Reasssign Pricing Rule"
                name="assignPricingRule"
                color={isEmpty ? "danger" : "primary"}
                onChange={handleOnChange}
                error={
                  isEmpty
                    ? "Please assign a Pricing Rule before deleting selected one."
                    : ""
                }>
                {pricingList.map((item, index) => {
                  return (
                    <MenuItem value={item.uuid} key={index}>
                      {item.pricingName}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText className="text-danger">
                {isEmpty &&
                  "Please assign to a Pricing Rule before deleting selected one."}
              </FormHelperText>
            </FormControl>
          </div>
          <Typography className="text-danger text-sm -mb-4 ml-6 py-2">
            {isError === "" ? "" : isError}
          </Typography>
          <div className="d-flex flex-row justify-content-end align-items-center mx-3 mt-4 mb-2">
            <Button
              component="span"
              color="secondary"
              className="capitalize mr-[10px]"
              variant="outlined"
              loading={deleteLoading}
              disabled={deleteLoading}
              onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button
              component="span"
              color="danger"
              className="capitalize text-white"
              variant="contained"
              loading={deleteLoading}
              disabled={deleteLoading}
              onClick={() => {
                handleDelete();
                setIsError("");
              }}>
              Delete And Reassign
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteModal;
