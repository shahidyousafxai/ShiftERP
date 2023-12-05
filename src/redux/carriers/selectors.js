import { useSelector } from "react-redux";

export const GetCarriersLoading = () => {
  return useSelector((state) => state.carrier.getCarriersLoading);
};

export const GetCarriersListing = () => {
  return useSelector((state) => state.carrier.carriers);
};
