import { GET_REVENUEEXPENSE, SET_REVENUEEXPENSE } from "./types";

export const getRevenueExpense = (data) => ({
  type: GET_REVENUEEXPENSE,
  payload: data,
});

export const setRevenueExpenseData = (data) => ({
  type: SET_REVENUEEXPENSE,
  payload: data,
});
