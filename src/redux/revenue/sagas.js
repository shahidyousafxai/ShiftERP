import { takeLatest, call, put } from "redux-saga/effects";
import { GET_REVENUE } from "./types";

import { getRevenueList } from "../../api/revenueApi";
import { setRevenueData } from "./action";
import dayjs from "dayjs";
function* revenueListing(action) {
  const payload = action.payload;

  try {
    const response = yield call(getRevenueList, payload);

    if (response?.data?.data?.revenues) {
      let data = response?.data?.data?.revenues.map((item, index) => {
        let newObject = {
          id: index + 1,
          uuid: item?.uuid,
          date: dayjs(item?.date).format("DD/MM/YYYY"),
          notes: item?.notes,
          amount: `$${item?.amount}`,
          itemName: item?.revenue_type?.name,
          completeItem: item,
        };
        return newObject;
      });
      yield put(setRevenueData(data));
    } else {
      yield put(setRevenueData([]));
    }
  } catch (error) {
    console.log("Get Revenue Listing Err in Saga - ", error);
  }
}

export function* getRevenueSaga() {
  yield takeLatest(GET_REVENUE, revenueListing);
}
