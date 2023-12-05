import axios from "../helpers/axios";

export const getOrdersList = (payload) =>
  axios.post(`tenant/api/order/list`, payload);

export const getNotes = (payload) =>
  axios.post(`tenant/api/notes/add-new-note`, payload);

export const deleteNote = (payload) =>
  axios.post(`tenant/api/notes/delete-notes`, payload);

export const postImportData = (payload) => {
  axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
  return axios.post(`tenant/api/order/import-csv`, payload);
};

export const getSingleOrder = (payload) =>
  axios.post(`tenant/api/order/order-detail`, payload);

export const updateOrderDetails = (payload) =>
  axios.post(`tenant/api/order/update`, payload);

export const getAllDependencyOrder = (payload) =>
  axios.post(`tenant/api/order/dependencies`, payload);
