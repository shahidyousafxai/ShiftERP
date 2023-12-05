import axios from "../helpers/axios";

export const getAllDependency = (payload) =>
  axios.post(`tenant/api/order/dependencies`, payload);

export const getAllDependenciesAccounting = (payload) =>
  axios.post(`tenant/api/accounting/dependencies`, payload);
