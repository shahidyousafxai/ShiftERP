import { GET_SHIPTO, SET_SHIPTO } from "./types";

export const getShipTo = (data) => ({
  type: GET_SHIPTO,
  payload: data,
});
export const setShipTo = (data) => ({
  type: SET_SHIPTO,
  payload: data,
});
