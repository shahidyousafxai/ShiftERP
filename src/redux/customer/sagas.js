import { call, put, takeLatest } from "redux-saga/effects";
import { GET_CUSTOMERS } from "./types";
import * as Actions from "./actions";
import { getCustomersList } from "../../api/customerApi";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getCustomers(action) {
  const payload = action.payload;
  try {
    const response = yield call(getCustomersList, payload);
    if (response?.data?.data?.customer) {
      if (payload.order === "desc") {
        let length = response?.data?.data?.customer.length;
        response?.data?.data?.customer.map((item) => {
          return (item.id = length), (length = length - 1);
        });
      } else {
        response?.data?.data?.customer.map((item, index) => {
          return (item.id = index + 1);
        });
      }
      yield put(Actions.setCustomers(response.data.data.customer));
    } else {
      yield put(Actions.setCustomers([]));
    }
  } catch (err) {
    console.log(err);
  }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
export function* getCustomersSaga() {
  yield takeLatest(GET_CUSTOMERS, getCustomers);
}
