import axios from "../helpers/axios";

export const getProductionExtraList = (paylaod) =>
  axios.post(`tenant/api/accounting/list-production-extra`, paylaod);

export const addNewProductionExtra = (payload) =>
  axios.post(`tenant/api/accounting/add-new-production-extra`, payload);

export const deleteProductionExtra = (payload) =>
  axios.post(`tenant/api/accounting/delete-production-extra`, payload);

export const updateProductionExtra = (payload) =>
  axios.post("tenant/api/accounting/update-production-extra", payload);
