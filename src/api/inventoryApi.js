import axios from "../helpers/axios";

export const getInventoryListingApi = (payload) =>
  axios.post(`tenant/api/order-product/get-inventory`, payload);

export const checkAvailableProduct = (payload) =>
  axios.post(`tenant/api/order-product/get-available-products`, payload);

export const addPickOrderApi = (payload) =>
  axios.post(`tenant/api/order-product/pick-order`, payload);

export const editPickOrderApi = (payload) =>
  axios.post(`tenant/api/order-product/unpick-order`, payload);

export const addReadyForProductionApi = (payload) =>
  axios.post(`tenant/api/order-product/start-producing`, payload);

export const readyForPutAwayApi = (payload) =>
  axios.post(`tenant/api/order-product/put-away`, payload);

export const addShippingInfoApi = (payload) =>
  axios.post(`tenant/api/order-product/extra-values`, payload);
