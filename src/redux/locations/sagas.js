import { call, put, takeLatest } from "redux-saga/effects";

import * as Actions from "./actions";
import { getLocationsList } from "../../api/locationsApi";
import { GET_LOCATIONS } from "./types";

//User Fetched Locations

function* locationsList(action) {
  const payload = action.payload;

  try {
    const response = yield call(getLocationsList, payload);
    if (response?.data?.data?.locations) {
      // For Making The Respoonse For Table Listing
      let data = response?.data?.data?.locations.map((item, index) => {
        let obj = {
          id: index + 1,
          uuid: item.uuid,
          location: item?.name.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
            letter.toUpperCase()
          ),
          tall: item?.is_tall_location,
          remotePick: item?.is_remote_pick,
          allergenPick: item?.is_allergen_pick,
          capacity: item?.custom_capacity,
          barcode: item?.barcode,
          active: item?.status,
          completeItem: item,
        };
        return obj;
      });

      yield yield put(Actions.setLocations(data));
    } else {
      yield yield put(Actions.setLocations([]));
    }
  } catch (error) {
    console.log(error);
  }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/

export function* getLocationsSaga() {
  yield takeLatest(GET_LOCATIONS, locationsList);
}
