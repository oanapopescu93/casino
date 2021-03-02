import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rouletteReducer from './reducers/roulette';
import visibilityReducer from './reducers/visibility';

const middleware = [thunk];

const store = createStore(
    rouletteReducer,
    visibilityReducer,
    applyMiddleware(...middleware)
);

export default store;