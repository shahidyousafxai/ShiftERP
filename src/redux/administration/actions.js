import {
  GET_FACILITIES,
  GET_SEARCHED_USER,
  GET_USERS,
  SET_FACILITIES,
  SET_USERS,
  UPDATE_USER_FACILITIES,
  GET_SEARCHED_FACILITY,
  UPDATE_FACILITY,
  DELETE_FACILITY,
  SET_LOGIN_USER_FACILITIES,
  GET_LOGIN_USER_FACILITIES,
  GET_ROUTES,
  SET_ROUTES,
  GET_COLLAPSE,
  SET_COLLAPSE,
} from "./types";

export const getUsers = (name, roleId, status, order) => ({
  type: GET_USERS,
  payload: { name, roleId, status, order }
});

export const setUsers = (data) => ({
  type: SET_USERS,
  payload: data
});

export const getFacilities = (name, status, order) => ({
  type: GET_FACILITIES,
  payload: { name, status, order }
});

export const getSearchedUser = (name, roleId, status, order) => ({
  type: GET_SEARCHED_USER,
  payload: { name, roleId, status, order }
});

export const getSearchedFacility = (name, primaryContact, status, order) => ({
  type: GET_SEARCHED_FACILITY,
  payload: { name, primaryContact, status, order }
});

export const setFacilities = (data) => ({
  type: SET_FACILITIES,
  payload: data
});

export const updateUserFacilities = (data) => ({
  type: UPDATE_USER_FACILITIES,
  payload: data
});

export const updateFacility = (userId, uuid, name, office_phone, address, city, state, zip_code, primary_contact_email, primary_contact_name, status) => ({
  type: UPDATE_FACILITY,
  payload: { userId, uuid, name, office_phone, address, city, state, zip_code, primary_contact_email, primary_contact_name, status }
});

export const deleteFacility = (uuid) => ({
  type: DELETE_FACILITY,
  payload: uuid
});

export const getLoginUserFacilities = (id) => ({
  type: GET_LOGIN_USER_FACILITIES,
  payload: id
});

export const setLoginUserFacilities = (data) => ({
  type: SET_LOGIN_USER_FACILITIES,
  payload: data
});



export const getRoutes = () => ({
  type: GET_ROUTES
});
export const setRoutes = (data) => ({
  type: SET_ROUTES,
  payload: data
});
export const getCollapse = () => ({
  type: GET_COLLAPSE
});
export const setCollapse = (data) => ({
  type: SET_COLLAPSE,
  payload: data
});
