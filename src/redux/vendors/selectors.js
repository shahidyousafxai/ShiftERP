import { useSelector } from "react-redux";

export const GetVendorsLoading = () => {
  return useSelector((state) => state?.vendor?.getVendorsLoading);
};
export const GetVendorsListing = () => {
  return useSelector((state) => state?.vendor?.vendors);
};
