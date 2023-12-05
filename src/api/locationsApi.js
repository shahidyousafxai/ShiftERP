// import { axios } from "axios";
import axios from "../helpers/axios";

export const getLocationsList = (payload) =>
  axios.post("tenant/api/location/list", payload);

export const deleteLocations = (payload) =>
  axios.post(`tenant/api/location/delete`, payload);

export const addLocation = (payload) =>
  axios.post(`tenant/api/location/save`, payload);

export const updateLocation = (payload) =>
  axios.post(`tenant/api/location/update`, payload);
