import { takeLatest, call, put } from "redux-saga/effects";
import { getExpensesList } from "../../api/expensesApi";
import { GET_EXPENSES } from "./types";
import { setExpensesData } from "./action";

import dayjs from "dayjs";

function* expensesListing(action) {
  const payload = action.payload;

  try {
    const response = yield call(getExpensesList, payload);

    if (response?.data?.data?.expenses) {
      let data = response?.data?.data?.expenses.map((item1, index) => {
        let obj = {};
        obj.id = index + 1;
        obj.uuid = item1.uuid;
        obj.date = dayjs(item1.date).format("DD/MM/YYYY");
        obj.type = item1.expense_type?.name;
        obj.completeItem = item1;
        item1?.data?.forEach((item) => {
          if (item?.name.includes("Selling")) {
            obj.selling = `$${item.amount}`;
          } else if (item?.name.includes("Plant")) {
            obj.plant = `$${item.amount}`;
          } else if (item?.name.includes("Employee")) {
            obj.employee = `$${item.amount}`;
          } else if (item?.name.includes("Rent")) {
            obj.rent = `$${item.amount}`;
          } else if (item?.name.includes("Blast Rent")) {
            obj.blastRent = `$${item.amount}`;
          } else if (item?.name.includes("Utilities")) {
            obj.utilities = `$${item.amount}`;
          } else if (item?.name.includes("Operations")) {
            obj.operations = `$${item.amount}`;
          } else if (item?.name.includes("Claims")) {
            obj.claims = `$${item.amount}`;
          } else if (item?.name.includes("Financial Expense")) {
            obj.financial = `$${item.amount}`;
          } else if (item?.name.includes("Depreciation")) {
            obj.depreciation = `$${item.amount}`;
          }
        });

        return obj;
      });

      yield put(setExpensesData(data));
    } else {
      yield put(setExpensesData([]));
    }
  } catch (error) {
    console.log("Get Expenses Listing Err in Saga - ", error);
  }
}

export function* getExpenseSaga() {
  yield takeLatest(GET_EXPENSES, expensesListing);
}
