import {
  GET_PRODUCTS,
  SET_PRODUCTS,
} from "./types";

const initialState = {
  getProductsLoading: false,
  products: [],

};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        getProductsLoading: true,
      };
    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        getProductsLoading: false
      };

    default:
      return state;
  }
};
