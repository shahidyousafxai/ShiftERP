import { takeLatest, call, put } from "redux-saga/effects";
import { GET_PRODUCTION_EXTRA } from "./types";
import * as Actions from "./actions";
import { getProductionExtraList } from "../../api/productionExtraApi";
function* productionExtraListing(action) {
  const payload = action.payload;

  try {
    const response = yield call(getProductionExtraList, payload);

    if (response?.data?.data?.production_extras) {
      let data = response?.data?.data?.production_extras.map((item, index) => {
        let newObject = {
          id: index + 1,
          uuid: item?.uuid,
          extraName: item?.name,
          amount: `$${item?.amount}`,
          uom: item?.unit?.name,
          dm: item?.direct_material,
          status: item?.status,
          completeItem: item,
        };
        return newObject;
      });
      yield put(Actions.setProductionExtraData(data));
    } else {
      yield put(Actions.setProductionExtraData([]));
    }
  } catch (error) {
    console.log("Get productionExtra Listing Err - ", error);
  }
}

export function* getProductionExtraSaga() {
  yield takeLatest(GET_PRODUCTION_EXTRA, productionExtraListing);
}
