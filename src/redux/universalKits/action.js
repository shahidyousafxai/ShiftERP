import { GET_KIT_PARENT, SET_KIT_PARENT } from "./types";

export const getKitParent = (data) => ({
  type: GET_KIT_PARENT,
  payload: data,
});
export const setKitParent = (data) => ({
  type: SET_KIT_PARENT,
  payload: data,
});
