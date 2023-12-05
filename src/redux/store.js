import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import createSagaMiddleware from "redux-saga";
import rootReducer from "./root.reducer.js";
import rootSaga from "./root.saga.js";
import createMigrate from "redux-persist/es/createMigrate";
const sagaMiddleware = createSagaMiddleware();

const migrations = {
  0: (state) => ({
    ...state,
    user: {
      currentUser: null,
      userInfo: null,
      token: null,
      image_url: "",
    },
    administration: {
      getUsersLoading: false,
      users: [],
      getFaciltiesLoading: false,
      updateFaciltiesLoading: false,
      allFacilities: [],
      loginUserFacilities: [],
      routes: [],
      open: true,
    },
    customer: {
      getCustomerLoading: false,
      allCustomers: [],
    },
    product: {
      getProductsLoading: false,
      products: [],
    },
    kit: {
      getKitsLoading: false,
      kits: [],
    },
    location: {
      getLocationLoading: false,
      locations: [],
    },
    carrier: {
      getCarriersLoading: false,
      carriers: [],
    },
    vendor: {
      getVendorsLoading: false,
      vendors: [],
    },
    shipTo: {
      getShipToLoading: false,
      shipTo: [],
    },
    uniCustomers: {
      getUniCustomersLoading: false,
      uniCustomers: [],
    },
    uniUsers: {
      getUniUsersLoading: false,
      uniUsers: [],
    },
    uniFacility: {
      getUniFacilityLoading: false,
      uniFacility: [],
    },
    kitParent: {
      getKitParentLoading: false,
      kitParent: [],
    },
    ordersList: {
      getOrdersListLoading: false,
      ordersList: [],
    },
    allDependencies: {
      getDependencyloading: false,
      allDependencies: [],
    },
    productionExtra: {
      getProductionLoading: false,
      productionExtra: [],
    },
    pricing: {
      getPricingLoading: false,
      pricing: [],
    },
    revenue: {
      getRevenueLoading: false,
      revenue: [],
    },
    expenses: {
      getExpensesLoading: false,
      expenses: [],
    },
    revenueExpense: {
      getRevenueExpenseLoading: false,
      revenueExpense: [],
    },
  }),
};

const persistConfig = {
  key: "root",
  version: 0,
  storage: storage,
  migrate: createMigrate(migrations, { debug: false }),
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);
export const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);
