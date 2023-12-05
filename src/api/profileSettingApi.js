import axios from "../helpers/axios";

export const getUserProfileInformationApi = (payload) =>
  axios.get("/tenant/api/user-info");

export const updateUserProfileInformationApi = (payload) =>
  axios.post("/tenant/api/update-user", payload);

export const changeUserPasswordApi = (payload) =>
  axios.post("/tenant/api/change-password", payload);

export const updateUserProfilePictureApi = (payload) =>
  axios.post("/tenant/api/update-profile-picture", payload);

export const getUserProfilePictureApi = (payload) =>
  axios.get("/tenant/api/get-profile-picture");

export const deleteUserProfilePictureApi = (payload) =>
  axios.get("/tenant/api/remove-profile-picture");

export const changeUserEmailApi = (payload) =>
  axios.post("/tenant/api/change-email", payload);

export const verifyChangeUserEmailApi = (payload) =>
  axios.post("/tenant/api/verify-change-email", payload);
