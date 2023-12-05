import { takeLatest, call, put } from "redux-saga/effects";
import { GET_VENDORS } from "./types";
import { getVendorsList } from "../../api/vendorsApi";
import * as Actions from "./actions";
function* vendorsListing(action) {
  const payload = action.payload;
  try {
    const response = yield call(getVendorsList, payload);

    if (response?.data?.data?.vendor) {
      let data = response?.data?.data?.vendor.map((item, index) => {
        let newObject = {
          id: index + 1,
          uuid: item?.uuid,
          companyName: item?.company_name,
          address: item?.address,
          primaryContact: item?.primary_contacts?.name,
          contactEmail: item?.primary_contacts?.email,
          contactNumber: item?.primary_contacts?.phone,
          status: item?.status,
          completeItem: item,
        };
        return newObject;
      });
      yield put(Actions.setVendors(data));
    } else {
      yield put(Actions.setVendors([]));
    }
  } catch (error) {
    console.log("Get Vendors Listing Err - ", error);
  }
}

export function* getVendorsSaga() {
  yield takeLatest(GET_VENDORS, vendorsListing);
}
