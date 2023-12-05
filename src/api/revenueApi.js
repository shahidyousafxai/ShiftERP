import axios from "../helpers/axios";

export const getRevenueList = (paylaod) =>
  axios.post(`tenant/api/accounting/list-revenue`, paylaod);

export const addNewRevenue = (payload) =>
  axios.post(`tenant/api/accounting/add-new-revenue`, payload);

export const deleteRevenue = (payload) =>
  axios.post(`tenant/api/accounting/delete-revenue`, payload);

export const updateRevenue = (payload) =>
  axios.post("tenant/api/accounting/update-revenue", payload);
