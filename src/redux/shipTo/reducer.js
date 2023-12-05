import { GET_SHIPTO, SET_SHIPTO } from "./types";

const initialState = {
  getShipToLoading: false,
  shipTo: [],
};

export const getShipToReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SHIPTO:
      return {
        ...state,
        getShipToLoading: true,
      };
    case SET_SHIPTO:
      return {
        ...state,
        shipTo: action.payload,
        getShipToLoading: false,
      };

    default:
      return state;
  }
};
