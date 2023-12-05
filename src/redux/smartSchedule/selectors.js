import { useSelector } from "react-redux";

export const GetOrdersLoading = () => {
  return useSelector((state) => state?.orders?.getOrdersListLoading);
};

export const GetOrdersList = () => {
  return useSelector((state) => state?.orders?.ordersList);
};
