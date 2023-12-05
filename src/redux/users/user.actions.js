import { userTypes } from "./user.types.js";
// Image Refreshing
export const userImageStart = () => ({
  type: userTypes.userImageStart,
});
export const userImageSuccess = (payload) => ({
  type: userTypes.userImageSuccess,
  payload,
});
export const userImageRemove = () => ({
  type: userTypes.userImageRemove,
});
// User Refresh
export const userRefreshStart = () => ({
  type: userTypes.refreshStart,
});
export const userRefreshSuccess = (payload) => ({
  type: userTypes.refreshSuccess,
  payload,
});

//User Login
export const userLogin = (payload) => ({
  type: userTypes.logIn,
  payload,
});
export const userLogout = () => ({
  type: userTypes.logOut,
});
