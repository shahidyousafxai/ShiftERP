import axios from "../helpers/axios";

//LOGIN
export const loginApi = (payload) => axios.post("/api/login", payload);
export const refreshApi = (payload) => axios.get("/api/refresh", payload);

//RESET PASSWORD
export const resetPasswordApi = (payload) =>
  axios.post("/api/reset-password", payload);

//FORGOT PASSWORD
export const forgotPasswordApi = (payload) =>
  axios.post("/api/forget-password", payload);

//TWO FACFOR AUTHENTICATION
export const twoFactorAuthenticationApi = (payload) =>
  axios.post("/api/verify-sms", payload);

//RESEND SMS VERIFICATION CODE
export const resendSmsVerificationCode = (payload) =>
  axios.post("/api/resend-sms", payload);

//SEND SMS VERIFICATION CODE
export const sendSmsVerificationCode = (payload) =>
  axios.post("/api/send-sms", payload);

export const logoutApi = (payload) => axios.get("/api/logout");
