// Library Imports
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
// Local Imports
import {
  CustomModal,
  Button as Lbutton,
} from "../../../../../shared";
import { GetShipToListing } from "../../../../../redux/shipTo/selectors";
import { getShipTo } from "../../../../../redux/shipTo/actions";
import { deleteShipTo } from "../../../../../api/shipToApi";
import { PopoverDelete, PopoverEdit, SettingsPopover } from "../../../../../helpers/TableUtilities";
import { AssignDeleteModal } from "../../../../../helpers/AssignDeleteModal";

export const ManageShipTo = (restProps, setSelectionIds, setDeleteAlert) => {
  const id = restProps.row.id;
  const shipTo = restProps.row.completeItem;
  const dispatch = useDispatch();
  let shipToList = GetShipToListing();
  shipToList = shipToList?.filter(
    (item) => item?.uuid !== restProps?.row?.completeItem?.uuid
  );
  const navigate = useNavigate();
  const [assingShipTo, setAssignShipTo] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState();
  const [isError, setIsError] = useState("");
  const [error, setError] = useState(false);

  const handleOnChange = (event) => {
    if (event.target.name === "assingShipTo") {
      setAssignShipTo(event.target.value);
      setIsEmpty(false);
      setError(false);
    }
  };

  const validate = () => {
    if (assingShipTo === "") {
      setIsEmpty(true);
      return true;
    } else {
      return false;
    }
  };

  const handleDelete = () => {
    let payload = {
      id: restProps?.row?.uuid,
      ship_to_reassign: assingShipTo,
    };
    if (!validate()) {
      setDeleteLoading(true);
      deleteShipTo(payload)
        .then((res) => {
          setDeleteAlert(true);
          setSelectionIds([]);
          setDeleteLoading(false);
          dispatch(
            getShipTo({
              status: "",
              search: "",
              shipto_ids: "",
              external_id: "",
            })
          );
        })
        .catch((error) => {
          setDeleteLoading(false);
          if (error?.response?.data) {
            setError(true);
            setIsError(error?.response?.data?.message);
          }
        });
    }
  };

  //Handle Cancel
  const handleCancelDelete = () => {
    setIsDelete(false);
    setAssignShipTo("");
    setSelectionIds([]);
    dispatch(
      getShipTo({ status: "", search: "", shipto_ids: "", external_id: "" })
    );
  };
  return (
    <div>
      <AssignDeleteModal
        open={isDelete}
        setOpen={setIsDelete}
        headTitle="Delete ShipTo"
        warningMsg=""
        confirmationPrompt={<span>Before you can delete <b>'{restProps.row.shipToName}'</b> you must first reassign to another:</span>}
        onClose={handleCancelDelete}
        onDelete={() => handleDelete()}
        loading={deleteLoading}
      >
        <div className="form-row mx-4">
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              className={`${isEmpty ? "text-danger" : error ? "text-danger" : "unset"
                } `}>
              Assign ShipTo
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={assingShipTo}
              label="Assign ShipTo"
              name="assingShipTo"
              className={`${isEmpty ? "text-danger" : error ? "text-danger" : "unset"
                } `}
              onChange={handleOnChange}
              error={
                isEmpty
                  ? "Please assign ShipTo before deleting selected one."
                  : error
                    ? isError
                    : ""
              }>
              {shipToList.map((item, index) => {
                return (
                  <MenuItem value={item.uuid} key={index}>
                    {item.shipToName}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText className="text-danger">
              {isEmpty
                ? "Please assign ShipTo before deleting selected one."
                : error
                  ? isError
                  : ""}
            </FormHelperText>
          </FormControl>
        </div>
      </AssignDeleteModal>

      <SettingsPopover id={id}>
        <PopoverEdit
          onClick={() =>
            navigate(`/supply-chain/edit-shipto/${id}`, {
              state: { shipTo: shipTo },
            })} />
        <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />
      </SettingsPopover>
    </div>
  );
};
