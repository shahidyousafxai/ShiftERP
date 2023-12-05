import {
  GET_PRODUCTS,
  SET_PRODUCTS,
} from "./types";

export const getProducts = (data) => ({
  type: GET_PRODUCTS,
  payload: data
});

export const setProducts = (data) => ({
  type: SET_PRODUCTS,
  payload: data
});
