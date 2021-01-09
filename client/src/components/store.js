import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rouletteReducer from './reducers/roulette';

const middleware = [thunk];

const store = createStore(
    rouletteReducer,
    applyMiddleware(...middleware)
);

export default store;