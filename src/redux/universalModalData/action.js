import { GET_UNIVERSEL_USERS, SET_UNIVERSEL_USERS } from "./types";

export const getUniUsers = (data) => ({
  type: GET_UNIVERSEL_USERS,
  payload: data,
});
export const setUniUsers = (data) => ({
  type: SET_UNIVERSEL_USERS,
  payload: data,
});
