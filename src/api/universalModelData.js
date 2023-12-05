import axios from "../helpers/axios";

export const getUniversalModalData = (payload) =>
  axios.post(`tenant/api/universal/model-data`, payload);

export const getUniverselKits = (payload) =>
  axios.post(`tenant/api/universal/customer-kits`, payload);

export const getUniverselDriver = (payload) =>
  axios.get(`tenant/api/dependency/get/driver`, payload);

export const getAddProductionOrder = (payload) =>
  axios.post(`tenant/api/production-order/add-production-order`, payload);

export const getAddBlendOrder = (payload) =>
  axios.post(`tenant/api/blend-order/add-blend-order`, payload);

export const getAddShippingOrder = (payload) =>
  axios.post(`tenant/api/shipping-order/add-shipping-order`, payload);

export const getAddReceivingOrder = (payload) =>
  axios.post(`tenant/api/receiving-order/add-receiving-order`, payload);

export const getAllDependencies = (payload) =>
  axios.get(`tenant/api/order/dependencies`, payload);
