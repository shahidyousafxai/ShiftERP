import {
  GET_CUSTOMERS,
  SET_CUSTOMERS,
} from "./types";

const initialState = {
  getCustomerLoading: false,
  customers: [],

};

export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMERS:
      return {
        ...state,
        getCustomerLoading: true,
      };
    case SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
        getCustomerLoading: false
      };

    default:
      return state;
  }
};
