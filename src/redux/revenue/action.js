import { GET_REVENUE, SET_REVENUE } from "./types";

export const getRevenue = (data) => ({
  type: GET_REVENUE,
  payload: data,
});

export const setRevenueData = (data) => ({
  type: SET_REVENUE,
  payload: data,
});
