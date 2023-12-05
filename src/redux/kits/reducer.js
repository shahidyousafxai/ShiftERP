import {
  GET_KITS,
  SET_KITS,
} from "./types";

const initialState = {
  getKitsLoading: false,
  kits: [],

};

export const kitsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_KITS:
      return {
        ...state,
        getKitsLoading: true,
      };
    case SET_KITS:
      return {
        ...state,
        kits: action.payload,
        getKitsLoading: false
      };

    default:
      return state;
  }
};
