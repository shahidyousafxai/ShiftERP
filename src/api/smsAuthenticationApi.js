import axios from "../helpers/axios";

export const sendSMSForAuth = (payload) => axios.post("/api/send-sms", payload);

export const verifySMSForAuth = (payload) =>
  axios.post("/api/verify-update-number", payload);

export const disableSMSAuth = (payload) =>
  axios.post("/api/update-sms", payload);

export const sendEmailForResetSMSAuth = () => axios.get("/api/reset-auth");

export const verifyResetSMSAuth = (payload) =>
  axios.post("/api/verify-reset-auth", payload);
