import {
  GET_PRICING,
  SET_PRICING,
  GET_RECURRINGPRICE,
  SET_RECURRINGPRICE,
  GET_HANDLINGPRICE,
  SET_HANDLINGPRICE,
} from "./types";

//Pricing initial State
const initialState = {
  getPricingLoading: false,
  pricing: [],
};
//Recurring initialState
const initialStateRecurring = {
  getRecurringPriceLoading: false,
  recurringPrice: [],
};
//Hanlding initialState
const initialStateHandling = {
  getHandlingPriceLoading: false,
  handlingPrice: [],
};

//PricingReducer
export const getPricingReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRICING:
      return {
        ...state,
        getPricingLoading: true,
      };
    case SET_PRICING:
      return {
        ...state,
        pricing: action.payload,
        getPricingLoading: false,
      };

    default:
      return state;
  }
};
//RecurringReducer
export const getRecurringPriceReducer = (
  state = initialStateRecurring,
  action
) => {
  switch (action.type) {
    case GET_RECURRINGPRICE:
      return {
        ...state,
        getRecurringPriceLoading: true,
      };
    case SET_RECURRINGPRICE:
      return {
        ...state,
        recurringPrice: action.payload,
        getRecurringPriceLoading: false,
      };

    default:
      return state;
  }
};

//HandlingReducer
export const getHandlingPriceReducer = (
  state = initialStateHandling,
  action
) => {
  switch (action.type) {
    case GET_HANDLINGPRICE:
      return {
        ...state,
        getHandlingPriceLoading: true,
      };
    case SET_HANDLINGPRICE:
      return {
        ...state,
        handlingPrice: action.payload,
        getHandlingPriceLoading: false,
      };
    default:
      return state;
  }
};
