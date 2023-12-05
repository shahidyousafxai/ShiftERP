import { takeLatest, call, put } from "redux-saga/effects";
import { GET_PRICING } from "./types";
import * as Actions from "./actions";
import { getPricingList } from "../../api/pricingApi";
function* pricingListing(action) {
  const payload = action.payload;

  try {
    const response = yield call(getPricingList, payload);

    if (response?.data?.data?.pricing) {
      // let data = response?.data?.data?.pricing.map((item, index) => {
      //   let newObject = {
      //     id: index + 1,
      //     uuid: item?.uuid,
      //     customerName: item?.customer?.name,
      //     pricingName: item?.name,
      //     chargeType: item?.charge_type?.name,
      //     grace: item?.grace_period,
      //     aniversaryPeriod: item?.aniversary_Period,
      //     price: item?.price_per_unit,
      //     uom: item?.unit?.name,
      //     completeItem: item,
      //   };
      //   return newObject;
      // });
      yield put(Actions.setPricingData(response?.data?.data?.pricing));
    } else {
      yield put(Actions.setPricingData([]));
    }
  } catch (error) {
    console.log("Get pricing Listing Err in Saga - ", error);
  }
}

export function* getPricingSaga() {
  yield takeLatest(GET_PRICING, pricingListing);
}
