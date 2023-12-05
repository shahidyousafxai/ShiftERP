import { GET_VENDORS, SET_VENDORS } from "./types";

const initialState = {
  getVendorsLoading: false,
  vendors: [],
};

export const getVendorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VENDORS:
      return {
        ...state,
        getVendorsLoading: true,
      };
    case SET_VENDORS:
      return {
        ...state,
        vendors: action.payload,
        getVendorsLoading: false,
      };

    default:
      return state;
  }
};
