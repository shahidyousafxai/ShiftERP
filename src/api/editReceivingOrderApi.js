import axios from "../helpers/axios";

export const commitReceivingOrder = (payload) =>
  axios.post(`tenant/api/receiving-order/commit-receiving-order`, payload);

export const deleteUncommitedReceivingOrder = (payload) =>
  axios.post(`tenant/api/order-product/remove-order-product`, payload);
