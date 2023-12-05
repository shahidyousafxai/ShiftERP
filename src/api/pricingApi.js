import axios from "../helpers/axios";

export const getPricingList = (paylaod) =>
  axios.post(`tenant/api/accounting/list-pricing`, paylaod);

export const addNewPricing = (payload) =>
  axios.post(`tenant/api/accounting/add-new-pricing`, payload);

export const deletePricing = (payload) =>
  axios.post(`tenant/api/accounting/delete-pricing`, payload);

export const updatePricing = (payload) =>
  axios.post("tenant/api/accounting/update-pricing", payload);
