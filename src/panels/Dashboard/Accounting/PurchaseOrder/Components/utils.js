import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  PopoverCloseout, 
  PopoverDelete, 
  PopoverEdit, 
  PopoverPrint, 
  PopoverReply, 
  PopoverShipping, 
  PopoverText, 
  SettingsPopover 
} from "../../../../../helpers/TableUtilities";

export const ManageProductNotReceived = (
  restProps,
) => {
  const id = restProps.row.id;

  let navigate = useNavigate();

  //   const [deleteLoading, setDeleteLoading] = useState(false);

  //   const handleDelete = () => {
  //     let payload = {
  //       id: restProps.row.uuid,
  //     };
  //     setDeleteLoading(true);
  //     //   deleteExpenses(payload)
  //     // .then((res) => {
  //     //   setSelectionIds([]);
  //     //   dispatch(getExpenses({  search: "", expenses_ids: "" }));
  //     setSelectedExpenses([]);
  //     setDeleteAlert(true);
  //     setLoading(true);
  //     setDeleteLoading(false);
  //     // })
  //     // .catch((error) => {
  //     //   setDeleteLoading(false);
  //     //   console.log("error", error);
  //     // });
  //   };

  //   const handleCancelDelete = () => {
  //     setIsDelete(false);
  //     setSelectionIds([]);
  //     setSelectedExpenses([]);
  //     setLoading(true);
  //     //   dispatch(getExpenses({  search: "", expenses_ids: "" }));
  //   };

  return (
    <>
      <SettingsPopover id={id}>
        <PopoverPrint text="Print PO with Pricing"/>
        <PopoverShipping />
        <PopoverEdit />
        <PopoverDelete text="Delete"/>
      </SettingsPopover>
    </>
  );
};

export const ManageReadyToClose = (
  restProps,
  setDeleteAlert,
  setSelectionIds,
  setSelectedExpenses,
  setLoading
) => {
  const id = restProps.row.id;
  const readyToClose = restProps.row.completeItem;

  let navigate = useNavigate();

  return (
    <>
      <SettingsPopover id={id}>
        <PopoverPrint text="Print PO with Pricing" />
        <PopoverCloseout />
        <PopoverEdit />
        <PopoverDelete text="Delete" />
      </SettingsPopover>
    </>
  );
};

export const ManageCompletedPO = (
  restProps,
  setDeleteAlert,
  setSelectionIds,
  setSelectedExpenses,
  setLoading
) => {
  const id = restProps.row.id;
  const completedPO = restProps.row.completeItem;

  let navigate = useNavigate();

  return (
    <>
      <SettingsPopover id={id}>
        <PopoverPrint text="Print PO with Pricing" />
        <PopoverReply />
        <PopoverEdit />
        <PopoverDelete text="Delete" />
      </SettingsPopover>
    </>
  );
};

export const ManageClosedPO = (
  restProps,
  setDeleteAlert,
  setSelectionIds,
  setSelectedExpenses,
  setLoading
) => {
  const id = restProps.row.id;
  const closedPO = restProps.row.completeItem;

  let navigate = useNavigate();

  return (
    <>
      <SettingsPopover id={id}>
        <PopoverPrint text="Review PO" />
        <PopoverText />
        <PopoverEdit />
        <PopoverDelete text="Delete" />
      </SettingsPopover>
    </>
  );
};
