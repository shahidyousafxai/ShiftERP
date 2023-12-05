import { GET_VENDORS, SET_VENDORS } from "./types";

export const getVendors = (data) => ({
  type: GET_VENDORS,
  payload: data,
});

export const setVendors = (data) => ({
  type: SET_VENDORS,
  payload: data,
});
