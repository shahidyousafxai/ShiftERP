// Library Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Local Imports
import { deleteVendor } from "../../../../../api/vendorsApi";
import { getVendors } from "../../../../../redux/vendors/actions";
import { PopoverDelete, PopoverEdit, SettingsPopover } from "../../../../../helpers/TableUtilities";
import { SimpleDeleteModal } from "../../../../../helpers/SimpleDeleteModal";

export const ManageVendor = (restProps, setDeleteAlert, setSelectionIds) => {
  const id = restProps.row.id;
  const vendor = restProps.row.completeItem;
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState("");

  const handleDelete = () => {
    let payload = {
      id: restProps.row.uuid,
    };
    setDeleteLoading(true);
    deleteVendor(payload)
    .then((res) => {
      setSelectionIds([]);
      dispatch(getVendors({ status: "", search: "", vendor_ids: "" }));
      setDeleteAlert(true);
      setDeleteLoading(false);
      setIsDelete(false);
      })
      .catch((error) => {
        setDeleteLoading(false);
        setIsErrorMsg(error?.response?.data?.message);
      });
  };

  return (
    <div>

      <SimpleDeleteModal
        states={{
          open: isDelete,
          setOpen: setIsDelete,
          errorMsg: isErrorMsg,
          setErrorMsg: setIsErrorMsg,
          headTitle: "Delete Vendor",
          deleteName: restProps.row.companyName,
          loading: deleteLoading,
          deleteMethod: () => handleDelete(),
        }}
      />

      <SettingsPopover id={id}>
        <PopoverEdit
          onClick={() =>
            navigate(`/supply-chain/edit-vendor/${id}`, {
              state: { vendor: vendor },
            })} />
        <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />
      </SettingsPopover>
    </div>
  );
};
