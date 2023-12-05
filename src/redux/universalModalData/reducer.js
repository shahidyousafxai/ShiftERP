import { GET_UNIVERSEL_USERS, SET_UNIVERSEL_USERS } from "./types";

const initialState = {
  getUniUsersLoading: false,
  uniUsers: [],
};

export const getUniUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_UNIVERSEL_USERS:
      return {
        ...state,
        getUniUsersLoading: true,
      };
    case SET_UNIVERSEL_USERS:
      return {
        ...state,
        getUniUsersLoading: false,
        uniUsers: action.payload,
      };
    default:
      return state;
  }
};
