// Library Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Delete from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

//Local Imports
import {
  CustomModal,
  Button,
  Typography,
} from "../../../../../shared";
import { deleteCarrier } from "../../../../../api/carriersApi";
import { GetCarriersListing } from "../../../../../redux/carriers/selectors";
import { getCarriers } from "../../../../../redux/carriers/actions";
import { black, primaryColor } from "../../../../../helpers/GlobalVariables";
import { PopoverDelete, PopoverEdit, SettingsPopover } from "../../../../../helpers/TableUtilities";
import { AssignDeleteModal } from "../../../../../helpers/AssignDeleteModal";

export const ManageCarrier = (restProps, setDeleteAlert, setSelectionIds) => {
  const id = restProps.row.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carrier = restProps.row.completeItem;

  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  let carriersList = GetCarriersListing();
  carriersList = carriersList?.filter(
    (item) => item?.uuid !== restProps?.row?.completeItem?.uuid
  );
  const [assignCarrier, setAssignCarrier] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  const handleOnChange = (event) => {
    if (event.target.name === "assingCarrier") {
      setAssignCarrier(event.target.value);
      setIsEmpty(false);
    }
  };

  const validate = () => {
    if (assignCarrier === "") {
      setIsEmpty(true);
      return true;
    } else {
      return false;
    }
  };

  const handleDelete = () => {
    let payload = {
      id: restProps.row.uuid,
      shipper_reassign: assignCarrier,
    };

    if (!validate()) {
      setDeleteLoading(true);
      deleteCarrier(payload)
        .then((res) => {
          setSelectionIds([]);
          dispatch(getCarriers({ status: "", search: "", external_id: "" }));
          setDeleteAlert(true);
          setDeleteLoading(false);
        })
        .catch((error) => {
          setDeleteLoading(false);
          setIsError(error?.response?.data?.message);
          // setError(error?.shipper_reassign[0]);
        });
    }
  };

  const handleCancelDelete = () => {
    setIsDelete(false);
    setAssignCarrier("");
    setSelectionIds([]);
    setIsError("");
    setIsEmpty(false);
    setAssignCarrier("");
    dispatch(getCarriers({ status: "", search: "", external_id: "" }));
  };

  return (
    <div>
      <AssignDeleteModal
        open={isDelete}
        setOpen={setIsDelete}
        headTitle="Delete Shipper"
        warningMsg=""
        confirmationPrompt={<span>Before you can delete <b>'{restProps.row.shipperName}'</b>, you must first reassign their products to another shipper:</span>}
        onClose={handleCancelDelete}
        onDelete={() => {
          handleDelete();
          setIsError("");
        }}
        loading={deleteLoading}
        errorMsg={isError}
      >
        <div className="form-row mx-4">
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              className={`${isEmpty ? "text-danger" : primaryColor}`}>
              Assign Shipper
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={assignCarrier}
              label="Assign Shipper"
              name="assingCarrier"
              color={isEmpty ? "danger" : "primary"}
              onChange={handleOnChange}
              error={
                isEmpty
                  ? "Please assign a shipper before deleting selected one."
                  : ""
              }>
              {carriersList.map((item, index) => {
                return (
                  <MenuItem value={item.uuid} key={index}>
                    {item.shipperName}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText className="text-danger">
              {isEmpty &&
                "Please assign a shipper before deleting selected one."}
            </FormHelperText>
          </FormControl>
        </div>
      </AssignDeleteModal>

      <SettingsPopover id={id}>
        <PopoverEdit
          onClick={() =>
            navigate(`/supply-chain/edit-carrier/${id}`, {
              state: { carrier: carrier },
            })} />
        <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />
      </SettingsPopover>
    </div>
  );
};
