import { useSelector } from "react-redux";

export const GetLocations = () => {
  return useSelector((state) => state.location.locations);
};

export const GetLocationsLoading = () => {
  return useSelector((state) => state.location.getLocationLoading);
};
