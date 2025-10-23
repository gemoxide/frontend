import { takeLatest, call, put } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  getCurrentUser,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  logout,
  logoutSuccess,
  logoutFailure,
} from "../reducer/auth";
import {
  getLoggedInUserRequest,
  loginRequest as loginRequestService,
} from "../../services/auth/auth.service";
import type { AxiosResponse } from "axios";
import type { LoginRequestActionPayload } from "../types/auth";
import { handleServerException } from "../../services/utils/utils.service";

// Login Saga
function* loginRequestSaga(action: LoginRequestActionPayload) {
  try {
    const { data }: AxiosResponse = yield call(
      loginRequestService,
      action.payload
    );
    yield put(loginSuccess(data));
  } catch (err: unknown) {
    yield call(handleServerException, err, loginFailure.type, true);
  }
}

// Get Current User Saga
function* getCurrentUserSaga() {
  try {
    const { data }: AxiosResponse = yield call(getLoggedInUserRequest);
    yield put(getCurrentUserSuccess(data));
  } catch (err: unknown) {
    yield call(handleServerException, err, getCurrentUserFailure.type, true);
  }
}

// Logout Saga
function* logoutSaga() {
  try {
    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    yield put(logoutSuccess());
  } catch (err: unknown) {
    yield call(handleServerException, err, logoutFailure.type, true);
  }
}

// Root Saga
export function* rootSaga() {
  yield takeLatest(loginRequest.type, loginRequestSaga);
  yield takeLatest(getCurrentUser.type, getCurrentUserSaga);
  yield takeLatest(logout.type, logoutSaga);
}
