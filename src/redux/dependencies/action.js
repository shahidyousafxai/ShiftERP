import { GET_DEPENDENCIES, SET_DEPENDENCIES } from "./types";

export const getAllDependencies = () => ({
  type: GET_DEPENDENCIES,
});

export const setAllDependencies = (data) => ({
  type: SET_DEPENDENCIES,
  payload: data,
});
