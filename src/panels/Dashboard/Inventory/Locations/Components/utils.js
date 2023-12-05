// Library Imports
import React, { useState } from "react";
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
import { CustomModal, Button } from "../../../../../shared";
import * as Action from "../../../../../redux/locations/selectors";
import { black, primaryColor } from "../../../../../helpers/GlobalVariables";
import { deleteLocations } from "../../../../../api/locationsApi";
import {
  PopoverDelete,
  PopoverEdit,
  PopoverViewDetails,
  PopoverPrint,
  SettingsPopover,
} from "../../../../../helpers/TableUtilities";
import { AssignDeleteModal } from "../../../../../helpers/AssignDeleteModal";

export const ManageLocation = (
  restProps,
  facilityUser,
  previewBarcode,
  getlocationListing,
  setDeleteAlert
) => {
  const id = restProps.row.id;
  let navigate = useNavigate();
  const location = restProps.row.completeItem;
  const [isDelete, setIsDelete] = useState(false);
  const [isOpen, setIsopen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  let locations = Action.GetLocations();
  locations = locations?.filter(
    (item) => item?.uuid !== restProps?.row?.completeItem?.uuid
  );
  const [assignLocation, setAssignLocation] = useState("");
  const [showDeleteError, setShowDeleteError] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  const handleOnChange = (event) => {
    if (event.target.name === "assingLocation") {
      setAssignLocation(event.target.value);
      setIsEmpty(false);
    }
  };

  const validate = () => {
    if (assignLocation === "") {
      setIsEmpty(true);
      return true;
    } else {
      return false;
    }
  };

  // From Manage Options Delete Location
  const handleDelete = (uuid, setDeleteLoading) => {
    let payload = {
      location_id: location?.uuid,
      location_reassign_id: assignLocation,
    };

    deleteLocations(payload)
      .then((res) => {
        setIsDelete(false);
        setDeleteLoading(false);
        getlocationListing();
        setDeleteAlert(true);
      })
      .catch((error) => {
        setDeleteLoading(false);
        console.log("error", error?.response?.data?.message);
        setShowDeleteError(error?.response?.data?.message);
      });
  };

  return (
    <React.Fragment>
      <AssignDeleteModal
        open={isDelete}
        setOpen={setIsDelete}
        headTitle="Delete Location"
        warningMsg=""
        confirmationPrompt={<span>Before you delete <b>"{restProps?.row?.completeItem?.name}"</b>, you must first reassign the location on schedule items:</span>}
        onClose={() => {
          setIsDelete(false);
          setAssignLocation("");
          setShowDeleteError("");
          setIsEmpty(false);
        }}
        onDelete={() => {
          !validate() && setDeleteLoading(true);
          !validate() &&
            handleDelete(
              restProps.row.completeItem.uuid,
              setDeleteLoading
            );
        }}
        loading={deleteLoading}
        errorMsg={showDeleteError}
      >
        <div className="my-3 mx-4">
          <div className="form-row mt-2">
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                className={`${isEmpty ? "text-danger" : primaryColor}`}>
                Assign Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={assignLocation}
                label="Assign Location"
                name="assingLocation"
                color={isEmpty ? "danger" : "primary"}
                onChange={handleOnChange}
                error={
                  isEmpty
                    ? "Please assign a location before deleting selected one."
                    : ""
                }>
                {locations.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.uuid}>
                      {item.location}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText className="text-danger">
                {isEmpty &&
                  "Please assign a location before deleting selected one."}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
      </AssignDeleteModal>


      <SettingsPopover id={id}>
        <PopoverViewDetails
          onClick={() => previewBarcode(location)}
          text="Preview Barcode"
        />
        <PopoverPrint
          onClick={() => setIsopen(!isOpen)}
          text="Print Location"
        />
        {facilityUser ? (
          ""
        ) : (
          <>
            <PopoverEdit
              onClick={() =>
                navigate(`/inventory/edit-location/${id}`, {
                  state: { location: location },
                })
              }
              text="Print Location"
            />
            <PopoverDelete
              onClick={() => setIsDelete(!isDelete)}
              text="Delete"
            />
          </>
        )}
      </SettingsPopover>
    </React.Fragment>
  );
};
