import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./users/user.reducers.js";
import { administrationReducer } from "./administration/reducer";
import { customerReducer } from "./customer/reducer";
import { productReducer } from "./product/reducer.js";
import { kitsReducer } from "./kits/reducer.js";
import { getLocationReducer } from "./locations/reducer";
import { getCarriersReducer } from "./carriers/reducer.js";
import { getVendorsReducer } from "./vendors/reducer.js";
import { getShipToReducer } from "./shipTo/reducer.js";
import { getUniCustomersReducer } from "./universalcustomers/reducer.js";
import { getUniUserReducer } from "./universalModalData/reducer.js";
import { getUniFacilityReducer } from "./universalModalDataFacility/reducer.js";
import { getKitParentReducer } from "./universalKits/reducer.js";
import { getOrdersListReducer } from "./smartSchedule/reducer.js";
import { getAllDependenciesReducer } from "./dependencies/reducer.js";
import { getProductionExtraReducer } from "./productionExtra/reducer.js";
import {
  getHandlingPriceReducer,
  getPricingReducer,
  getRecurringPriceReducer,
} from "./Pricing/reducer.js";
import { getRevenueReducer } from "./revenue/reducer.js";
import { getExpensesReducer } from "./expenses/reducer.js";
import { getRevenueExpenseReducer } from "./revenueExpense/reducer.js";

const rootReducer = combineReducers({
  user: userReducer,
  administration: administrationReducer,
  customer: customerReducer,
  product: productReducer,
  kit: kitsReducer,
  location: getLocationReducer,
  carrier: getCarriersReducer,
  vendor: getVendorsReducer,
  shipTo: getShipToReducer,
  uniCustomers: getUniCustomersReducer,
  uniUsers: getUniUserReducer,
  uniFacility: getUniFacilityReducer,
  kitParent: getKitParentReducer,
  orders: getOrdersListReducer,
  allDependencies: getAllDependenciesReducer,
  productionExtra: getProductionExtraReducer,
  pricing: getPricingReducer,
  recurringPrice: getRecurringPriceReducer,
  handlingPrice: getHandlingPriceReducer,
  revenue: getRevenueReducer,
  expenses: getExpensesReducer,
  revenueExpense: getRevenueExpenseReducer,
});
export default rootReducer;
