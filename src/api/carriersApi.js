import axios from "../helpers/axios";

export const getCarriersList = (payload) =>
  axios.post(`tenant/api/shipper/list`, payload);

export const addNewCarrier = (payload) =>
  axios.post(`tenant/api/shipper/save`, payload);

export const updateCarrier = (payload) =>
  axios.post(`tenant/api/shipper/update`, payload);

export const deleteCarrier = (payload) =>
  axios.post(`tenant/api/shipper/delete`, payload);
