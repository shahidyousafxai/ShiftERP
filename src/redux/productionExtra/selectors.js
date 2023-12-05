import { useSelector } from "react-redux";

export const GetProductionExtraLoading = () => {
  return useSelector(
    (state) => state?.productionExtra?.getProductionExtraLoading
  );
};
export const GetProductionExtraListing = () => {
  return useSelector((state) => state?.productionExtra?.productionExtra);
};
