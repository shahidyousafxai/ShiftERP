import { GET_ORDERS_LIST, SET_ORDERS_LIST } from "./types";

const initialState = {
  getOrdersListLoading: false,
  ordersList: [],
};

export const getOrdersListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDERS_LIST:
      return {
        ...state,
        getOrdersListLoading: true,
      };
    case SET_ORDERS_LIST:
      return {
        ...state,
        getOrdersListLoading: false,
        ordersList: action.payload,
      };

    default:
      return state;
  }
};
