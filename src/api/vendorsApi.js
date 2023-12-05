import axios from "../helpers/axios";

export const getVendorsList = (paylaod) =>
  axios.post(`tenant/api/vendor/list`, paylaod);

export const addNewVendor = (payload) =>
  axios.post(`tenant/api/vendor/save`, payload);

export const deleteVendor = (payload) =>
  axios.post(`tenant/api/vendor/delete`, payload);

export const updateVendor = (payload) =>
  axios.post("tenant/api/vendor/update", payload);
