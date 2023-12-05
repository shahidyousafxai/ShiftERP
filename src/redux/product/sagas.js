import { call, put, takeLatest } from "redux-saga/effects";
import { GET_PRODUCTS } from "./types";
import * as Actions from "./actions";
import { getProductsList } from "../../api/productsApi";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getProducts(action) {
  const payload = action.payload;
  try {
    const response = yield call(getProductsList, payload);
    if (response?.data?.data?.products) {
      // For Generating Id To Show On Listing
      if (payload.order === "desc") {
        let length = response?.data?.data?.products.length;
        response?.data?.data?.products.map((item) => {
          // eslint-disable-next-line no-sequences
          return (item.id = length), (length = length - 1);
        });
      } else {
        response?.data?.data?.products.map((item, index) => {
          return (item.id = index + 1);
        });
      }
      // For Making The Respoonse For Table Listing
      let data = response?.data?.data?.products?.map((item) => {
        let allergens;
        // eslint-disable-next-line array-callback-return
        item?.allergens?.length > 0 &&
          // eslint-disable-next-line array-callback-return
          item?.allergens?.map((item2, index) => {
            allergens =
              index === 0 ? item2.name : allergens + ", " + item2.name;
          });

        let obj = {
          id: item?.id,
          uuid: item?.uuid,
          customer: item?.customer?.code,
          category: item?.category?.name,
          name: item?.name,
          description: item?.description,
          bar_code: item?.barcode,
          status: item?.status,
          high_risk: item?.shipping?.is_high_risk,
          pallet_tie: item?.shipping?.pallet_tie,
          costed: item?.shipping?.cost_item,
          kit_parent_cost: item?.shipping?.kit_parent_cost,
          allergies: allergens === undefined ? "" : allergens,
          completeItem: item,
        };
        return obj;
      });

      yield put(Actions.setProducts(data));
    } else {
      yield put(Actions.setProducts([]));
    }
  } catch (err) {}
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
export function* getProductsSaga() {
  yield takeLatest(GET_PRODUCTS, getProducts);
}
