import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { forgotPasswordReducer, userReducer, userDetailsReducer } from './reducers/userReducer';

const reducer = combineReducers({
    user: userReducer,
    forgotPassword: forgotPasswordReducer, 
    userDetails: userDetailsReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;