import { call, put, takeLatest } from "redux-saga/effects";
import { GET_KITS } from "./types";
import * as Actions from "./actions";
import { getKitsList } from "../../api/kitsApi";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getKits(action) {
  const payload = action.payload;
  try {
    const response = yield call(getKitsList, payload);
    if (response?.data?.data?.kits) {
      // For Making The Respoonse For Table Listing
      let data = response?.data?.data?.kits?.map((item, index) => {
        let obj = {
          id: index + 1,
          kit: item?.name,
          customer: item?.customer?.name,
          customerCode: item?.customer?.code,
          description: item?.description,
          completeItem: item,
        };
        return obj;
      });

      yield put(Actions.setKits(data));
    } else {
      yield put(Actions.setKits([]));
    }
  } catch (err) {}
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
export function* getKitsSaga() {
  yield takeLatest(GET_KITS, getKits);
}
