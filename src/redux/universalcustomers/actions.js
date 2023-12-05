import { GET_UNIVERSEL_CUSTEMERS, SET_UNIVERSEL_CUSTEMERS } from "./types";

export const getUniCustomers = () => ({
  type: GET_UNIVERSEL_CUSTEMERS,
});
export const setUniCustomers = (data) => ({
  type: SET_UNIVERSEL_CUSTEMERS,
  payload: data,
});
