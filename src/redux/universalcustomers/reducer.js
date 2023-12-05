import { GET_UNIVERSEL_CUSTEMERS, SET_UNIVERSEL_CUSTEMERS } from "./types";

const initialState = {
  getUniCustomersLoading: false,
  uniCustomers: [],
};

export const getUniCustomersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_UNIVERSEL_CUSTEMERS:
      return {
        ...state,
        getUniCustomersLoading: true,
      };
    case SET_UNIVERSEL_CUSTEMERS:
      return {
        ...state,
        getUniCustomersLoading: false,
        uniCustomers: action.payload,
      };
    default:
      return state;
  }
};
