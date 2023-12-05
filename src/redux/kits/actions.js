import {
  GET_KITS,
  SET_KITS,
} from "./types";

export const getKits = (data) => ({
  type: GET_KITS,
  payload: data
});

export const setKits = (data) => ({
  type: SET_KITS,
  payload: data
});
