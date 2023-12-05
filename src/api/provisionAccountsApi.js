import axios from "../helpers/axios";

export const getProvisionAccountsList = (payload) =>
  axios.post(`api/provision/list`, payload);

export const addProvisionAccount = (payload) =>
  axios.post(`api/provision/store`, payload);

export const updateProvisionAccount = (payload) =>
  axios.post(`api/provision/update`, payload);

export const uploadSOW = (payload) =>
  axios.post(`api/provision/upload-sow`, payload);

export const pauseCancelSub = (payload) =>
  axios.post(`api/provision/change-status`, payload);

export const getSubscriptions = () => axios.get(`api/provision/subscription`);
