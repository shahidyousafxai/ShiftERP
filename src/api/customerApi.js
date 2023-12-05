import axios from "../helpers/axios";

export const getCustomersList = (payload) =>
  axios.post(`tenant/api/customer/list`, payload);

export const addCustomer = (payload) =>
  axios.post(`tenant/api/customer/save`, payload);

export const updateCustomer = (payload) =>
  axios.post(`tenant/api/customer/update`, payload);

export const getCustomerDetails = (payload) =>
  axios.post(`tenant/api/customer/show`, payload);

export const deleteCustomer = (payload) =>
  axios.post(`tenant/api/customer/delete`, payload);

export const getCustomerCSVFormat = () =>
  axios.get(`tenant/api/customer/customer-csv-format`);

export const postCustomerImport = (payload) =>
  axios.post(`tenant/api/customer/customer-import`, payload);

export const getAllFacilitiesList = () =>
  axios.post(`tenant/api/facility/list`);
