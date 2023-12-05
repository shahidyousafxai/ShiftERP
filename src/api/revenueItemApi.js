import axios from "../helpers/axios";

export const getRevenueItemList = () =>
  axios.get(`tenant/api/accounting/list-revenue-item`);

export const addNewRevenueItem = (payload) =>
  axios.post(`tenant/api/accounting/add-new-revenue-item`, payload);

export const deleteRevenueItem = (payload) =>
  axios.post(`tenant/api/accounting/delete-revenue-item`, payload);

export const updateRevenueItem = (payload) =>
  axios.post("tenant/api/accounting/update-revenue-item", payload);
