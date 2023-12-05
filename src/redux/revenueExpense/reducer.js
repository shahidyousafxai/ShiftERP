import { GET_REVENUEEXPENSE, SET_REVENUEEXPENSE } from "./types";

const initialState = {
  getRevenueExpenseLoading: false,
  revenueExpense: [],
};

export const getRevenueExpenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVENUEEXPENSE:
      return {
        ...state,
        getRevenueExpenseLoading: true,
      };
    case SET_REVENUEEXPENSE:
      return {
        ...state,
        revenueExpense: action.payload,
        getRevenueExpenseLoading: false,
      };

    default:
      return state;
  }
};
