import {combineReducers} from 'redux';

import rouletteReducer from './roulette';

const allReducers = combineReducers({
	roulette: rouletteReducer,
});

export default allReducers;