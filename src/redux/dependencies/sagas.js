import { takeEvery, call, put } from "redux-saga/effects";
import { GET_DEPENDENCIES } from "./types";
import { getAllDependency } from "../../api/allDependencies";
import { setAllDependencies } from "./action";

function* getDependencise() {
  try {
    const response = yield call(getAllDependency);
    if (response?.data?.data) {
      let data = response?.data?.data;
      yield put(setAllDependencies(data));
    } else {
      yield put([]);
    }
  } catch (error) {
    console.log("Error get Listing of All Dependencies", error?.response);
  }
}
export function* getAllDependenciesSaga() {
  yield takeEvery(GET_DEPENDENCIES, getDependencise);
}
