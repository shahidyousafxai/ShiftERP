import axios from "../helpers/axios";

export const getShipToList = (payload) =>
  axios.post(`tenant/api/ship-to/list`, payload);

export const addNewShipTo = (payload) =>
  axios.post(`tenant/api/ship-to/save`, payload);

export const deleteShipTo = (payload) =>
  axios.post(`tenant/api/ship-to/delete`, payload);

export const handleStatusOrCustomer = (payload) =>
  axios.post(`tenant/api/ship-to/multi-status-update`, payload);

export const updateShipTo = (payload) =>
  axios.post(`tenant/api/ship-to/update`, payload);
