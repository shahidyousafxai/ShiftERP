import { GET_EXPENSES, SET_EXPENSES } from "./types";

export const getExpenses = (data) => ({
  type: GET_EXPENSES,
  payload: data,
});

export const setExpensesData = (data) => ({
  type: SET_EXPENSES,
  payload: data,
});
