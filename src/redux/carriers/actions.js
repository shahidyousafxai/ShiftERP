import { GET_CARRIERS, SET_CARRIERS } from "./types";

export const getCarriers = (data) => ({
  type: GET_CARRIERS,
  payload: data,
});

export const setCarriers = (data) => ({
  type: SET_CARRIERS,
  payload: data,
});
