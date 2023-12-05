import { call, put, takeEvery } from "redux-saga/effects";
import { GET_UNIVERSEL_USERS } from "./types";
import { getUniversalModalData } from "../../api/universalModelData";
import { setUniUsers } from "./action";

function* uniUsers(action) {
  const payload = action.payload;
  try {
    const response = yield call(getUniversalModalData, payload);
    if (response?.data?.data) {
      let data = response?.data?.data;
      yield put(setUniUsers(data));
    }
  } catch (error) {
    console.log("Get Need Listing Error user - ", error);
  }
}

export function* getUniUsersSaga() {
  yield takeEvery(GET_UNIVERSEL_USERS, uniUsers);
}
