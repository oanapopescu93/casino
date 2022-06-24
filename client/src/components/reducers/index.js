import {combineReducers} from 'redux';

import rouletteReducer from './roulette';
import blackjackReducer from './blackjack';
import slotReducer from './slot';
import crapsReducer from './craps';
import raceReducer from './race';
import visibilityReducer from './visibility';
import pageReducer from './page';

const allReducers = combineReducers({
	roulette: rouletteReducer,
	blackjack: blackjackReducer,
	slot: slotReducer,
	craps: crapsReducer,
	race: raceReducer,
	visibility: visibilityReducer,
	page: pageReducer,
});

export default allReducers;