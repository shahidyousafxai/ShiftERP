import { useSelector } from "react-redux";

export const GetKitParentLoading = () => {
  return useSelector((state) => state?.kitParent?.getKitParentLoading);
};

export const GetKitParentListing = () => {
  return useSelector((state) => state?.kitParent?.kitParent);
};
