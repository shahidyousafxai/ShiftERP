import { call, put, takeLatest } from "redux-saga/effects";
import { GET_UNIVERSEL_FACILITY } from "./types";
import { getUniversalModalData } from "../../api/universalModelData";
import { setUniFacility } from "./action";

//facility
function* uniFacility(action) {
  const payload = action.payload;
  try {
    const response = yield call(getUniversalModalData, payload);
    if (response?.data?.data) {
      let data = response?.data?.data;
      yield put(setUniFacility(data));
    }
  } catch (error) {
    console.log("Get Need Listing Error facility - ", error?.response);
  }
}

export function* getUniFacilitySaga() {
  yield takeLatest(GET_UNIVERSEL_FACILITY, uniFacility);
}
