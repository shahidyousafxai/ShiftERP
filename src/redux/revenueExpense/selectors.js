import { useSelector } from "react-redux";

export const GetRevenueExpenseLoading = () => {
  return useSelector(
    (state) => state?.revenueExpense?.getRevenueExpenseLoading
  );
};
export const GetRevenueExpenseListing = () => {
  return useSelector((state) => state?.revenueExpense?.revenueExpense);
};
