import axios from "axios";
// import { getAccessToken } from "./GlobalMethods";
// import { store } from "../../redux/store.js";

const baseURL = process.env.REACT_APP_BASE_URL;

// const headers = {
//   Authorization: "Bearer " + getAccessToken(),
// };

const axiosInstance = axios.create({
  baseURL,
});

//persistent the user login
// if (!axiosInstance.defaults.headers.common["authorization"]) {
//   const state = store.getState();
//   let token = state.user.token;
//   if (token) {
//     axiosInstance.defaults.headers.common["authorization"] = "Bearer " + token;
//   } else {
//     // Delete auth header
//     delete axiosInstance.defaults.headers.common["authorization"];
//   }
// } else {
//   delete axiosInstance.defaults.headers.common["authorization"];
// }

export const setAuthToken = (token) => {
  if (token) {
    // Apply to every request
    axiosInstance.defaults.headers.common["authorization"] = "Bearer " + token;
  } else {
    // Delete auth header
    delete axiosInstance.defaults.headers.common["authorization"];
  }
};
export default axiosInstance;
