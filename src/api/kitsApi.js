import axios from "../helpers/axios";

export const getKitsList = (payload) =>
  axios.post(`tenant/api/kit/list`, payload);

export const addKit = (payload) => axios.post(`tenant/api/kit/save`, payload);

export const updateKit = (payload) =>
  axios.post(`tenant/api/kit/update`, payload);

export const deleteKit = (payload) =>
  axios.post(`tenant/api/kit/delete`, payload);

export const deleteKitProduct = (payload) =>
  axios.post(`tenant/api/kit/product-remove`, payload);

export const getKitDetails = (payload) =>
  axios.post(`tenant/api/kit/get`, payload);

export const getDependencies = (payload) =>
  axios.post(`tenant/api/kit/dependencies`, payload);
