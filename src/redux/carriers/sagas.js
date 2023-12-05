import { takeLatest, call, put } from "redux-saga/effects";
import { GET_CARRIERS } from "./types";
import { getCarriersList } from "../../api/carriersApi";
import * as Actions from "./actions";

function* carrersListing(action) {
  const paylaod = action.payload;
  try {
    const response = yield call(getCarriersList, paylaod);
    if (response?.data?.data?.shipper) {
      let data = response?.data?.data?.shipper.map((item, index) => {
        let newObject = {
          id: index + 1,
          uuid: item?.uuid,
          shipperName: item?.shipper_name,
          shipperCode: item?.shipper_code,
          address: item?.address,
          primaryContact: item?.primary_contacts?.name,
          contactEmail: item?.primary_contacts?.email,
          contactNumber: item?.primary_contacts?.phone,
          status: item?.status,
          completeItem: item,
        };
        return newObject;
      });

      yield put(Actions.setCarriers(data));
    } else {
      yield put(Actions.setCarriers([]));
    }
  } catch (error) {
    console.log(error);
  }
}

export function* getCarriersSaga() {
  yield takeLatest(GET_CARRIERS, carrersListing);
}
