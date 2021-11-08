import {combineReducers} from 'redux';

import rouletteReducer from './roulette';
import blackjackReducer from './blackjack';
import slotReducer from './slot';
import visibilityReducer from './visibility';

const allReducers = combineReducers({
	roulette: rouletteReducer,
	blackjack: blackjackReducer,
	slot: slotReducer,
	visibility: visibilityReducer,
});

export default allReducers;