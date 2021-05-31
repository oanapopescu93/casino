import {combineReducers} from 'redux';

import rouletteReducer from './roulette';
import blackjackReducer from './blackjack';
import visibilityReducer from './visibility';

const allReducers = combineReducers({
	roulette: rouletteReducer,
	blackjack: blackjackReducer,
	visibility: visibilityReducer,
});

export default allReducers;