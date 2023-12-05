/* eslint-disable no-template-curly-in-string */
// Library Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Local Imports
import { deleteKit } from "../../../../../api/kitsApi";
import {
  PopoverAlternative,
  PopoverDelete,
  PopoverEdit,
  SettingsPopover,
} from "../../../../../helpers/TableUtilities";
import { SimpleDeleteModal } from "../../../../../helpers/SimpleDeleteModal";

export const ManageKit = (
  restProps,
  setDeleteAlert,
  setSelectionIds,
  setSelectedKits,
  getKitsList,
  companyAdmin
) => {
  const id = restProps.row.id;
  const kit = restProps.row.completeItem;

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const handleDelete = (uuid, setDeleteLoading) => {
    let UUID = Array.isArray(uuid)
      ? uuid?.map((item) => {
          return item?.uuid;
        })
      : [uuid];
    setDeleteLoading(true);
    deleteKit({ ids: UUID })
      .then((res) => {
        setDeleteLoading(false);
        setIsDelete(false);
        setDeleteAlert(true);
        setSelectionIds([]);
        setSelectedKits([]);
        getKitsList();
      })
      .catch((error) => {
        setDeleteLoading(false);
        if (error?.response?.data) {
          setIsError(error?.response?.data?.message);
        }
      });
  };
  let navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);

  return (
    <div className="flex flex-row justify-start pr-16">
      <SimpleDeleteModal
        states={{
          open: isDelete,
          setOpen: setIsDelete,
          errorMsg: isError,
          setErrorMsg: setIsError,
          headTitle: "Delete Kit",
          deleteName: restProps.row.kit,
          loading: deleteLoading,
          deleteMethod: () =>
            handleDelete(restProps.row.completeItem.uuid, setDeleteLoading),
        }}
      />

      <SettingsPopover id={id}>
        <PopoverEdit
          onClick={() =>
            navigate("/inventory/edit-kit/${id}", {
              state: { kit, from: "editKits" },
            })
          }
        />
        {companyAdmin && (
          <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />
        )}
      </SettingsPopover>
    </div>
  );
};

export const ManageItem = ({
  id,
  setAddAlternativeModal,
  setAddAlternativeItemIndex,
  removeItem,
  value,
  setTotalItem,
  setAlternativeSelectedItemId,
  completeProduct,
}) => {
  const index = id;
  return (
    <div className="flex flex-row justify-center items-center">
      <SettingsPopover id={index + 1}>
        <PopoverAlternative
          onClick={() => {
            setAddAlternativeModal(true);
            setAlternativeSelectedItemId(completeProduct?.product?.uuid);
            setAddAlternativeItemIndex(index);
            setTotalItem(value);
          }}
        />
        <PopoverDelete onClick={() => removeItem(index)} text="Remove" />
      </SettingsPopover>
    </div>
  );
};
