import { useSelector } from "react-redux";

export const GetRevenueLoading = () => {
  return useSelector((state) => state?.revenue?.getRevenueLoading);
};
export const GetRevenueListing = () => {
  return useSelector((state) => state?.revenue?.revenue);
};
