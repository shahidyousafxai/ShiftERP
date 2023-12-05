import { all, call } from "redux-saga/effects";
import {
  persistor,
  userImage,
  userLogin,
  userRefresh,
} from "./users/user.sagas.js";
import { getUsersSaga } from "./administration/sagas";
import { getCustomersSaga } from "./customer/sagas";
import { getProductsSaga } from "./product/sagas.js";
import { getKitsSaga } from "./kits/sagas.js";
import { getLocationsSaga } from "./locations/sagas";
import { getCarriersSaga } from "./carriers/sagas.js";
import { getVendorsSaga } from "./vendors/sagas.js";
import { getSipToSaga } from "./shipTo/sagas.js";
import { getUniCustomersSaga } from "./universalcustomers/sagas.js";
import { getUniUsersSaga } from "./universalModalData/saga.js";
import { getUniFacilitySaga } from "./universalModalDataFacility/saga.js";
import { getKitParentSaga } from "./universalKits/saga.js";
import { getOrdersListSaga } from "./smartSchedule/sagas.js";
import { getAllDependenciesSaga } from "./dependencies/sagas.js";
import { getProductionExtraSaga } from "./productionExtra/sagas.js";
import { getPricingSaga } from "./Pricing/sagas.js";
import { getRevenueSaga } from "./revenue/sagas.js";
import { getExpenseSaga } from "./expenses/sagas.js";
import { getRevenueExpenseSaga } from "./revenueExpense/sagas.js";

export default function* rootSaga() {
  yield all([
    call(persistor),
    call(userRefresh),
    call(userImage),
    call(userLogin),
    call(getUsersSaga),
    call(getCustomersSaga),
    call(getProductsSaga),
    call(getKitsSaga),
    call(getLocationsSaga),
    call(getCarriersSaga),
    call(getVendorsSaga),
    call(getSipToSaga),
    call(getUniCustomersSaga),
    call(getUniUsersSaga),
    call(getUniFacilitySaga),
    call(getKitParentSaga),
    call(getOrdersListSaga),
    call(getAllDependenciesSaga),
    call(getProductionExtraSaga),
    call(getPricingSaga),
    call(getRevenueSaga),
    call(getExpenseSaga),
    call(getRevenueExpenseSaga),
  ]);
  // code after all-effect
}
