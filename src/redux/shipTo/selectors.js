import { useSelector } from "react-redux";

export const GetSipToLoading = () => {
  return useSelector((state) => state?.shipTo?.getShipToLoading);
};

export const GetShipToListing = () => {
  return useSelector((state) => state?.shipTo?.shipTo);
};
