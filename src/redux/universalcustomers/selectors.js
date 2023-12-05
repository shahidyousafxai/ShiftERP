import { useSelector } from "react-redux";

export const GetUniCustomersLoading = () => {
  return useSelector((state) => state?.uniCustomers?.getUniCustomersLoading);
};
export const GetUniversalCustomersList = () => {
  return useSelector((state) => state?.uniCustomers?.uniCustomers);
};
