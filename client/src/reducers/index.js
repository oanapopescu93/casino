import {combineReducers} from 'redux'

import settingsReducer from './settings'
import pageReducer from './page'
import homeReducer from './home'
import authReducer from './auth'
import popupReducer from './popup'
import gamesReducer from './games'
import cartReducer from './cart'
import orderReducer from './order'
import withdrawReducer from './withdraw'
import paymentDetailsReducer from './paymentDetails'
import paymentsReducer from './payments'
import areYouSureReducer from './areYouSure'

const allReducers = combineReducers({	
	settings: settingsReducer,
	page: pageReducer,
	home: homeReducer,
	auth: authReducer,
	popup: popupReducer,
	games: gamesReducer,
	cart: cartReducer,
	order: orderReducer,
	withdraw: withdrawReducer,
	paymentDetails: paymentDetailsReducer,
	payments: paymentsReducer,
	areYouSure: areYouSureReducer,
})

export default allReducers