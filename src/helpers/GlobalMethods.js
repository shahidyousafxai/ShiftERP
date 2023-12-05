import validator from "validator";
import { logoutApi } from "../api/authApi";
import { store } from "../redux/store.js";

const getAccessToken = () => JSON.parse(localStorage.getItem("token"));

const getUserDetails = () => {
  let user = localStorage.getItem("user_info");
  return JSON.parse(user);
};
const setUserDetails = (user) => {
  localStorage.setItem("user_info", JSON.stringify(user));
};

const validateUsername = (username) => {
  if (validator.matches(username, "^[a-zA-Z0-9_.-]*$")) {
    return true;
  }
  return false;
};

const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    return false;
  }
  return true;
};

const validateUsernameOrEmail = (value) => {
  if (validateEmail(value) || validateUsername(value)) {
    return false;
  }
  return true;
};

const isUserAuthenticated = () => {
  const state = store.getState();
  const user = state.user.currentUser;
  if (user) {
    return true;
  } else {
    return false;
  }
  // eslint-disable-next-line no-unreachable
  const token = JSON.parse(localStorage.getItem("token"));
  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  if (token === "" || userInfo === "" || token === null || userInfo === null) {
    return false;
  }

  return true;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const logoutUser = async () => {
  try {
    localStorage.removeItem("user_info");
    localStorage.removeItem("token");
    await logoutApi();
  } catch (error) {}
};

export {
  getAccessToken,
  validateUsername,
  validateEmail,
  validateUsernameOrEmail,
  isUserAuthenticated,
  getUserDetails,
  capitalizeFirstLetter,
  logoutUser,
  setUserDetails,
};
