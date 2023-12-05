import axios from "../helpers/axios";

export const fetchQrCode = () => axios.get("/tenant/api/google-qr-code");
export const googleCodeVerify = (payload) =>
  axios.post("/tenant/api/google-verify-code", payload);

export const googleAuthActivator = (payload) =>
  axios.post("/tenant/api/google-auth-activator", payload);
export const googleAuthDisable = (payload) =>
  axios.post("/tenant/api/google-auth-activator", payload);
export const googleAuthReset = (payload) =>
  axios.post("/tenant/api/google-auth-reset", payload);
