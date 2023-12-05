import { useSelector } from "react-redux";

export const GetExpensesLoading = () => {
  return useSelector((state) => state?.expenses?.getExpensesLoading);
};
export const GetExpensesListing = () => {
  return useSelector((state) => state?.expenses?.expenses);
};
