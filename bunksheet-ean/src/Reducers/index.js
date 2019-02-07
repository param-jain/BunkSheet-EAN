import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import SignUpReducer from './SignUpReducer';
import EANReducer from './EANReducer';

export default combineReducers({
    auth: AuthReducer,
    sign_up: SignUpReducer,
    ean: EANReducer
});