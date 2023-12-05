import { GET_UNIVERSEL_FACILITY, SET_UNIVERSEL_FACILITY } from "./types";
export const getUniFacility = (data) => ({
  type: GET_UNIVERSEL_FACILITY,
  payload: data,
});
export const setUniFacility = (data) => ({
  type: SET_UNIVERSEL_FACILITY,
  payload: data,
});
