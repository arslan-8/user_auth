import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { forgotPasswordReducer, userReducer, userDetailsReducer, profileReducer, allUsersReducer } from './reducers/userReducer';

const reducer = combineReducers({
    user: userReducer,
    forgotPassword: forgotPasswordReducer, 
    userDetails: userDetailsReducer,
    profile: profileReducer,
    allUsers: allUsersReducer,
    
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;