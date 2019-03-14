import { combineReducers } from 'redux';
import authorizationReducer from './authorizationReducer';

export default combineReducers({
    authorization: authorizationReducer

});