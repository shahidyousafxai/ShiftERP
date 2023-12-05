import { useSelector } from "react-redux";

export const GetUniFacilityLoading = () => {
  return useSelector((state) => state?.uniFacility?.getUniFacilityLoading);
};
export const GetUniversalFacilityList = () => {
  return useSelector((state) => state?.uniFacility?.uniFacility);
};
