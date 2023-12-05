import {
  GET_PRICING,
  SET_PRICING,
  GET_RECURRINGPRICE,
  SET_RECURRINGPRICE,
  GET_HANDLINGPRICE,
  SET_HANDLINGPRICE,
} from "./types";

//Pricing Action setter and getter
export const getPricing = (data) => ({
  type: GET_PRICING,
  payload: data,
});

export const setPricingData = (data) => ({
  type: SET_PRICING,
  payload: data,
});

//Recurring Storage Action setter and getter
export const getRecurringPrice = (data) => ({
  type: GET_RECURRINGPRICE,
  payload: data,
});

export const setRecurringPriceData = (data) => ({
  type: SET_RECURRINGPRICE,
  payload: data,
});

//Handling Fees Action setter and getter
export const getHandlingPrice = (data) => ({
  type: GET_HANDLINGPRICE,
  payload: data,
});

export const setHandlingPriceData = (data) => ({
  type: SET_HANDLINGPRICE,
  payload: data,
});
