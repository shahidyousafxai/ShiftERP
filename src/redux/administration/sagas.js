import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_FACILITIES,
  GET_SEARCHED_USER,
  GET_USERS,
  GET_SEARCHED_FACILITY,
  UPDATE_USER_FACILITIES,
  UPDATE_FACILITY,
  DELETE_FACILITY,
  GET_LOGIN_USER_FACILITIES,
} from "./types";
import * as Actions from "./actions";
import {
  getUsersForAdmin,
  getFacilitiesList,
  getSearchedUser,
  getSearchedFacility,
  updateFacilty,
  getUserFacilities,
  updateUserFacilty,
} from "../../api/administratorApi";
// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* getUsers(action) {
  const { name, roleId, status, order } = action.payload;
  try {
    const response = yield call(getUsersForAdmin, name, roleId, status, order);
    if (response?.data?.data?.users) {
      let data = response?.data?.data?.users?.filter(
        (item) => item?.role !== "User"
      );
      if (order === "desc") {
        let length = data?.length;
        data?.map((item) => {
          return (item.id = length)((length = length - 1));
        });
      } else {
        data?.map((item, index) => {
          return (item.id = index + 1);
        });
      }
      yield put(Actions.setUsers(data));
    } else {
      yield put(Actions.setUsers([]));
    }
  } catch (err) {}
}

function* getSearchedUsers(action) {
  const { name, roleId, status, order } = action.payload;
  try {
    const response = yield call(getSearchedUser, name, roleId, status, order);
    if (response?.data?.data?.users) {
      if (order === "desc") {
        let length = response.data.data.users.length;
        response.data.data.users.map((item) => {
          // eslint-disable-next-line no-sequences
          return (item.id = length), (length = length - 1);
        });
      } else {
        response.data.data.users.map((item, index) => {
          return (item.id = index + 1);
        });
      }
      yield put(Actions.setUsers(response.data.data.users));
    } else {
      yield put(Actions.setUsers([]));
    }
  } catch (err) {}
}

function* getSearchedFacilities(action) {
  const { name, primaryContact, status, order } = action.payload;
  try {
    const response = yield call(
      getSearchedFacility,
      name,
      primaryContact,
      status,
      order
    );
    if (response?.data?.data?.facilities) {
      if (order === "desc") {
        let length = response.data.data.facilities.length;
        response.data.data.facilities.map((item) => {
          // eslint-disable-next-line no-sequences
          return (item.id = length), (length = length - 1);
        });
      } else {
        response.data.data.facilities.map((item, index) => {
          return (item.id = index + 1);
        });
      }
      yield put(Actions.setFacilities(response.data.data.facilities));
    } else {
      yield put(Actions.setFacilities([]));
    }
  } catch (err) {}
}

function* updateUserFacilities(action) {
  const payload = action.payload;
  try {
    yield call(updateUserFacilty, payload);
    // yield put(Actions.getUsers());
    // yield put(Actions.getFacilities('', '', '', ''));
  } catch (err) {}
}

function* getFacilities(action) {
  const { name, status, order } = action.payload;

  try {
    const response = yield call(getFacilitiesList, name, status, order);
    if (response?.data?.data?.facilities) {
      if (order === "desc") {
        let length = response?.data?.data?.facilities.length;
        response?.data?.data?.facilities.map((item) => {
          // eslint-disable-next-line no-sequences
          return (item.id = length), (length = length - 1);
        });
      } else {
        response?.data?.data?.facilities.map((item, index) => {
          return (item.id = index + 1);
        });
      }
      yield put(Actions.setFacilities(response.data.data.facilities));
    } else {
      yield put(Actions.setFacilities([]));
    }
  } catch (err) {}
}

function* updateFacilityData(action) {
  const {
    userId,
    uuid,
    name,
    office_phone,
    address,
    city,
    state,
    zip_code,
    primary_contact_email,
    primary_contact_name,
    status,
  } = action.payload;
  try {
    const response = yield call(
      updateFacilty,
      uuid,
      name,
      office_phone,
      address,
      city,
      state,
      zip_code,
      primary_contact_email,
      primary_contact_name,
      status
    );
    if (response?.data?.data?.facility) {
      yield put(Actions.setLoginUserFacilities([]));
      yield put(Actions.getLoginUserFacilities(userId));
    }
  } catch (err) {}
}

function* getLoginUserFacilities(action) {
  const id = action.payload;
  try {
    const response = yield call(getUserFacilities, id);
    if (response?.data?.data?.facilities) {
      yield put(Actions.setLoginUserFacilities(response.data.data.facilities));
    }
    if (response?.error === 404) {
      yield put(Actions.setLoginUserFacilities([]));
    }
  } catch (err) {}
}

function* deleteFacilityData(action) {
  // const uuid = action.payload;
  try {
    // const response = yield call(deleteFacilty, uuid);q
    yield put(Actions.getFacilities());
  } catch (err) {}
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
export function* getUsersSaga() {
  yield takeLatest(GET_USERS, getUsers);
  yield takeLatest(GET_FACILITIES, getFacilities);
  yield takeLatest(GET_SEARCHED_USER, getSearchedUsers);
  yield takeLatest(GET_SEARCHED_FACILITY, getSearchedFacilities);
  yield takeLatest(UPDATE_USER_FACILITIES, updateUserFacilities);
  yield takeLatest(UPDATE_FACILITY, updateFacilityData);
  yield takeLatest(DELETE_FACILITY, deleteFacilityData);
  yield takeLatest(GET_LOGIN_USER_FACILITIES, getLoginUserFacilities);
}
