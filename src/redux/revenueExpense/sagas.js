import { takeLatest, call, put } from "redux-saga/effects";
import { GET_REVENUEEXPENSE } from "./types";
import dayjs from "dayjs";
import { getRevenueExpenseList } from "../../api/revenueExpenseApi";
import { setRevenueExpenseData } from "./action";
function* revenueExpenseListing(action) {
  const payload = action.payload;

  try {
    const response = yield call(getRevenueExpenseList, payload);
    if (response?.data?.data?.revenues) {
      let data = response?.data?.data?.revenues.map((item, index) => {
        let newObject = {
          id: index + 1,
          uuid: item?.uuid,
          facility: item?.facility?.name,
          customer: item?.customer?.name,
          revenueType: item?.revenue_type?.name,
          revenueItem: item?.revenue_item?.name,
          date: dayjs(item?.date).format("DD/MM/YYYY"),
          notes: item?.notes,
          amount: item?.amount,
          completeItem: item,
        };
        return newObject;
      });
      yield put(setRevenueExpenseData(data));
    } else {
      yield put(setRevenueExpenseData([]));
    }
  } catch (error) {
    console.log("Get Revenue/Expense Listing Err in Saga - ", error);
  }
}

export function* getRevenueExpenseSaga() {
  yield takeLatest(GET_REVENUEEXPENSE, revenueExpenseListing);
}
