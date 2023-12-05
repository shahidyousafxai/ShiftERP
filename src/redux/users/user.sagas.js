import { takeLatest, put } from "redux-saga/effects";
import { refreshApi } from "../../api/authApi.js";
import { getUserProfilePictureApi } from "../../api/profileSettingApi.js";
import { setAuthToken } from "../../helpers/axios.js";
import {
  userImageStart,
  userImageSuccess,
  userRefreshSuccess,
} from "./user.actions.js";
import { userTypes } from "./user.types.js";

function* handlePersistor({ payload }) {
  let token = payload?.user?.token;
  try {
    yield setAuthToken(token);
    // yield put(userRefreshStart());
  } catch (error) {}
}
export function* persistor() {
  yield takeLatest("persist/REHYDRATE", handlePersistor);
}

function* handleUserRefresh() {
  try {
    let response = yield refreshApi();
    if (response.data.success) {
      yield put(userRefreshSuccess(response.data.data));
    }
  } catch (error) {}
}
export function* userRefresh() {
  yield takeLatest(userTypes.refreshStart, handleUserRefresh);
}

function* handleUserImage() {
  try {
    let { data } = yield getUserProfilePictureApi();
    if (data.success) {
      yield put(userImageSuccess(data?.data[0]?.profile_pic[0]?.url));
    } else {
      throw new Error("Failed to Fetch");
    }
  } catch (error) {}
}
export function* userImage() {
  yield takeLatest(userTypes.userImageStart, handleUserImage);
}

function* handleUserLogin({ payload }) {
  //whenever user login fetch its imageurl  and set token
  yield setAuthToken(payload.token);

  yield put(userImageStart());
}
export function* userLogin() {
  yield takeLatest(userTypes.logIn, handleUserLogin);
}
