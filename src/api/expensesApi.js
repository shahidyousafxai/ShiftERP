import axios from "../helpers/axios";

export const getExpensesList = (paylaod) =>
  axios.post(`tenant/api/accounting/list-expense`, paylaod);

export const addNewExpenses = (payload) =>
  axios.post(`tenant/api/accounting/add-new-expense`, payload);

export const deleteExpenses = (payload) =>
  axios.post(`tenant/api/accounting/delete-expense`, payload);

export const updateExpenses = (payload) =>
  axios.post("tenant/api/accounting/update-expense", payload);
