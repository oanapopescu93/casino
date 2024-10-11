import { all } from 'redux-saga/effects'

import { homeRegister } from './home'
import { paymentRegister } from './payments'

export default function* rootSaga() {
  yield all([
    homeRegister(),
    paymentRegister()
  ])
}