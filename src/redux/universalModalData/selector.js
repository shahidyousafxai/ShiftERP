import { useSelector } from "react-redux";

export const GetUniUsersLoading = () => {
  return useSelector((state) => state?.uniUsers?.getUniUsersLoading);
};
export const GetUniversalUsersList = () => {
  return useSelector((state) => state?.uniUsers?.uniUsers);
};
