import { GET_ORDERS_LIST, SET_ORDERS_LIST } from "./types";

export const getOrdersList = (data) => ({
  type: GET_ORDERS_LIST,
  payload: data,
});

export const setOrdersList = (data) => ({
  type: SET_ORDERS_LIST,
  payload: data,
});
