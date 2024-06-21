import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import rootReducer from './reducers'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})
sagaMiddleware.run(rootSaga)

const root = ReactDOM.createRoot(document.getElementById('casino_root'))
root.render(<Provider store={store}><App /></Provider>)