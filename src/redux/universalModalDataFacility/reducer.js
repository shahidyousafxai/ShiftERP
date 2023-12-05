import { GET_UNIVERSEL_FACILITY, SET_UNIVERSEL_FACILITY } from "./types";

const initialStateFacility = {
  getUniFacilityLoading: false,
  uniFacility: [],
};

export const getUniFacilityReducer = (state = initialStateFacility, action) => {
  switch (action.type) {
    case GET_UNIVERSEL_FACILITY:
      return {
        ...state,
        getUniFacilityLoading: true,
      };
    case SET_UNIVERSEL_FACILITY:
      return {
        ...state,
        getUniFacilityLoading: false,
        uniFacility: action.payload,
      };
    default:
      return state;
  }
};
