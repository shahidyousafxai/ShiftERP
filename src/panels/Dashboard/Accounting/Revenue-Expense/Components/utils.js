// Library Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Local Imports
import {
  Typography,
} from "../../../../../shared";
import { getRevenueExpense } from "../../../../../redux/revenueExpense/action";
import { deleteRevenueExpense } from "../../../../../api/revenueExpenseApi";
import { danger, success } from "../../../../../helpers/GlobalVariables";
import { PopoverDelete, PopoverEdit, SettingsPopover } from "../../../../../helpers/TableUtilities";
import { SimpleDeleteModal } from "../../../../../helpers/SimpleDeleteModal"

export const Amount = (restProps) => {
  const revenueType = restProps.row.revenueType;
  const amount = restProps.row.amount;
  return revenueType === "Credit" || revenueType === "Expense" ? (
    <Typography color={danger}>-${amount}</Typography>
  ) : (
    <Typography color={success} className="mr-[7px]">
      ${amount}
    </Typography>
  );
};

export const ManageRevenueExpenses = (
  restProps,
  setSelectionIds,
  setSelectedRevenueExpenses,
  setDeleteAlert
) => {
  const id = restProps.row.id;
  const revenueExpense = restProps.row.completeItem;
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState("");

  const handleDelete = () => {
    let payload = {
      expense_revenue_uuid: [restProps.row.uuid],
    };
    setDeleteLoading(true);
    deleteRevenueExpense(payload)
    .then((res) => {
      setSelectionIds([]);
      dispatch(
        getRevenueExpense({
          date: "",
          search: "",
          revenue_type_id: "",
          revenue_item_id: "",
          facility_id: "",
        })
        );
        setIsDelete(false);
        setSelectedRevenueExpenses([]);
        setDeleteAlert(true);
        setDeleteLoading(false);
      })
      .catch((error) => {
        setDeleteLoading(false);
        setIsErrorMsg(error?.response?.data?.message);
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
          headTitle: "Delete Revenue/Expense",
          deleteName: restProps?.row?.facility,
          loading: deleteLoading,
          deleteMethod: () => handleDelete(),
        }}
      />


      <SettingsPopover id={id}>
        <PopoverEdit
          onClick={() =>
            navigate(`/accounting/edit-revenue-expense/${id}`, {
              state: { revenueExpense: revenueExpense },
            })} />
        <PopoverDelete onClick={() => setIsDelete(!isDelete)} text="Delete" />
      </SettingsPopover>
    </>
  );
};
