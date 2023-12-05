import axios from "../helpers/axios";

export const getProductsList = (payload) =>
  axios.post(`tenant/api/product/list`, payload);

export const addProduct = (payload) =>
  axios.post(`tenant/api/product/save`, payload);

export const updateProduct = (payload) =>
  axios.post(`tenant/api/product/update`, payload);

export const getProductDetails = (payload) =>
  axios.post(`tenant/api/product/get`, payload);

export const deleteProduct = (payload) =>
  axios.post(`tenant/api/product/delete`, payload);

//customer_id(uuid of that customer) to get the facility of that specific customer
export const getDependencies = (payload) =>
  axios.post(`tenant/api/product/dependencies`, payload);
