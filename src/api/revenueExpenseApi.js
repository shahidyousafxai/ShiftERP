import axios from "../helpers/axios";

export const getRevenueExpenseList = (paylaod) =>
  axios.post(`tenant/api/accounting/list-expense-revenue`, paylaod);

export const addNewRevenueExpense = (payload) =>
  axios.post(`tenant/api/accounting/add-new-expense-revenue`, payload);

export const deleteRevenueExpense = (payload) =>
  axios.post(`tenant/api/accounting/delete-expense-revenue`, payload);

export const updateRevenueExpense = (payload) =>
  axios.post("tenant/api/accounting/update-expense-revenue", payload);
