import { useSelector } from "react-redux";

export const GetUsers = () => {
  return useSelector((state) => state.administration.users);
};

export const GetUsersLoading = () => {
  return useSelector((state) => state.administration.getUsersLoading);
};

export const GetFacilties = () => {
  return useSelector((state) => state.administration.allFacilities);
};

export const GetFacilty = (id) => {
  return useSelector((state) =>
    state.administration.allFacilities.filter(
      (facility) => facility.uuid === id
    )
  );
};

export const GetFaciltiesLoading = () => {
  return useSelector((state) => state.administration.getFaciltiesLoading);
};

export const GetUpdateFaciltiesLoading = () => {
  return useSelector((state) => state.administration.updateFaciltiesLoading);
};

export const GetLoginUserFacilities = () => {
  return useSelector((state) => state.administration.loginUserFacilities);
};

export const GetLoginUserFacilty = (id) => {
  return useSelector((state) =>
    state.administration.loginUserFacilities.filter(
      (facility) => facility.uuid === id
    )
  );
};

export const GetRoutes = () => {
  return useSelector((state) => state.administration.routes);
};
export const GetCollapse = () => {
  return useSelector((state) => state.administration.open);
};
