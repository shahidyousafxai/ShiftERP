import { takeLatest, put, call } from "redux-saga/effects";
import { GET_SHIPTO } from "./types";
import { setShipTo } from "./actions";
import { getShipToList } from "../../api/shipToApi";

function* shipToListing(action) {
  const payload = action.payload;
  try {
    const response = yield call(getShipToList, payload);

    if (response?.data?.data?.ship_to) {
      let data = response?.data?.data?.ship_to.map((item, index) => {
        let newObject = {
          id: index + 1,
          uuid: item?.uuid,
          shipToName: item?.name,
          city: item?.city,
          state: item?.state,
          customerName: item?.customer_name,
          primaryContact: item?.primary_contacts?.name,
          contactEmail: item?.primary_contacts?.email,
          contactNumber: item?.primary_contacts?.phone,
          status: item?.status,
          completeItem: item,
        };
        return newObject;
      });
      yield put(setShipTo(data));
    } else {
      yield put(setShipTo([]));
    }
  } catch (error) {
    console.log("Get SipTo Listing Error - ", error);
  }
}

export function* getSipToSaga() {
  yield takeLatest(GET_SHIPTO, shipToListing);
}
