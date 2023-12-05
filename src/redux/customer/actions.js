import {
  GET_CUSTOMERS,
  SET_CUSTOMERS,
} from "./types";

export const getCustomers = (data) => ({
  type: GET_CUSTOMERS,
  payload: data
});

export const setCustomers = (data) => ({
  type: SET_CUSTOMERS,
  payload: data
});
