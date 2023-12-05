import { call, put, takeEvery } from "redux-saga/effects";
import { GET_KIT_PARENT } from "./types";
import { setKitParent } from "./action";
import { getUniverselKits } from "../../api/universalModelData";

function* kitParentList(action) {
  const payload = action.payload;
  try {
    const response = yield call(getUniverselKits, payload);
    if (response?.data?.data) {
      let data = response?.data?.data;
      yield put(setKitParent(data));
    }
  } catch (error) {
    console.log("error", error?.response);
  }
}

export function* getKitParentSaga() {
  yield takeEvery(GET_KIT_PARENT, kitParentList);
}
