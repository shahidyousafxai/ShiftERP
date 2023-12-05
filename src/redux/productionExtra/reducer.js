import { GET_PRODUCTION_EXTRA, SET_PRODUCTION_EXTRA } from "./types";

const initialState = {
  getProductionExtraLoading: false,
  productionExtra: [],
};

export const getProductionExtraReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTION_EXTRA:
      return {
        ...state,
        getProductionExtraLoading: true,
      };
    case SET_PRODUCTION_EXTRA:
      return {
        ...state,
        productionExtra: action.payload,
        getProductionExtraLoading: false,
      };

    default:
      return state;
  }
};
