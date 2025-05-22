import { all } from "redux-saga/effects";

import example from "./examples/sagas";

export default function* rootSaga() {
  yield all([example]);
}
