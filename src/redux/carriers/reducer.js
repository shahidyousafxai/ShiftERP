import { GET_CARRIERS, SET_CARRIERS } from "./types";

const initialState = {
  getCarriersLoading: false,
  carriers: [],
};

export const getCarriersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CARRIERS:
      return {
        ...state,
        getCarriersLoading: true,
      };
    case SET_CARRIERS:
      return {
        ...state,
        carriers: action.payload,
        getCarriersLoading: false,
      };
    default:
      return state;
  }
};
