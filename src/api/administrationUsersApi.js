import axios from "../helpers/axios";

export const addNewUser = (payload) =>
  axios.post(`tenant/api/user/save`, payload);

export const editUser = (payload) =>
  axios.post(`tenant/api/user/update`, payload);

export const addNewUser_ProfileImg = (payload) =>
  axios.post(`tenant/api/user/update-profile-pic`, payload);
