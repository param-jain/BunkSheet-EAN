import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import SignUpReducer from './SignUpReducer';
import LibraryReducer from './LibraryReducer';

export default combineReducers({
    auth: AuthReducer,
    sign_up: SignUpReducer,
    library: LibraryReducer
});