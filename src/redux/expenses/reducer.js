import { GET_EXPENSES, SET_EXPENSES } from "./types";

const initialState = {
  getExpensesLoading: false,
  expenses: [],
};

export const getExpensesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EXPENSES:
      return {
        ...state,
        getExpensesLoading: true,
      };
    case SET_EXPENSES:
      return {
        ...state,
        expenses: action.payload,
        getExpensesLoading: false,
      };

    default:
      return state;
  }
};
