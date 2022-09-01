import {combineReducers} from 'redux';

import rouletteReducer from './roulette';
import blackjackReducer from './blackjack';
import slotReducer from './slot';
import crapsReducer from './craps';
import raceReducer from './race';
import kenoReducer from './keno';
import visibilityReducer from './visibility';
import pageReducer from './page';
import loadReducer from './load';

const allReducers = combineReducers({
	roulette: rouletteReducer,
	blackjack: blackjackReducer,
	slot: slotReducer,
	craps: crapsReducer,
	race: raceReducer,
	keno: kenoReducer,
	visibility: visibilityReducer,
	page: pageReducer,
	load: loadReducer,
});

export default allReducers;