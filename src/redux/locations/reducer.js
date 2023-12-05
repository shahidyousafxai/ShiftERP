import { GET_LOCATIONS, SET_LOCATIONS } from "./types";

const initialState = {
  getLocationLoading: false,
  locations: [],
};

export const getLocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOCATIONS:
      return {
        ...state,
        getLocationLoading: true,
      };
    case SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload,
        getLocationLoading: false,
      };

    default:
      return state;
  }
};
