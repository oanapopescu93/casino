import {combineReducers} from 'redux';

import rouletteReducer from './roulette';
import blackjackReducer from './blackjack';
import slotReducer from './slot';
import crapsReducer from './craps';
import raceReducer from './race';
import visibilityReducer from './visibility';

const allReducers = combineReducers({
	roulette: rouletteReducer,
	blackjack: blackjackReducer,
	slot: slotReducer,
	craps: crapsReducer,
	race: raceReducer,
	visibility: visibilityReducer,
});

export default allReducers;