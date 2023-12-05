import { useSelector } from "react-redux";

//Pricing Selectors
export const GetPricingLoading = () => {
  return useSelector((state) => state?.pricing?.getPricingLoading);
};
export const GetPricingListing = () => {
  return useSelector((state) => state?.pricing?.pricing);
};

//RecurringPrice Selectors
export const GetRecurringPriceLoading = () => {
  return useSelector((state) => state?.pricing?.getRecurringPriceLoading);
};
export const GetRecurringPriceListing = () => {
  return useSelector((state) => state);
};

//HandlingPrice Selectors
export const GetHandlingPriceLoading = () => {
  return useSelector((state) => state?.pricing?.getHandlingPriceLoading);
};
export const GetHandlingPriceListing = () => {
  return useSelector((state) => state);
};
