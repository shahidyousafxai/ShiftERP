import { GET_REVENUE, SET_REVENUE } from "./types";

const initialState = {
  getRevenueLoading: false,
  revenue: [],
};

export const getRevenueReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVENUE:
      return {
        ...state,
        getRevenueLoading: true,
      };
    case SET_REVENUE:
      return {
        ...state,
        revenue: action.payload,
        getRevenueLoading: false,
      };

    default:
      return state;
  }
};
