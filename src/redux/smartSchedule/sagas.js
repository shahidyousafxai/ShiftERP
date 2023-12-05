import { takeLatest, put, call } from "redux-saga/effects";
import { GET_ORDERS_LIST } from "./types";
import { getOrdersList } from "../../api/smartSchedule";
import { setOrdersList } from "./actions";

function* getOrdersListing(action) {
  const payload = action.paylaod;

  try {
    const response = yield call(getOrdersList, payload);

    if (response?.data?.data) {
      let orders = response?.data?.data?.orders?.map((item, index) => {
        let orderlist = {
          uuid: item?.uuid,
          type: item?.type,
          status: item?.status,
          updatedBy: item?.updated_by,
          releaseNo: item?.release_number,
          poNumber: item?.po_number,
          poNotes: item?.po_notes,
          notes: item?.notes,
          driver1: item?.driver1,
          driver2: item?.driver2,
          date: item?.date,
          time: item?.time,
          customer: item?.customer,
          productionOrder: item?.production_order,
          blendOrder: item?.blendOrder,
          shippingOrder: item?.shipping_order,
          recieveingOrder: item?.receiving_order,
          startDate: `${item?.date}T${item?.time}`,
          updatedAt: item?.updated_at,
          hasConnectedOrders: item?.has_connected_orders,
          scheduleId: item?.schedule_id,
        };
        return orderlist;
      });
      let notes = response?.data?.data?.notes?.map((item) => {
        let notesList = {
          uuid: item?.uuid,
          type: item?.type,
          time: item?.time,
          date: item?.date,
          startDate: `${item?.date}T${item?.time}`,
          updatedAt: item?.updated_at,
          updatedBy: item?.edited_by,
          note: item?.notes,
        };
        return notesList;
      });
      let data = [...orders, ...notes];

      yield put(setOrdersList(data));
    } else {
      yield put(setOrdersList([]));
    }
  } catch (error) {
    console.log("Get Smart Schedule Listing Error - ", error?.response);
  }
}

export function* getOrdersListSaga() {
  yield takeLatest(GET_ORDERS_LIST, getOrdersListing);
}
