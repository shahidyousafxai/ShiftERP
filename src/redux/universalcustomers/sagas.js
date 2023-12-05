import { takeEvery, put, call } from "redux-saga/effects";
import { GET_UNIVERSEL_CUSTEMERS } from "./types";
import { setUniCustomers } from "./actions";
import { getUniversalCustomers } from "../../api/universalCustomer";

function* uniCustomers() {
  const response = yield call(getUniversalCustomers);
  try {
    if (response?.data?.data) {
      let data = response?.data?.data;
      // console.log(data);
      yield put(setUniCustomers(data));
    } else {
      yield put(setUniCustomers([]));
    }
  } catch (error) {
    console.log("Universal Customers Listing Error - ", error);
  }
}

export function* getUniCustomersSaga() {
  yield takeEvery(GET_UNIVERSEL_CUSTEMERS, uniCustomers);
}
