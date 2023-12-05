// Library Impprts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Delete from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import SettingsIcon from "@mui/icons-material/Settings";
// Local Imports
import {
  Button,
  CustomModal,
  Typography,
} from "../../../../../shared";
import { deleteProductionExtra } from "../../../../../api/productionExtraApi";
import { getProductionExtra } from "../../../../../redux/productionExtra/actions";
import { SimpleDeleteModal } from "../../../../../helpers/SimpleDeleteModal";

export const directMaterial = (restProps) => {
  const dm = restProps.row.dm;
  return dm ? (
    <div className="d-flex justify-content-start">Activity</div>
  ) : (
    <div className="d-flex justify-content-start">Direct Material</div>
  );
};

export const ManageProductionExtra = (
  restProps,
  setDeleteAlert,
  setSelectionIds
) => {
  const id = restProps.row.id;
  const productionExtra = restProps.row.completeItem;
  const dispatch = useDispatch();
  let navigate = useNavigate();

  //States
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState("");

  // handle delete
  const handleDelete = () => {
    let payload = {
      production_extra_uuid: [restProps.row.uuid],
    };
    setDeleteLoading(true);
    deleteProductionExtra(payload)
      .then((res) => {
        setSelectionIds([]);
        dispatch(
          getProductionExtra({ status: "", search: "", direct_material: "" })
        );
        setIsDelete(false);
        setDeleteLoading(false);
        setDeleteAlert(true);
      })
      .catch((error) => {
        setIsErrorMsg(error?.response?.data?.message);
        setDeleteLoading(false);
      });
  };


  return (
    <>

      <SimpleDeleteModal
        states={{
          open: isDelete,
          setOpen: setIsDelete,
          errorMsg: isErrorMsg,
          setErrorMsg: setIsErrorMsg,
          headTitle: "Delete Production Extra",
          deleteName: restProps.row.extraName,
          loading: deleteLoading,
          deleteMethod: () => handleDelete(),
        }}
      />

      <div className={`pointer ${id % 2 === 0 ? "bg-lightGray" : "bg-white"}`}>
        <SettingsIcon color="secondary" />
      </div>

      {/* <CustomPopoverButton
        classes="w-6"
        icon={true}
        children={
          <div
            className={`pointer ${id % 2 === 0 ? "bg-lightGray" : "bg-white"}`}>
            <SettingsIcon color="secondary" />
          </div>
        }
        placement="autoVerticalEnd"
        speaker={
          <Popover>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col jusify-center align-items-start">
                <div
                  onClick={() =>
                    navigate(`/accounting/edit-production-extras/${id}`, {
                      state: { productionExtra: productionExtra },
                    })
                  }
                  className="me-4 my-2 pointer text-[14px]">
                  <EditIcon className="me-2 mb-0.5 text-secondaryColor text-[18px]" />
                  Edit
                </div>
                <div
                  // onClick={() => setIsDelete(!isDelete)}
                  className="me-4 pointer text-[14px]">
                  <DeleteIcon className="me-2 mb-0.5 text-secondaryColor text-[18px]" />
                  Delete
                </div>
              </div>
            </div>
          </Popover>
        }
      /> */}
    </>
  );
};
