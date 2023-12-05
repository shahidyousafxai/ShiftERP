import {
  GET_USERS,
  SET_USERS,
  GET_FACILITIES,
  SET_FACILITIES,
  GET_SEARCHED_USER,
  GET_SEARCHED_FACILITY,
  UPDATE_FACILITY,
  GET_LOGIN_USER_FACILITIES,
  SET_LOGIN_USER_FACILITIES,
  GET_ROUTES,
  SET_ROUTES,
  GET_COLLAPSE,
  SET_COLLAPSE,
} from "./types";

const initialState = {
  getUsersLoading: false,
  users: [],
  getFaciltiesLoading: false,
  updateFaciltiesLoading: false,
  allFacilities: [],
  loginUserFacilities: [],
  routes: [],
  open: true,
};

export const administrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        getUsersLoading: true,
      };
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
        getUsersLoading: false
      };
      case GET_SEARCHED_USER:
        return {
          ...state,
          getUsersLoading: true
      };
    case GET_SEARCHED_FACILITY:
      return {
        ...state,
      };
    case GET_FACILITIES:
      return {
        ...state,
        getFaciltiesLoading: true,
      };
    case UPDATE_FACILITY:
      return {
        ...state,
        updateFaciltiesLoading: true,
      };
    case SET_FACILITIES:
      return {
        ...state,
        allFacilities: action.payload,
        getFaciltiesLoading: false,
        updateFaciltiesLoading: false,
        getUsersLoading: false
      };
    case GET_LOGIN_USER_FACILITIES:
      return {
        ...state,
        getFaciltiesLoading: true,
      };
    case SET_LOGIN_USER_FACILITIES:
      return {
        ...state,
        loginUserFacilities: action.payload,
        getFaciltiesLoading: false,
        updateFaciltiesLoading: false,
      };
    case GET_ROUTES:
      return {
        ...state,
      };
    case SET_ROUTES:
      return {
        ...state,
        routes: action.payload,
      };
    case GET_COLLAPSE:
      return {
        ...state,
      };
    case SET_COLLAPSE:
      return {
        ...state,
        open: action.payload,
      };
    default:
      return state;
  }
};
