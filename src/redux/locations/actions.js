import { GET_LOCATIONS, SET_LOCATIONS } from "./types";

export const getLocations = (data) => ({
  type: GET_LOCATIONS,
  payload: data,
});

export const setLocations = (data) => ({
  type: SET_LOCATIONS,
  payload: data,
});
