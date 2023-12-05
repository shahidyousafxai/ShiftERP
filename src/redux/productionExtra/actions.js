import { GET_PRODUCTION_EXTRA, SET_PRODUCTION_EXTRA } from "./types";

export const getProductionExtra = (data) => ({
  type: GET_PRODUCTION_EXTRA,
  payload: data,
});

export const setProductionExtraData = (data) => ({
  type: SET_PRODUCTION_EXTRA,
  payload: data,
});
