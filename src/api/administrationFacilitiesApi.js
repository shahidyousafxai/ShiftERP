import axios from "../helpers/axios";

export const addNewFacility = (payload) =>
  axios.post(`tenant/api/facility/save`, payload);

export const editFacility = (payload) =>
  axios.post(`tenant/api/facility/update`, payload);

export const addNewFacility_ProfileImg = (payload) =>
  axios.post(`tenant/api/facility/update-dp`, payload);

export const getPrimaryContacts = () => axios.get(`tenant/api/facility/admins`);
