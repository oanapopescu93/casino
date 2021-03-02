import {combineReducers} from 'redux';

import rouletteReducer from './roulette';
import visibilityReducer from './visibility';

const allReducers = combineReducers({
	roulette: rouletteReducer,
	visibility: visibilityReducer,
});

export default allReducers;