import { all, fork } from "redux-saga/effects";
import * as authSaga from "./auth";
import * as productsSaga from "./products";

export default function* root() {
  const sagas = [...Object.values(authSaga), ...Object.values(productsSaga)];
  yield all(sagas.map(fork));
}
