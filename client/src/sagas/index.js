import { all } from 'redux-saga/effects'

import {homeRegister} from './home'

export default function* rootSaga() {
  yield all([
    homeRegister(),
  ])
}